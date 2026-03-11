export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 16px", textAlign: "center", background: "var(--bg-card)", marginTop: "auto" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "10px" }}>
          © {new Date().getFullYear()} Web Thrive, LLC. Content Trace is a free AI text detection tool. Results are probabilistic, not definitive.
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          {[
            { label: "About",          href: "/about" },
            { label: "Blog",           href: "/blog" },
            { label: "Contact",        href: "/contact" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Use",   href: "/terms" },
            { label: "Cookie Policy",  href: "/cookies" },
          ].map((link) => (
            <a key={link.href} href={link.href} style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
