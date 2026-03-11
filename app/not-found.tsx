import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main style={{ maxWidth: "560px", margin: "0 auto", padding: "100px 24px", textAlign: "center", fontFamily: "var(--font)" }}>
      <div style={{ fontSize: "72px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "8px", lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>Page not found</h1>
      <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "36px", lineHeight: "1.6" }}>
        This page doesn't exist or may have been moved. Let's get you back on track.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(10,115,115,0.25)" }}>
          ← Run a detection
        </a>
        <a href="/about" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 500 }}>
          About Telltale Proof
        </a>
      </div>
    </main>
  );
}
