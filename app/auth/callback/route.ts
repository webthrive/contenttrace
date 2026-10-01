import { NextResponse } from "next/server";
import { supabaseFromCookies } from "@/lib/billing/supabase";

export const dynamic = "force-dynamic";

// The sign-in email link lands here. Exchange the one-time code for a session cookie, then continue.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") || "/account";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account"; // same-site only

  if (code) {
    const sb = await supabaseFromCookies();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    console.error("Sign-in code exchange failed:", error.message);
  }
  return NextResponse.redirect(new URL("/login?error=link", url.origin));
}
