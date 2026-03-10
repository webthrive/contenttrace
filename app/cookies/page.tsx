export default function CookiePolicy() {
  const updated = "March 10, 2026";
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px", color: "var(--text-secondary)", fontFamily: "var(--font)", lineHeight: "1.75" }}>
      <a href="/" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block", marginBottom: "32px" }}>← Back to TelltaleProof</a>
      <h1 style={{ fontFamily: "var(--font)", fontSize: "40px", color: "var(--text-primary)", marginBottom: "8px", fontWeight: 400 }}>Cookie Policy</h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "36px" }}>Last updated: {updated}</p>

      {[
        { title: "What Are Cookies?", body: `Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently and to provide information to website owners.` },
        { title: "How We Use Cookies", body: `TelltaleProof itself uses minimal cookies required for the site to function. However, third-party services embedded on our site may set their own cookies.` },
        { title: "Third-Party Cookies", body: `Google AdSense: We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to this and other websites. These cookies allow Google and its partners to serve ads to you based on your visit to our site and/or other sites on the internet.\n\nYou may opt out of personalized advertising by visiting Google's Ad Settings at adssettings.google.com. Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting aboutads.info.` },
        { title: "Cookie Categories", body: `Strictly Necessary: Required for the site to function. Cannot be disabled.\n\nPerformance & Analytics: Help us understand how visitors use the site (e.g., Google Analytics). These can be disabled.\n\nAdvertising: Used to serve relevant ads via Google AdSense and similar networks. These can be managed via your browser or opt-out tools.` },
        { title: "Managing Cookies", body: `You can control cookies through your browser settings. Most browsers allow you to:\n\n• View what cookies have been set\n• Delete cookies individually or in bulk\n• Block cookies from specific or all sites\n• Set preferences for certain types of cookies\n\nNote that disabling certain cookies may affect the functionality of TelltaleProof or the ads displayed.` },
        { title: "Changes to This Policy", body: `We may update this Cookie Policy from time to time. Check this page periodically for updates.` },
        { title: "Contact", body: `Questions about our use of cookies? Email us at: hello@telltaleproof.com` },
      ].map((s) => (
        <div key={s.title} style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "10px", fontWeight: 600 }}>{s.title}</h2>
          <p style={{ fontSize: "15px", whiteSpace: "pre-line" }}>{s.body}</p>
        </div>
      ))}
    </main>
  );
}
