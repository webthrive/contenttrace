import Nav from "@/components/Nav";
import type { Metadata } from "next";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Content Trace privacy policy — how we collect, use, and protect your information when you use our free AI content detection tool.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: "Privacy Policy | Content Trace",
    description: "How Content Trace handles your data and privacy.",
    url: `${SITE_URL}/privacy`,
    siteName: "Content Trace",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  const updated = "October 1, 2026";
  return (
    <><Nav current="/privacy" />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px", color: "var(--text-secondary)", fontFamily: "var(--font)", lineHeight: "1.75" }}>
      
      <h1 style={{ fontFamily: "var(--font)", fontSize: "40px", color: "var(--text-primary)", marginBottom: "8px", fontWeight: 700 }}>Privacy Policy</h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "36px" }}>Last updated: {updated}</p>
      {[
        { title: "1. Who We Are", body: `Content Trace is operated by Web Thrive, LLC ("we", "us", or "our") at contenttrace.ai, an AI text detection tool. This Privacy Policy explains how we collect, use, and protect information when you use our service.` },
        { title: "2. Information We Collect", body: `Text you analyze: when you submit text, it is sent to our servers and processed by the Anthropic Claude API. We do not permanently store the text you submit, and it is not used to train models.\n\nFree usage limits: to apply the monthly free limit without an account, we set a random browser ID cookie and store a one-way, salted hash of your IP address together with a count of analyses. We do not store your raw IP address for this purpose.\n\nAccounts: if you create an account, we store your email address, your plan, your subscription status, your Word Pack balance, and monthly usage counts (number of analyses and words).\n\nPayments: payments are handled by Stripe. We do not receive or store your full card number. Stripe shares with us your customer ID, subscription status, and payment confirmations.\n\nWe may also collect standard server logs including IP addresses, browser type, referring URLs, and pages visited, for security and service improvement. If you contact us by email, we retain that correspondence.` },
        { title: "3. How We Use Your Information", body: `We use the information we collect to:\n• Provide the Content Trace service and apply plan limits\n• Process payments and manage subscriptions\n• Send sign-in links and essential account or billing emails\n• Monitor for abuse and maintain security\n• Understand how the service is used in aggregate\n• Comply with legal obligations\n\nWe do not sell your personal information to third parties.` },
        { title: "4. Third-Party Services", body: `Content Trace uses the following third-party services:\n\n• Anthropic Claude API: text submitted for analysis is processed by Anthropic's API. Anthropic's privacy policy applies to this processing.\n\n• Supabase: stores account and usage data and sends sign-in emails.\n\n• Stripe: processes payments. See stripe.com/privacy.\n\n• Cloudflare Turnstile: a privacy-focused check that helps block automated abuse of free analyses.\n\n• Google AdSense (free version only, if enabled): Google may use cookies to serve ads. You can opt out at adssettings.google.com.\n\n• Vercel: our hosting provider. See vercel.com/legal/privacy-policy.\n\n• Google Analytics (if enabled): aggregate usage patterns.` },
        { title: "5. Cookies", body: `Content Trace uses cookies as described in our Cookie Policy, including: a sign-in session cookie (only if you sign in), a random browser ID cookie used to count free analyses, and cookies set by Cloudflare Turnstile for bot protection. Advertising and analytics providers may set their own cookies. You can manage cookie preferences through your browser settings.` },
        { title: "6. Data Retention", body: `We do not retain the text you submit for analysis beyond the time needed to process your request. Usage counts are kept for up to 24 months. Account data is kept while your account exists; you can ask us to delete your account at any time. Payment records are kept as long as required for tax and accounting law. Server logs may be retained for up to 90 days for security purposes.` },
        { title: "7. Your Rights", body: `Depending on your location, you may have rights under applicable privacy law including the right to access, correct, export, or delete personal information we hold about you. Contact us at hello@contenttrace.ai to exercise these rights.\n\nFor users in the EEA, UK, or California, additional rights may apply under GDPR, UK GDPR, or CCPA respectively.` },
        { title: "8. Children's Privacy", body: `Content Trace is not directed at children under 13. We do not knowingly collect personal information from children under 13. Paid plans are for users aged 18 or older.` },
        { title: "9. Changes to This Policy", body: `We may update this Privacy Policy from time to time. Continued use of Content Trace after changes constitutes acceptance of the updated policy.` },
        { title: "10. Contact Us", body: `Questions? Contact us at: hello@contenttrace.ai` },
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
