import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { PLANS } from "@/lib/billing/config";
import ThankYouStatus from "./ThankYouStatus";

// One confirmation page per product. Stripe Checkout returns the buyer here
// (/thank-you/<plan>?session_id=...). Conversion tracking is handled by GTM, not by this page.
const PAGES = {
  "pro-monthly": {
    title: "Welcome to Pro",
    lead: `Your Pro subscription is set up: ${PLANS.pro.wordsPerMonth.toLocaleString()} words a month and texts up to ${PLANS.pro.charLimit.toLocaleString()} characters.`,
    billing: `$${PLANS.pro.monthlyPrice} a month. Cancel any time on your account page.`,
    expect: "pro",
  },
  "pro-yearly": {
    title: "Welcome to Pro",
    lead: `Your yearly Pro subscription is set up: ${PLANS.pro.wordsPerMonth.toLocaleString()} words every month and texts up to ${PLANS.pro.charLimit.toLocaleString()} characters.`,
    billing: `$${PLANS.pro.yearlyPrice} a year. Manage or cancel it any time on your account page.`,
    expect: "pro",
  },
  "word-pack": {
    title: "Your Word Pack is ready",
    lead: `${PLANS.pack.words.toLocaleString()} words were added to your account. They never expire, and you can use texts up to ${PLANS.pack.charLimit.toLocaleString()} characters.`,
    billing: `One-time payment of $${PLANS.pack.price}. No subscription.`,
    expect: "pack",
  },
} as const;

type Slug = keyof typeof PAGES;

export const dynamicParams = false;
export function generateStaticParams() {
  return (Object.keys(PAGES) as Slug[]).map((plan) => ({ plan }));
}

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;
  const page = PAGES[plan as Slug];
  if (!page) notFound();

  return (
    <>
      <Nav current="/account" />
      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "56px 16px 80px", fontFamily: "var(--font)", textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }} aria-hidden>✓</div>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>Thank you! {page.title}</h1>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "6px" }}>{page.lead}</p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>{page.billing} A receipt is on its way to your email.</p>
        <ThankYouStatus expect={page.expect} />
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "24px" }}>
          <a href="/" style={{ padding: "12px 20px", borderRadius: "8px", background: "var(--accent)", color: "white", fontWeight: 600, textDecoration: "none", fontSize: "15px" }}>Start analyzing</a>
          <a href="/account" style={{ padding: "12px 20px", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--text-primary)", background: "var(--bg-card)", fontWeight: 600, textDecoration: "none", fontSize: "15px" }}>View your account</a>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "28px" }}>
          Questions about your purchase? Email <a href="mailto:hello@contenttrace.ai" style={{ color: "var(--accent)" }}>hello@contenttrace.ai</a>.
        </p>
      </main>
    </>
  );
}
