"use client";
import { useEffect, useState } from "react";
import { fetchUsage, type UsageInfo } from "@/lib/billing/browser";

// Stripe's confirmation (webhook) can arrive a few seconds after the redirect, so check a few times.
export default function ThankYouStatus({ expect }: { expect: "pro" | "pack" }) {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [tries, setTries] = useState(0);

  const ready = usage && (expect === "pro" ? usage.plan === "pro" : (usage.packWords ?? 0) > 0);

  useEffect(() => {
    if (ready || tries >= 8) return;
    const t = setTimeout(() => fetchUsage().then((u) => { setUsage(u); setTries((n) => n + 1); }), tries === 0 ? 0 : 2500);
    return () => clearTimeout(t);
  }, [ready, tries]);

  const box: React.CSSProperties = { display: "inline-block", fontSize: "14px", borderRadius: "10px", padding: "10px 16px", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)" };

  if (ready && usage) {
    return (
      <div role="status" style={{ ...box, border: "1px solid rgba(10,115,115,0.3)", background: "var(--accent-light)", color: "var(--text-primary)" }}>
        {expect === "pro"
          ? <>Pro is active · {(usage.proWordsLeft ?? 0).toLocaleString()} words left this month</>
          : <>Word Pack balance: {(usage.packWords ?? 0).toLocaleString()} words</>}
      </div>
    );
  }
  if (tries >= 8) {
    return <div role="status" style={box}>Your payment went through. Your plan can take a minute to show. Refresh your account page shortly.</div>;
  }
  return <div role="status" style={box}>Activating your plan…</div>;
}
