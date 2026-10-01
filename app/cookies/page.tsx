import Nav from "@/components/Nav";
import type { Metadata } from "next";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Content Trace cookie policy — how we use cookies and third-party tracking on our AI content detection tool.",
  alternates: { canonical: `${SITE_URL}/cookies` },
  openGraph: {
    title: "Cookie Policy | Content Trace",
    description: "How Content Trace uses cookies and tracking technologies.",
    url: `${SITE_URL}/cookies`,
    siteName: "Content Trace",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function CookiePolicy() {
  const updated = "October 1, 2026";
  return (
    <><Nav current="/cookies" />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px", color: "var(--text-secondary)", fontFamily: "var(--font)", lineHeight: "1.75" }}>
      
      <h1 style={{ fontFamily: "var(--font)", fontSize: "40px", color: "var(--text-primary)", marginBottom: "8px", fontWeight: 700 }}>Cookie Policy</h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "36px" }}>Last updated: {updated}</p>
      {[
        { title: "What Are Cookies?", body: `Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently and to provide information to website owners.` },
        { title: "How We Use Cookies", body: `Content Trace sets only the cookies it needs to work:\n\n• ct_aid (strictly necessary): a random ID that counts free analyses for visitors who are not signed in. It contains no personal information and expires after about 13 months.\n• Sign-in cookies (strictly necessary, names start with "sb-"): keep you signed in to your account. They are set only when you sign in and are removed when you sign out.\n• Cloudflare Turnstile (strictly necessary): may set a cookie or similar storage to check that a free analysis comes from a person, not a bot.\n\nThird-party services on our site may set their own cookies, as described below. Payment pages are hosted by Stripe on its own domain, and Stripe sets its own cookies there for security and fraud prevention.` },
        { title: "Third-Party Cookies", body: `Google Tag Manager and Google Analytics: help us understand how the site is used, in aggregate.\n\nGoogle AdSense (free plan only, if enabled): Google uses cookies to serve ads based on your prior visits to this and other websites. Paid plans do not show ads.\n\nYou may opt out of personalized advertising by visiting adssettings.google.com or aboutads.info.` },
        { title: "Cookie Categories", body: `Strictly Necessary: required for the site to work (free-limit ID, sign-in, bot check). Cannot be disabled.\n\nPerformance & Analytics: Help us understand usage patterns. Can be disabled.\n\nAdvertising: Used to serve relevant ads via Google AdSense. Can be managed via your browser or opt-out tools.` },
        { title: "Managing Cookies", body: `You can control cookies through your browser settings — most browsers allow you to view, delete, and block cookies. You can also change your choice at any time with the cookie settings button on the site. If you block strictly necessary cookies, sign-in and free analyses may not work.` },
        { title: "Contact", body: `Questions? Email us at: hello@contenttrace.ai` },
      ].map((s) => (
        <div key={s.title} style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "10px", fontWeight: 600 }}>{s.title}</h2>
          <p style={{ fontSize: "15px", whiteSpace: "pre-line" }}>{s.body}</p>
        </div>
      ))}
    </main>
    </>
  );
}
