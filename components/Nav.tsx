"use client";

import { useState } from "react";
import { Menu, X, Scan } from "lucide-react";

const LINKS = [
  { label: "Detector", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-card)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>

        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <Scan size={16} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Telltale Proof</span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }} className="nav-desktop">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{
              fontSize: "14px", fontWeight: 500, padding: "6px 12px", borderRadius: "6px",
              textDecoration: "none",
              color: current === l.href ? "var(--accent)" : "var(--text-secondary)",
              background: current === l.href ? "var(--accent-light)" : "transparent",
            }}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="nav-mobile"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "4px" }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav-mobile" style={{ borderTop: "1px solid var(--border)", background: "var(--bg-card)", padding: "12px 16px 16px" }}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: "block", fontSize: "16px", fontWeight: 500, padding: "12px 8px",
              borderBottom: "1px solid var(--border)", textDecoration: "none",
              color: current === l.href ? "var(--accent)" : "var(--text-secondary)",
            }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
