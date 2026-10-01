"use client";
import { useEffect, useState } from "react";
import { fetchUsage, supabaseBrowser, authAvailable, type UsageInfo } from "@/lib/billing/browser";

const card: React.CSSProperties = { border: "1px solid var(--border)", borderRadius: "16px", background: "var(--bg-card)", padding: "24px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(1,2,33,0.05)" };
const label: React.CSSProperties = { fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "6px" };
const btn: React.CSSProperties = { padding: "10px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", textDecoration: "none", display: "inline-block" };

function Meter({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div style={{ height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden", margin: "8px 0 6px" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: pct > 90 ? "var(--amber)" : "var(--accent)" }} />
    </div>
  );
}

export default function AccountPanel() {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("checkout") === "success") {
      setNotice("Thank you! Your payment went through. It can take a few seconds for your plan to show here.");
      window.history.replaceState(null, "", "/account");
      // The webhook may arrive a moment after the redirect, so check again shortly.
      setTimeout(() => fetchUsage().then(setUsage), 4000);
    }
    fetchUsage().then(setUsage);
  }, []);

  const openPortal = async () => {
    setBusy(true); setError(null);
    const r = await fetch("/api/stripe/portal", { method: "POST" });
    const j = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
    if (j.url) window.location.href = j.url;
    else { setError(j.error || "Could not open billing."); setBusy(false); }
  };

  const signOut = async () => {
    await supabaseBrowser().auth.signOut();
    window.location.href = "/";
  };

  if (!usage) return <p style={{ color: "var(--text-muted)" }}>Loading…</p>;

  if (!usage.enabled || !authAvailable()) {
    return (
      <div style={card}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Account</h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>Accounts are not available yet. Free analyses work without an account.</p>
      </div>
    );
  }

  if (!usage.signedIn) {
    if (typeof window !== "undefined") window.location.href = "/login?next=/account";
    return null;
  }

  const planName = usage.plan === "pro" ? "Pro" : usage.plan === "pack" ? "Word Pack" : "Free";
  const renew = usage.subPeriodEnd ? new Date(usage.subPeriodEnd).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : null;

  return (
    <>
      <h1 style={{ fontSize: "30px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Your account</h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "22px" }}>{usage.email}</p>

      {notice && <div role="status" style={{ ...card, background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.3)", fontSize: "15px", color: "var(--text-primary)" }}>{notice}</div>}

      <div style={card}>
        <div style={label}>Plan</div>
        <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}>{planName}</div>
        {usage.plan === "pro" && renew && <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>Current period ends {renew}</p>}

        {usage.plan === "pro" && usage.proWordsTotal != null && usage.proWordsLeft != null && (
          <div style={{ marginTop: "16px" }}>
            <div style={label}>Pro words this month</div>
            <Meter used={usage.proWordsTotal - usage.proWordsLeft} total={usage.proWordsTotal} />
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{usage.proWordsLeft.toLocaleString()} of {usage.proWordsTotal.toLocaleString()} words left</div>
          </div>
        )}

        {(usage.packWords ?? 0) > 0 && (
          <div style={{ marginTop: "16px" }}>
            <div style={label}>Word Pack balance</div>
            <div style={{ fontSize: "16px", color: "var(--text-primary)", fontWeight: 600 }}>{(usage.packWords ?? 0).toLocaleString()} words</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Pack words never expire.</div>
          </div>
        )}

        {usage.plan === "free" && usage.freeAnalysesTotal != null && usage.freeAnalysesLeft != null && (
          <div style={{ marginTop: "16px" }}>
            <div style={label}>Free analyses this month</div>
            <Meter used={usage.freeAnalysesTotal - usage.freeAnalysesLeft} total={usage.freeAnalysesTotal} />
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{usage.freeAnalysesLeft} of {usage.freeAnalysesTotal} left · resets on the 1st</div>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
          {usage.plan !== "pro" && <a href="/pricing" style={{ ...btn, background: "var(--accent)", color: "white" }}>Upgrade to Pro</a>}
          <a href="/pricing" style={{ ...btn, border: "1px solid var(--border)", color: "var(--text-primary)", background: "var(--bg-elevated)" }}>Buy a Word Pack</a>
          {usage.payments && (usage.plan === "pro" || (usage.packWords ?? 0) > 0) && (
            <button onClick={openPortal} disabled={busy} style={{ ...btn, border: "1px solid var(--border)", color: "var(--text-primary)", background: "var(--bg-card)" }}>
              {busy ? "Opening…" : "Manage billing & invoices"}
            </button>
          )}
        </div>
        {error && <p role="alert" style={{ marginTop: "12px", fontSize: "14px", color: "var(--red)" }}>{error}</p>}
      </div>

      <a href="/account/history" style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none" }}>
        <span>
          <span style={{ display: "block", fontSize: "17px", fontWeight: 700, color: "var(--text-primary)" }}>Your past analyses</span>
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Open, review or delete the results you saved.</span>
        </span>
        <span style={{ fontSize: "20px", color: "var(--accent)" }}>→</span>
      </a>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <a href="/" style={{ fontSize: "14px", color: "var(--accent)" }}>← Back to the analyzer</a>
        <button onClick={signOut} style={{ ...btn, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)" }}>Sign out</button>
      </div>
    </>
  );
}
