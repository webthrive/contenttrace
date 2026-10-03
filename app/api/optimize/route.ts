import { logError } from "@/lib/log";
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { OPTIMIZE_FREE_UNITS, OPTIMIZE_WORD_MULTIPLIER, PLANS, billingEnabled, countWords } from "@/lib/billing/config";
import { getStatus, reserve, supabaseStore, type Reservation } from "@/lib/billing/entitlements";
import { getIdentity, verifyTurnstile } from "@/lib/billing/identity";
import { supabaseAdmin } from "@/lib/billing/supabase";
import { CONTENT_PROFILES, isContentTypeId } from "@/lib/contentTypes";
import { isGoal, judgeReadiness, rewrite, signRecheck, subjectOf, textHash, weakestFactors, type Readiness } from "@/lib/optimizer";

// Rewrites run in parallel parts, so a run normally finishes in 15-30 seconds.
export const maxDuration = 60;
const DEADLINE_MS = 55_000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Content Optimizer, step 1: rewrite the text for the chosen goal and score the original's readiness.
// Step 2 is a re-check of the rewrite through /api/analyze with the signed token returned here.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { text, goal, contentType, result, turnstileToken } = body;
  const keyword = typeof body.keyword === "string" ? body.keyword.replace(/\s+/g, " ").trim().slice(0, 120) : "";
  const parentId = typeof body.parentId === "string" && UUID.test(body.parentId) ? body.parentId : null;

  if (typeof text !== "string" || text.trim().length < 50) {
    return Response.json({ error: "Please provide at least 50 characters of text to optimize." }, { status: 400 });
  }
  if (!isGoal(goal)) return Response.json({ error: "Please choose a goal." }, { status: 400 });
  const maxChars = billingEnabled() ? PLANS.pro.charLimit : PLANS.free.charLimit;
  if (text.length > maxChars) {
    return Response.json({ error: `Text must be under ${maxChars.toLocaleString()} characters.` }, { status: 400 });
  }

  let reservation: Reservation | null = null;
  let subject = "";
  try {
    const identity = await getIdentity();
    subject = subjectOf(identity);
    if (billingEnabled()) {
      const store = supabaseStore(supabaseAdmin());
      const status = await getStatus(store, identity);
      if (status.plan === "free" && !(await verifyTurnstile(turnstileToken))) {
        return Response.json({ error: "Please complete the quick human check and try again.", code: "bot_check" }, { status: 403 });
      }
      reservation = await reserve(store, identity, text, countWords(text) * OPTIMIZE_WORD_MULTIPLIER, new Date(), OPTIMIZE_FREE_UNITS);
      if (!reservation.ok) {
        return Response.json({ error: reservation.message, code: reservation.code }, { status: reservation.code === "limit" ? 402 : 413 });
      }
    }
  } catch (err) {
    logError("Billing check failed (optimize):", err);
    return Response.json({ error: "We could not check your plan right now. Please try again in a moment." }, { status: 503 });
  }
  const releaseUsage = async () => {
    if (reservation?.ok) {
      try { await reservation.release(); } catch (err) { logError("Usage release failed:", err); }
    }
  };

  const typeId = isContentTypeId(contentType) ? contentType : "general";
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      const readinessBefore: Promise<Readiness | null> = judgeReadiness(text, keyword).catch((err) => {
        logError("Readiness check failed:", err);
        return null;
      });

      let timer: ReturnType<typeof setTimeout> | undefined;
      const deadline = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("deadline")), DEADLINE_MS); });

      try {
        const out = await Promise.race([
          rewrite(text, {
            goal,
            keyword,
            contentLabel: CONTENT_PROFILES[typeId].label,
            weaknesses: weakestFactors(result),
            onProgress: (done, total) => send({ type: "progress", done, total }),
            // A repair pass takes about 20 seconds; start one only if it can finish before the deadline.
            repairUntil: Date.now() + DEADLINE_MS - 22_000,
          }),
          deadline,
        ]);
        const before = await Promise.race([readinessBefore, new Promise<null>((r) => setTimeout(() => r(null), 5_000))]);
        const recheckToken = signRecheck({ h: textHash(out.rewritten), sub: subject, p: parentId, g: goal, k: keyword });
        send({ type: "complete", ...out, readinessBefore: before, recheckToken });
      } catch (err) {
        logError("Optimize failed:", err);
        await releaseUsage(); // failed runs do not count against the user's limit
        const busy = err instanceof Anthropic.APIError && (err.status === 429 || err.status === 529);
        send({
          type: "error",
          message: busy
            ? "High demand right now. Please wait a minute and try again."
            : err instanceof Error && err.message === "deadline"
              ? "This text took too long to optimize. Please try a shorter section."
              : "The optimizer is unavailable. Please try again in a moment.",
        });
      } finally {
        clearTimeout(timer);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
