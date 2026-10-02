import { supabaseFromCookies, getSessionUser } from "@/lib/billing/supabase";
import { billingEnabled } from "@/lib/billing/config";
import { logError } from "@/lib/log";

export const dynamic = "force-dynamic";

// The signed-in user's saved analyses, newest first. Row-level security limits rows to the user's own.
export async function GET(req: Request) {
  const limit = Math.min(200, Math.max(1, Number(new URL(req.url).searchParams.get("limit")) || 200));
  if (!billingEnabled()) return Response.json({ error: "History is not available." }, { status: 404 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Please sign in.", code: "login" }, { status: 401 });
  try {
    const sb = await supabaseFromCookies();
    const { data, error, count } = await sb
      .from("analyses")
      .select("id, created_at, content_type, word_count, score, verdict, preview", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Response.json({ items: data ?? [], total: count ?? (data?.length ?? 0) });
  } catch (err) {
    logError("History list failed:", err);
    return Response.json({ error: "Could not load your history." }, { status: 500 });
  }
}
