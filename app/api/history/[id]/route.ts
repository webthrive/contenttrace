import { supabaseFromCookies, getSessionUser } from "@/lib/billing/supabase";
import { logError } from "@/lib/log";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "Not found." }, { status: 404 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Please sign in.", code: "login" }, { status: 401 });
  try {
    const sb = await supabaseFromCookies();
    const { data, error } = await sb
      .from("analyses")
      .select("id, created_at, input_text, result")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json(data);
  } catch (err) {
    logError("History read failed:", err);
    return Response.json({ error: "Could not load this analysis." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "Not found." }, { status: 404 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Please sign in.", code: "login" }, { status: 401 });
  try {
    const sb = await supabaseFromCookies();
    const { error } = await sb.from("analyses").delete().eq("id", id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (err) {
    logError("History delete failed:", err);
    return Response.json({ error: "Could not delete this analysis." }, { status: 500 });
  }
}
