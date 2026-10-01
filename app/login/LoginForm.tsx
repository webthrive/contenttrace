"use client";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { authAvailable, supabaseBrowser } from "@/lib/billing/browser";

const card: React.CSSProperties = { border: "1px solid var(--border)", borderRadius: "16px", background: "var(--bg-card)", padding: "28px", boxShadow: "0 2px 12px rgba(1,2,33,0.06)" };
const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "12px 14px", fontSize: "16px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "var(--font)" };
const primaryBtn: React.CSSProperties = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 18px", background: "var(--accent)", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" };

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [next, setNext] = useState("/account");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const n = p.get("next");
    if (n && n.startsWith("/") && !n.startsWith("//")) setNext(n);
    if (p.get("error") === "link") setError("That sign-in link has expired or was opened in a different browser. Please request a new one.");
  }, []);

  if (!authAvailable()) {
    return (
      <div style={card}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Sign in</h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>Accounts are not available yet. Free analyses work without an account.</p>
      </div>
    );
  }

  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Please enter a valid email address."); return; }
    setState("sending"); setError(null);
    const { error } = await supabaseBrowser().auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
    if (error) { setError(error.message); setState("idle"); } else setState("sent");
  };

  const google = async () => {
    setError(null);
    const { error } = await supabaseBrowser().auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirectTo() } });
    if (error) setError(error.message);
  };

  return (
    <div style={card}>
      <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>Sign in</h1>
      <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "22px", lineHeight: 1.6 }}>
        No password needed. We email you a one-time sign-in link.
      </p>

      {state === "sent" ? (
        <div style={{ border: "1px solid rgba(10,115,115,0.3)", background: "var(--accent-light)", borderRadius: "10px", padding: "16px", fontSize: "15px", color: "var(--text-primary)", lineHeight: 1.6 }}>
          Check your inbox at <strong>{email}</strong> and click the link. Open it in this same browser.
        </div>
      ) : (
        <form onSubmit={sendLink} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ fontSize: "13px", color: "var(--text-muted)" }} htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={input} />
          <button type="submit" disabled={state === "sending"} style={{ ...primaryBtn, opacity: state === "sending" ? 0.6 : 1 }}>
            <Mail size={16} />{state === "sending" ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
      )}

      {process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true" && state !== "sent" && (
        <button onClick={google} style={{ ...primaryBtn, marginTop: "12px", background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Continue with Google
        </button>
      )}

      {error && <p style={{ marginTop: "14px", fontSize: "14px", color: "var(--red)" }}>{error}</p>}

      <p style={{ marginTop: "20px", fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
        By signing in you agree to our <a href="/terms" style={{ color: "var(--accent)" }}>Terms</a> and <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</a>.
      </p>
    </div>
  );
}
