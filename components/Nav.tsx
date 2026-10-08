"use client";

import { useEffect, useState } from "react";
import { Menu, X, UserRound } from "lucide-react";
import { authAvailable, supabaseBrowser } from "@/lib/billing/browser";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/#faq" },
];

export default function Nav({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  // null = not known yet (or accounts are off), true/false = signed in or not
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authAvailable()) return;
    const sb = supabaseBrowser();
    sb.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => setSignedIn(Boolean(session)));
    return () => sub.subscription.unsubscribe();
  }, []);

  const account = signedIn === null ? null : signedIn
    ? { label: "Account", href: "/account" }
    : { label: "Sign in", href: `/login?next=${encodeURIComponent(current && current !== "/login" ? current : "/account")}` };
  const accountActive = current === "/account";

  return (
    <nav style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-card)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", height: "56px" }}>

        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <img src="/logo.svg" alt="Content Trace" style={{ height: "28px", width: "auto" }} />
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }} className="nav-desktop">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{
              fontSize: "14px", fontWeight: 500, padding: "6px 10px", borderRadius: "6px", whiteSpace: "nowrap",
              textDecoration: "none",
              color: current === l.href ? "var(--accent)" : "var(--text-secondary)",
              background: current === l.href ? "var(--accent-light)" : "transparent",
            }}>
              {l.label}
            </a>
          ))}
          {account && (
            <a href={account.href} style={{
              display: "flex", alignItems: "center", gap: "6px", marginLeft: "8px", whiteSpace: "nowrap",
              fontSize: "14px", fontWeight: 600, padding: "6px 14px", borderRadius: "999px", textDecoration: "none",
              border: "1px solid var(--accent)",
              color: accountActive ? "white" : "var(--accent)",
              background: accountActive ? "var(--accent)" : "transparent",
            }}>
              <UserRound size={15} />{account.label}
            </a>
          )}
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
          {account && (
            <a href={account.href} onClick={() => setOpen(false)} style={{
              display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: 600, padding: "12px 8px",
              textDecoration: "none", color: "var(--accent)",
            }}>
              <UserRound size={17} />{account.label}
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
