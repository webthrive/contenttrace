"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { OPTIMIZE_FREE_UNITS, OPTIMIZE_WORD_MULTIPLIER, PLANS, PRO_YEARLY_PER_MONTH, PRO_YEARLY_SAVE_PCT } from "@/lib/billing/config";
import { fetchUsage, startCheckout, type UsageInfo } from "@/lib/billing/browser";

type Billing = "monthly" | "yearly";

const cardBase: React.CSSProperties = { border: "1px solid var(--border)", borderRadius: "16px", background: "var(--bg-card)", padding: "26px 24px", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(1,2,33,0.05)" };
const btn: React.CSSProperties = { width: "100%", padding: "12px 16px", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", textAlign: "center", textDecoration: "none", display: "block", boxSizing: "border-box" };

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
      <Check size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "3px" }} />
      <span>{children}</span>
    </li>
  );
}

export default function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("yearly");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buy = async (kind: "monthly" | "yearly" | "pack") => {
    setBusy(kind); setError(null);
    const err = await startCheckout(kind);
    if (err) { setError(err); setBusy(null); }
  };

  useEffect(() => {
    fetchUsage().then(setUsage);
    // Returning from sign-in with a plan already chosen: continue straight to checkout.
    const p = new URLSearchParams(window.location.search);
    const k = p.get("buy");
    if (k === "monthly" || k === "yearly" || k === "pack") {
      window.history.replaceState(null, "", "/pricing");
      buy(k);
    }
    if (p.get("checkout") === "cancel") setError("Checkout was canceled. You have not been charged.");
  }, []);

  const paymentsOn = usage?.enabled && usage.payments;
  const isPro = usage?.plan === "pro";
  const yearlyMonthly = PRO_YEARLY_PER_MONTH;
  const savePct = PRO_YEARLY_SAVE_PCT;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Monthly / yearly switch */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
        <div role="tablist" aria-label="Billing period" style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: "999px", padding: "4px", background: "var(--bg-card)" }}>
          {(["yearly", "monthly"] as Billing[]).map((b) => (
            <button key={b} role="tab" aria-selected={billing === b} onClick={() => setBilling(b)}
              style={{ padding: "8px 18px", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font)",
                background: billing === b ? "var(--accent)" : "transparent", color: billing === b ? "white" : "var(--text-secondary)" }}>
              {b === "monthly" ? "Monthly" : <>Yearly <span style={{ marginLeft: "6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", padding: "2px 7px", borderRadius: "999px", background: billing === b ? "rgba(255,255,255,0.22)" : "var(--accent-light)", color: billing === b ? "white" : "var(--accent)" }}>BEST VALUE · SAVE {savePct}%</span></>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        {/* Free */}
        <div style={cardBase}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>Free</h2>
          <div style={{ margin: "10px 0 4px" }}><span style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)" }}>$0</span></div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "18px" }}>No account needed</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
            <Feature>{PLANS.free.analysesPerMonth} analyses a month</Feature>
            <Feature>Up to {PLANS.free.charLimit.toLocaleString()} characters (about 1,500 words) each</Feature>
            <Feature>Full 32-signal report</Feature>
            <Feature>Try the Content Optimizer (one run uses {OPTIMIZE_FREE_UNITS} free analyses)</Feature>
          </ul>
          <a href="/" style={{ ...btn, border: "1px solid var(--border)", color: "var(--text-primary)", background: "var(--bg-elevated)" }}>Start analyzing</a>
        </div>

        {/* Pro */}
        <div style={{ ...cardBase, border: "2px solid var(--accent)", position: "relative" }}>
          <span style={{ position: "absolute", top: "-12px", left: "24px", background: "var(--accent)", color: "white", fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", letterSpacing: "0.04em" }}>{billing === "yearly" ? `BEST VALUE · SAVE ${savePct}%` : "MOST FLEXIBLE"}</span>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>Pro</h2>
          <div style={{ margin: "10px 0 4px", display: "flex", alignItems: "baseline", gap: "6px" }}>
            {billing === "yearly" && <span style={{ fontSize: "20px", color: "var(--text-muted)", textDecoration: "line-through" }}>${PLANS.pro.monthlyPrice}</span>}
            <span style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)" }}>${billing === "monthly" ? PLANS.pro.monthlyPrice : yearlyMonthly}</span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>/ month</span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "18px" }}>
            {billing === "monthly" ? "Billed monthly · cancel any time" : `$${PLANS.pro.yearlyPrice} billed once a year · you save ${savePct}%`}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
            <Feature><strong>{PLANS.pro.wordsPerMonth.toLocaleString()} words</strong> a month</Feature>
            <Feature>Up to {PLANS.pro.charLimit.toLocaleString()} characters (about 5,000 words) each</Feature>
            <Feature>Full 32-signal report with content-type adjustment</Feature>
            <Feature><strong>Content Optimizer</strong> for readability, SEO and AI answers ({OPTIMIZE_WORD_MULTIPLIER}x words per run)</Feature>
            <Feature>No ads</Feature>
          </ul>
          {isPro ? (
            <a href="/account" style={{ ...btn, background: "var(--accent-light)", color: "var(--accent)", border: "1px solid rgba(10,115,115,0.3)" }}>Your current plan</a>
          ) : (
            <button disabled={!paymentsOn || busy !== null} onClick={() => buy(billing)}
              style={{ ...btn, border: "none", background: paymentsOn ? "var(--accent)" : "var(--bg-elevated)", color: paymentsOn ? "white" : "var(--text-muted)", opacity: busy && busy !== billing ? 0.6 : 1 }}>
              {!paymentsOn ? "Coming soon" : busy === billing ? "Opening checkout…" : "Get Pro"}
            </button>
          )}
        </div>

        {/* Word Pack */}
        <div style={cardBase}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>Word Pack</h2>
          <div style={{ margin: "10px 0 4px", display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)" }}>${PLANS.pack.price}</span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>one time</span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "18px" }}>No subscription</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
            <Feature><strong>{PLANS.pack.words.toLocaleString()} words</strong> that never expire</Feature>
            <Feature>Up to {PLANS.pack.charLimit.toLocaleString()} characters each</Feature>
            <Feature>Full 32-signal report</Feature>
            <Feature>Content Optimizer included ({OPTIMIZE_WORD_MULTIPLIER}x words per run)</Feature>
            <Feature>Stacks with Pro and other packs</Feature>
          </ul>
          <button disabled={!paymentsOn || busy !== null} onClick={() => buy("pack")}
            style={{ ...btn, background: "var(--bg-card)", color: paymentsOn ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${paymentsOn ? "var(--accent)" : "var(--border)"}`, opacity: busy && busy !== "pack" ? 0.6 : 1 }}>
            {!paymentsOn ? "Coming soon" : busy === "pack" ? "Opening checkout…" : "Buy Word Pack"}
          </button>
        </div>
      </div>

      {error && <p role="alert" style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "var(--red)" }}>{error}</p>}
      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
        Secure payment by Stripe. Prices in USD. {usage?.signedIn ? <>Signed in as {usage.email}. <a href="/account" style={{ color: "var(--accent)" }}>Account</a></> : <a href="/login?next=/pricing" style={{ color: "var(--accent)" }}>Sign in</a>}
      </p>
    </div>
  );
}
