import Nav from "@/components/Nav";
import type { Metadata } from "next";

const SITE_URL = "https://www.telltaleproof.com";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Telltale Proof cookie policy — how we use cookies and third-party tracking on our free AI content detection tool.",
  alternates: { canonical: `${SITE_URL}/cookies` },
  openGraph: {
    title: "Cookie Policy | Telltale Proof",
    description: "How Telltale Proof uses cookies and tracking technologies.",
    url: `${SITE_URL}/cookies`,
    siteName: "Telltale Proof",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function CookiePolicy() {
  const updated = "March 10, 2026";
  return (
    <><Nav current="/cookies" />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px", color: "var(--text-secondary)", fontFamily: "var(--font)", lineHeight: "1.75" }}>
      
      <h1 style={{ fontFamily: "var(--font)", fontSize: "40px", color: "var(--text-primary)", marginBottom: "8px", fontWeight: 700 }}>Cookie Policy</h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "36px" }}>Last updated: {updated}</p>
      {[
        { title: "What Are Cookies?", body: `Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently and to provide information to website owners.` },
        { title: "How We Use Cookies", body: `Telltale Proof itself uses minimal cookies required for the site to function. However, third-party services embedded on our site may set their own cookies.` },
        { title: "Third-Party Cookies", body: `Google AdSense: We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to this and other websites.\n\nYou may opt out of personalized advertising by visiting adssettings.google.com or aboutads.info.` },
        { title: "Cookie Categories", body: `Strictly Necessary: Required for the site to function. Cannot be disabled.\n\nPerformance & Analytics: Help us understand usage patterns. Can be disabled.\n\nAdvertising: Used to serve relevant ads via Google AdSense. Can be managed via your browser or opt-out tools.` },
        { title: "Managing Cookies", body: `You can control cookies through your browser settings — most browsers allow you to view, delete, and block cookies. Note that disabling certain cookies may affect Telltale Proof functionality or ad display.` },
        { title: "Contact", body: `Questions? Email us at: hello@telltaleproof.com` },
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
