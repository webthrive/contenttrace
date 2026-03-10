"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";


const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdawejqq";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus("success"); setForm({ name: "", email: "", subject: "", message: "" }); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", fontSize: "15px",
    border: "1px solid var(--border)", borderRadius: "8px",
    background: "var(--bg-card)", color: "var(--text-primary)",
    fontFamily: "var(--font)", outline: "none", transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: 600,
    color: "var(--text-secondary)", marginBottom: "6px", textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  };

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)", lineHeight: "1.75" }}>
      <a href="/" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block", marginBottom: "32px" }}>← Back to TelltaleProof</a>

      <h1 style={{ fontSize: "42px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>Contact Us</h1>
      <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "36px" }}>
        Got a question, found a bug, or have a feature idea? We read every message and try to respond within 1–2 business days.
      </p>

      {/* Contact info strip */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "36px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 20px", background: "var(--bg-card)", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>✉️</span>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "2px" }}>Email</div>
            <a href="mailto:colin@telltaleproof.com" style={{ fontSize: "15px", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>colin@telltaleproof.com</a>
          </div>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 20px", background: "var(--bg-card)", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>🏢</span>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "2px" }}>Company</div>
            <div style={{ fontSize: "15px", color: "var(--text-secondary)", fontWeight: 500 }}>Web Thrive, LLC</div>
          </div>
        </div>
      </div>

      {/* Form */}
      {status === "success" ? (
        <div style={{ border: "1px solid rgba(10,115,115,0.3)", borderRadius: "12px", background: "rgba(10,115,115,0.06)", padding: "40px 32px", textAlign: "center" }}>
          <CheckCircle size={40} style={{ color: "var(--accent)", margin: "0 auto 16px" }} />
          <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Message sent!</div>
          <div style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "24px" }}>Thanks for reaching out. We'll get back to you within 1–2 business days.</div>
          <button onClick={() => setStatus("idle")} style={{ padding: "10px 24px", background: "var(--accent)", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }}>
            Send another message
          </button>
        </div>
      ) : (
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "var(--bg-card)", padding: "32px", boxShadow: "0 2px 12px rgba(1,2,33,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>Your Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Subject</label>
            <select name="subject" value={form.subject} onChange={handleChange} style={inputStyle}>
              <option value="">Select a topic...</option>
              <option value="General Question">General Question</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Press / Media">Press / Media</option>
              <option value="Business Inquiry">Business Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Message *</label>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what's on your mind..."
              style={{ ...inputStyle, minHeight: "160px", resize: "vertical" }} />
          </div>

          {status === "error" && (
            <div style={{ fontSize: "14px", color: "var(--red)", marginBottom: "16px", padding: "12px 16px", background: "var(--red-bg)", border: "1px solid rgba(196,51,2,0.2)", borderRadius: "8px" }}>
              Something went wrong. Please try again or email us directly at colin@telltaleproof.com
            </div>
          )}

          <button onClick={handleSubmit} disabled={status === "sending" || !form.name || !form.email || !form.message}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "13px 28px", background: status === "sending" || !form.name || !form.email || !form.message ? "var(--bg-elevated)" : "var(--accent)", color: status === "sending" || !form.name || !form.email || !form.message ? "var(--text-muted)" : "white", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 2px 8px rgba(10,115,115,0.2)" }}>
            {status === "sending"
              ? (<><span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} className="spin" />Sending...</>)
              : (<><Send size={15} />Send Message</>)}
          </button>
        </div>
      )}
    </main>
  );
}
