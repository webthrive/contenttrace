import type { Metadata } from "next";
import { ogImage } from "@/lib/og";
import Nav from "@/components/Nav";
import PricingPlans from "./PricingPlans";
import { PLANS, PRO_YEARLY_PER_MONTH } from "@/lib/billing/config";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Content Trace is free for ${PLANS.free.analysesPerMonth} analyses a month. Pro is from $${PRO_YEARLY_PER_MONTH}/month billed yearly, for ${PLANS.pro.wordsPerMonth.toLocaleString()} words, the Content Optimizer, longer texts and no ads. Or buy a one-time Word Pack.`,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: { title: "Content Trace Pricing", url: `${SITE_URL}/pricing`, siteName: "Content Trace", type: "website", images: [ogImage("pricing", "Content Trace pricing: Free, Pro and Word Pack plans.")] },
  twitter: { card: "summary_large_image", images: [ogImage("pricing", "Content Trace pricing: Free, Pro and Word Pack plans.")] },
};

const FAQ = [
  { q: "What counts as a word?", a: "Each analysis uses the number of words in the text you submit. A 1,200-word article uses 1,200 words from your allowance. Failed analyses do not count." },
  { q: "Can I cancel any time?", a: "Yes. Cancel from your account page in two clicks. Pro stays active until the end of the period you paid for." },
  { q: "Do Word Pack words expire?", a: "No. Pack words stay on your account until you use them. Pro members can also use pack words after the monthly allowance runs out." },
  { q: "Do you store my text?", a: "No. Text is analyzed in real time and is not stored or used to train models. We only store your email, plan, and usage counts." },
  { q: "Is the score proof that AI wrote something?", a: "No. Scores are probabilistic. Read our disclaimer before you use a result for any academic, legal, or employment decision." },
];

export default function PricingPage() {
  return (
    <>
      <Nav current="/pricing" />
      <main style={{ minHeight: "100vh", padding: "0 16px", fontFamily: "var(--font)" }}>
        <header style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 0 28px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "12px" }}>
            Simple pricing. No ads.
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
            Every plan gets the full 32-signal analysis, content-type adjustment, and a plain-language explanation for every score.
          </p>
        </header>

        <PricingPlans />

        <section style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 0 72px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "18px" }}>Questions</h2>
          {FAQ.map((f) => (
            <div key={f.q} style={{ borderTop: "1px solid var(--border)", padding: "16px 0" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>{f.q}</h3>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.65 }}>{f.a}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
