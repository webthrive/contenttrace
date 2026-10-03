import { supabaseFromCookies, getSessionUser } from "@/lib/billing/supabase";
import { billingEnabled } from "@/lib/billing/config";
import { logError } from "@/lib/log";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The signed-in user's saved analyses, newest first. Row-level security limits rows to the user's own.
export async function GET(req: Request) {
  const limit = Math.min(200, Math.max(1, Number(new URL(req.url).searchParams.get("limit")) || 200));
  if (!billingEnabled()) return Response.json({ error: "History is not available." }, { status: 404 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Please sign in.", code: "login" }, { status: 401 });
  const parent = new URL(req.url).searchParams.get("parent");
  if (parent && !UUID.test(parent)) return Response.json({ error: "Not found." }, { status: 404 });
  try {
    const sb = await supabaseFromCookies();
    const base = "id, created_at, content_type, word_count, score, verdict, preview";
    // Optimized versions carry their goal and the analysis they came from inside the saved result.
    // If this extended query ever fails, fall back to the plain list so history keeps working.
    const extended = `${base}, goal:result->optimization->>goal, parent_id:result->optimization->>parentId`;
    const run = (cols: string) => {
      let q = sb.from("analyses").select(cols, { count: "exact" }).order("created_at", { ascending: false }).limit(limit);
      if (parent) q = q.eq("result->optimization->>parentId", parent);
      return q;
    };
    let { data, error, count } = await run(extended);
    if (error) {
      if (parent) return Response.json({ items: [], total: 0 }); // saved optimizations are optional extras
      ({ data, error, count } = await run(base));
    }
    if (error) throw error;
    return Response.json({ items: data ?? [], total: count ?? (data?.length ?? 0) });
  } catch (err) {
    logError("History list failed:", err);
    return Response.json({ error: "Could not load your history." }, { status: 500 });
  }
}
