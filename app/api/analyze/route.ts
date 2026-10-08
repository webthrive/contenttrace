import { logError } from "@/lib/log";
import { scoringText } from "@/lib/markdown";
import { NextRequest } from "next/server";
import { PLANS, billingEnabled, countWords, currentPeriod } from "@/lib/billing/config";
import { getStatus, reserve, supabaseStore, type Reservation } from "@/lib/billing/entitlements";
import { getIdentity, verifyTurnstile } from "@/lib/billing/identity";
import { supabaseAdmin } from "@/lib/billing/supabase";
import { AnalysisFailure, analyzeText, type AnalysisOutput } from "@/lib/analyzer";
import { judgeReadiness, signHumanPass, subjectOf, verifyHumanPass, verifyRecheck, type Readiness, type RecheckPayload } from "@/lib/optimizer";

// Sections run in parallel, so a full analysis normally finishes in well under this limit.
export const maxDuration = 60;

// Save a finished analysis to the user's history. A failure here never breaks the analysis.
// An optimizer re-check is saved with its optimization details (original text, changes, scores before).
async function saveAnalysis(userId: string, text: string, result: AnalysisOutput & { optimization?: unknown }): Promise<string | null> {
  const preview = scoringText(text).replace(/\s+/g, " ").trim().slice(0, 160);
  try {
    const { data, error } = await supabaseAdmin()
      .from("analyses")
      .insert({
        user_id: userId,
        content_type: result.contentType?.label ?? null,
        word_count: result.wordCount,
        score: result.aggregateScore,
        verdict: result.verdict,
        preview: result.optimization ? `Optimized: ${preview}`.slice(0, 160) : preview,
        input_text: text,
        result,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id as string;
  } catch (err) {
    logError("Could not save analysis to history:", err);
    return null;
  }
}

// Optimization details sent by the browser with a re-check, kept only for the user's own history.
function cleanOptimization(v: unknown, recheck: RecheckPayload, readiness: Readiness | null): Record<string, unknown> | undefined {
  if (!v || typeof v !== "object") return undefined;
  try {
    const o = { ...(v as Record<string, unknown>), goal: recheck.g, keyword: recheck.k, parentId: recheck.p, readinessAfter: readiness };
    return JSON.stringify(o).length <= 250_000 ? o : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  let text: string;
  let requestedType: unknown;
  let turnstileToken: unknown;
  let recheckToken: unknown;
  let optimization: unknown;
  let humanPass: unknown;
  try {
    ({ text, contentType: requestedType, turnstileToken, recheckToken, optimization, humanPass } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!text || typeof text !== "string" || text.trim().length < 50) {
    return Response.json({ error: "Please provide at least 50 characters of text to analyze." }, { status: 400 });
  }
  const maxChars = billingEnabled() ? PLANS.pro.charLimit : PLANS.free.charLimit;
  // A re-check of optimized text may run a little longer than the original (up to 20% more).
  if (text.length > (recheckToken ? Math.round(maxChars * 1.25) : maxChars)) {
    return Response.json({ error: `Text must be under ${maxChars.toLocaleString()} characters.` }, { status: 400 });
  }

  // Usage limits (only when the database is configured; otherwise the site runs without limits).
  let reservation: Reservation | null = null;
  let historyUserId: string | null = null; // signed-in users get their results saved
  let recheck: RecheckPayload | null = null; // set when this run scores an optimizer rewrite (already paid for)
  let releaseRecheck: (() => Promise<void>) | null = null; // lets the user retry a failed re-check
  let newHumanPass: string | null = null; // free visitors who pass the check get a 30-minute pass
  if (billingEnabled()) {
    try {
      const store = supabaseStore(supabaseAdmin());
      const identity = await getIdentity();
      historyUserId = identity.userId;
      if (recheckToken) {
        recheck = verifyRecheck(recheckToken, text, subjectOf(identity));
        // Each token works once: count it as one "analysis" with a limit of 1.
        if (!recheck || !(await store.consumeUsage(`recheck:${recheck.id}`, currentPeriod(), 0, 1, null))) {
          return Response.json({ error: "This re-check has expired. Please run the optimizer again.", code: "recheck" }, { status: 403 });
        }
        const subject = `recheck:${recheck.id}`;
        releaseRecheck = () => store.releaseUsage(subject, currentPeriod(), 0);
      } else {
        const status = await getStatus(store, identity);
        if (status.plan === "free") {
          const sub = subjectOf(identity);
          if (!verifyHumanPass(humanPass, sub)) {
            if (!(await verifyTurnstile(turnstileToken))) {
              return Response.json({ error: "Please complete the quick human check and try again.", code: "bot_check" }, { status: 403 });
            }
            newHumanPass = signHumanPass(sub);
          }
        }
        reservation = await reserve(store, identity, text, countWords(text));
        if (!reservation.ok) {
          return Response.json({ error: reservation.message, code: reservation.code }, { status: reservation.code === "limit" ? 402 : 413 });
        }
      }
    } catch (err) {
      logError("Billing check failed:", err);
      return Response.json({ error: "We could not check your plan right now. Please try again in a moment." }, { status: 503 });
    }
  } else if (recheckToken) {
    // Local development without a database: no limits, but still read the goal and keyword.
    try { recheck = verifyRecheck(recheckToken, text, subjectOf(await getIdentity())); } catch { recheck = null; }
  }
  const releaseUsage = async () => {
    try {
      if (reservation?.ok) await reservation.release();
      if (releaseRecheck) await releaseRecheck();
    } catch (err) { logError("Usage release failed:", err); }
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      // Optimizer re-check: also score Search & AI-answer readiness, in parallel with the analysis.
      const readinessPromise: Promise<Readiness | null> = recheck
        ? judgeReadiness(text, recheck.k).catch((err) => { logError("Readiness check failed:", err); return null; })
        : Promise.resolve(null);

      try {
        const result = await analyzeText(scoringText(text), requestedType, send); // markdown marks removed: same as plain pasted text
        const readiness = await readinessPromise;
        if (readiness) send({ type: "readiness", readiness });
        const opt = recheck ? cleanOptimization(optimization, recheck, readiness) : undefined;
        const historyId = historyUserId ? await saveAnalysis(historyUserId, text, opt ? { ...result, optimization: opt } : result) : null;
        send({ type: "complete", result, historyId, ...(newHumanPass ? { humanPass: newHumanPass } : {}) });
      } catch (err) {
        logError("Anthropic API error:", err instanceof AnalysisFailure ? err.causes : err);
        await releaseUsage(); // failed analyses do not count against the user's limit
        send({
          type: "error",
          message: err instanceof AnalysisFailure && err.rateLimited
            ? "High demand right now. Please wait a minute and try again."
            : "The analysis service is unavailable. Please try again in a moment.",
        });
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
