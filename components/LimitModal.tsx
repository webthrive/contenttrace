"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, X } from "lucide-react";
import { authAvailable, supabaseBrowser } from "@/lib/billing/browser";
import { PLANS, PRO_YEARLY_PER_MONTH } from "@/lib/billing/config";

export const DRAFT_KEY = "ct_draft";

// Save the text so it comes back after the visitor opens the sign-in link (often in a new tab).
export function saveDraft(text: string) {
  try { if (text.trim()) localStorage.setItem(DRAFT_KEY, JSON.stringify({ text, at: Date.now() })); } catch { /* storage blocked */ }
}

// Returns a draft saved in the last 24 hours, once.
export function takeDraft(): string | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    localStorage.removeItem(DRAFT_KEY);
    const d = JSON.parse(raw) as { text?: string; at?: number };
    return d.text && d.at && Date.now() - d.at < 86_400_000 ? d.text : null;
  } catch { return null; }
}

// Front-and-center notice when a plan limit stops an analysis or optimize run.
// Visitors who are not signed in can enter an email to create a free account (5 more free analyses).
export default function LimitModal({ message, code = "limit", signedIn, plan, draftText, onClose }: {
  message: string;
  code?: string; // "limit" (out of analyses) or "too_long" (text over the plan's length)
  signedIn: boolean;
  plan?: string;
  draftText?: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const offerAccount = code === "limit" && !signedIn && authAvailable() && (plan ?? "free") === "free";
  // First sentence is the title. The rest ("Upgrade to Pro...") is covered by the plans line below.
  const [title, ...rest] = message.split(/(?<=[.!?])\s+/);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Please enter a valid email address."); return; }
    setState("sending"); setError(null);
    if (draftText) saveDraft(draftText);
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname || "/")}`;
    const { error } = await supabaseBrowser().auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } });
    if (error) { setError(error.message); setState("idle"); return; }
    setState("sent");
    try { (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "sign_up_email", method: "limit_modal" }); } catch { /* no GTM */ }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(1,2,33,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div ref={boxRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="limit-title" onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: "480px", maxHeight: "calc(100vh - 32px)", overflowY: "auto", background: "var(--bg-card)", borderRadius: "16px", padding: "28px 24px 24px", boxShadow: "0 20px 60px rgba(1,2,33,0.35)", outline: "none" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "6px" }}><X size={18} /></button>

        <h2 id="limit-title" style={{ fontSize: "21px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, margin: "0 24px 10px 0" }}>{title}</h2>
        {!offerAccount && rest.length > 0 && code !== "limit" && <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 12px" }}>{rest.join(" ")}</p>}

        {offerAccount && (
          <div style={{ border: "1px solid rgba(10,115,115,0.35)", background: "var(--accent-light)", borderRadius: "12px", padding: "16px", margin: "14px 0 18px" }}>
            {state === "sent" ? (
              <div style={{ fontSize: "15px", color: "var(--text-primary)", lineHeight: 1.6 }}>
                Check your inbox at <strong>{email}</strong> and click the link. Your text is saved in this browser and comes back when you sign in.
              </div>
            ) : (
              <form onSubmit={sendLink}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>Get {PLANS.free.analysesPerMonth} more free analyses</div>
                <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: 1.5 }}>Create a free account with your email. No password and no card. Your results are saved to your history.</div>
                <label htmlFor="limit-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Email address</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <input id="limit-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    style={{ flex: "1 1 200px", minWidth: 0, padding: "11px 12px", fontSize: "16px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "var(--font)" }} />
                  <button type="submit" disabled={state === "sending"} style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "6px", padding: "11px 16px", borderRadius: "8px", border: "none", background: "var(--accent)", color: "white", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", opacity: state === "sending" ? 0.6 : 1 }}>
                    <Mail size={15} />{state === "sending" ? "Sending…" : "Send sign-in link"}
                  </button>
                </div>
                {error && <div style={{ marginTop: "8px", fontSize: "13px", color: "var(--red)" }}>{error}</div>}
                <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                  By signing up you agree to our <a href="/terms" style={{ color: "var(--accent)" }}>Terms</a> and <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</a>.
                </div>
              </form>
            )}
          </div>
        )}

        <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
          {offerAccount ? "Need more? " : ""}Pro is ${PRO_YEARLY_PER_MONTH} a month billed yearly (${PLANS.pro.yearlyPrice}), or ${PLANS.pro.monthlyPrice} month to month, for {PLANS.pro.wordsPerMonth.toLocaleString()} words a month and texts up to {PLANS.pro.charLimit.toLocaleString()} characters. Or buy a one-time Word Pack ({PLANS.pack.words.toLocaleString()} words for ${PLANS.pack.price}).
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a href="/pricing" style={{ padding: "10px 16px", borderRadius: "8px", background: offerAccount ? "var(--bg-card)" : "var(--accent)", color: offerAccount ? "var(--text-primary)" : "white", border: offerAccount ? "1px solid var(--border)" : "none", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>See plans</a>
          <button onClick={onClose} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }}>Close</button>
        </div>
      </div>
    </div>
  );
}
