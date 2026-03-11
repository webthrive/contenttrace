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
  const updated = "March 10, 2026";
  return (
    <><Nav current="/privacy" />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px", color: "var(--text-secondary)", fontFamily: "var(--font)", lineHeight: "1.75" }}>
      
      <h1 style={{ fontFamily: "var(--font)", fontSize: "40px", color: "var(--text-primary)", marginBottom: "8px", fontWeight: 700 }}>Privacy Policy</h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "36px" }}>Last updated: {updated}</p>
      {[
        { title: "1. Who We Are", body: `Content Trace is operated by Web Thrive, LLC ("we", "us", or "our") at contenttrace.ai — a free AI text detection tool. This Privacy Policy explains how we collect, use, and protect information when you use our service.` },
        { title: "2. Information We Collect", body: `We do not require you to create an account to use Content Trace. When you submit text for analysis, that text is sent to our servers to be processed by the Anthropic Claude API. We do not permanently store the text you submit.\n\nWe may collect standard server logs including IP addresses, browser type, referring URLs, and pages visited. This information is used for security and service improvement purposes only.\n\nIf you contact us by email, we retain that correspondence.` },
        { title: "3. How We Use Your Information", body: `We use the information we collect to:\n• Provide and improve the Content Trace service\n• Monitor for abuse and maintain security\n• Understand how the service is used in aggregate\n• Comply with legal obligations\n\nWe do not sell your personal information to third parties.` },
        { title: "4. Third-Party Services", body: `Content Trace uses the following third-party services:\n\n• Anthropic Claude API: Text submitted for analysis is processed by Anthropic's API. Anthropic's privacy policy applies to this processing.\n\n• Google AdSense: We display advertisements served by Google AdSense. Google may use cookies and similar tracking technologies to serve personalized ads. You can opt out at adssettings.google.com.\n\n• Vercel: Our hosting provider. See Vercel's privacy policy at vercel.com/legal/privacy-policy.\n\n• Google Analytics (if enabled): Aggregate usage patterns, anonymized and not linked to individuals.` },
        { title: "5. Cookies", body: `Content Trace uses cookies as described in our Cookie Policy. Google AdSense and other third parties may set cookies for advertising purposes. You can manage cookie preferences through your browser settings.` },
        { title: "6. Data Retention", body: `We do not retain the text you submit for analysis beyond the time needed to process your request. Server logs may be retained for up to 90 days for security purposes.` },
        { title: "7. Your Rights", body: `Depending on your location, you may have rights under applicable privacy law including the right to access, correct, or delete personal information we hold about you. Contact us at hello@contenttrace.ai to exercise these rights.\n\nFor users in the EEA, UK, or California, additional rights may apply under GDPR, UK GDPR, or CCPA respectively.` },
        { title: "8. Children's Privacy", body: `Content Trace is not directed at children under 13. We do not knowingly collect personal information from children under 13.` },
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
