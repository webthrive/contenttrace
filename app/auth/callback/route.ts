import { logError } from "@/lib/log";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseFromCookies } from "@/lib/billing/supabase";

export const dynamic = "force-dynamic";

const OTP_TYPES: EmailOtpType[] = ["email", "magiclink", "signup", "invite", "recovery", "email_change"];

// The sign-in email link lands here.
// - token_hash link (email template uses {{ .TokenHash }}): works in any browser or device.
// - code link (default template): works only in the browser that asked for the link.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const nextParam = url.searchParams.get("next") || "/account";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/account"; // same-site only
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const code = url.searchParams.get("code");

  const sb = await supabaseFromCookies();

  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    logError("Sign-in link check failed:", error.message);
  } else if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    logError("Sign-in code exchange failed:", error.message);
  }
  return NextResponse.redirect(new URL("/login?error=link", url.origin));
}
