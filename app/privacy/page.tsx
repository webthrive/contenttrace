export default function PrivacyPolicy() {
  const updated = "March 10, 2026";
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px", color: "var(--text-secondary)", fontFamily: "var(--font)", lineHeight: "1.75" }}>
      <a href="/" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block", marginBottom: "32px" }}>← Back to TelltaleProof</a>
      <h1 style={{ fontFamily: "var(--font)", fontSize: "40px", color: "var(--text-primary)", marginBottom: "8px", fontWeight: 400 }}>Privacy Policy</h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "36px" }}>Last updated: {updated}</p>

      {[
        { title: "1. Who We Are", body: `TelltaleProof ("we", "us", or "our") operates the website telltaleproof.com, a free AI text detection tool. This Privacy Policy explains how we collect, use, and protect information when you use our service.` },
        { title: "2. Information We Collect", body: `We do not require you to create an account to use TelltaleProof. When you submit text for analysis, that text is sent to our servers to be processed by the Anthropic Claude API. We do not permanently store the text you submit.\n\nWe may collect standard server logs including IP addresses, browser type, referring URLs, and pages visited. This information is used for security and service improvement purposes only.\n\nIf you contact us by email, we retain that correspondence.` },
        { title: "3. How We Use Your Information", body: `We use the information we collect to:\n• Provide and improve the TelltaleProof service\n• Monitor for abuse and maintain security\n• Understand how the service is used in aggregate\n• Comply with legal obligations\n\nWe do not sell your personal information to third parties.` },
        { title: "4. Third-Party Services", body: `TelltaleProof uses the following third-party services:\n\n• Anthropic Claude API: Text submitted for analysis is processed by Anthropic's API. Anthropic's privacy policy applies to this processing. We do not share personally identifiable information with Anthropic.\n\n• Google AdSense: We display advertisements served by Google AdSense. Google may use cookies and similar tracking technologies to serve personalized ads based on your visits to this and other websites. You can opt out of personalized advertising at adssettings.google.com.\n\n• Vercel: Our hosting provider. Vercel may collect standard access logs. See Vercel's privacy policy at vercel.com/legal/privacy-policy.\n\n• Google Analytics (if enabled): We may use Google Analytics to understand aggregate usage patterns. This data is anonymized and not linked to individual users.` },
        { title: "5. Cookies", body: `TelltaleProof uses cookies as described in our Cookie Policy. Google AdSense and other third parties may set cookies for advertising purposes. You can manage cookie preferences through your browser settings or our cookie consent tool.` },
        { title: "6. Data Retention", body: `We do not retain the text you submit for analysis beyond the time needed to process your request. Server logs may be retained for up to 90 days for security purposes.` },
        { title: "7. Your Rights", body: `Depending on your location, you may have rights under applicable privacy law including the right to access, correct, or delete personal information we hold about you. To exercise these rights, contact us at the address below.\n\nFor users in the European Economic Area (EEA), UK, or California, additional rights may apply under GDPR, UK GDPR, or CCPA respectively.` },
        { title: "8. Children's Privacy", body: `TelltaleProof is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can delete it.` },
        { title: "9. Changes to This Policy", body: `We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised date. Continued use of TelltaleProof after changes constitutes acceptance of the updated policy.` },
        { title: "10. Contact Us", body: `If you have questions about this Privacy Policy, please contact us at: hello@telltaleproof.com` },
      ].map((s) => (
        <div key={s.title} style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "10px", fontWeight: 600 }}>{s.title}</h2>
          <p style={{ fontSize: "15px", whiteSpace: "pre-line" }}>{s.body}</p>
        </div>
      ))}
    </main>
  );
}
