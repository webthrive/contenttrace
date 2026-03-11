import Nav from "@/components/Nav";
import type { Metadata } from "next";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: "About",
  description: "Content Trace is a free AI content detection tool built to help writers, editors, and publishers understand what makes writing feel human — and what gives AI away.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Content Trace",
    description: "Free AI content detection built to help writers, editors, and publishers.",
    url: `${SITE_URL}/about`,
    siteName: "Content Trace",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <><Nav current="/about" />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)", lineHeight: "1.75" }}>
      

      <h1 style={{ fontSize: "42px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>About Content Trace</h1>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "40px" }}>Built by Colin at Web Thrive</p>

      {/* Mission */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>Why we built this</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          AI writing tools have become part of everyday work. That's not inherently a problem — but it has created a real need for transparency. Teachers want to know if a student wrote their own essay. Editors want to know if a pitch is authentic. Publishers want to know if the voice they're buying is real.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Most AI detectors give you a single score and a verdict with no explanation. We thought that wasn't good enough. Content Trace was built to go deeper — to show you <em>why</em> something scores the way it does, not just <em>what</em> the verdict is.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
          We also wanted it to be free. Content creators, students, and small publishers shouldn't need a subscription to understand their own writing.
        </p>
      </div>

      {/* How it works */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>How it works</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Content Trace analyzes text across 8 sections and 32 individual signals — from sentence structure and word choice to cognitive fingerprinting and emotional texture. Each factor is scored independently and explained in plain language, so you can understand exactly what's driving the result.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "20px" }}>
          The analysis is powered by Claude, Anthropic's AI model, which evaluates writing the way a trained human editor would — looking for the subtle patterns that distinguish authentic human prose from generated text.
        </p>

        {/* Sections grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          {[
            { name: "Cognitive Fingerprinting", weight: "16%" },
            { name: "Word Choice & Phrasing", weight: "15%" },
            { name: "Voice & Perspective", weight: "14%" },
            { name: "Content & Logic", weight: "13%" },
            { name: "Structure & Flow", weight: "12%" },
            { name: "Emotional Texture", weight: "12%" },
            { name: "Pragmatics & Subtext", weight: "10%" },
            { name: "Statistical Proxies", weight: "8%" },
          ].map((s) => (
            <div key={s.name} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", background: "var(--bg-card)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{s.name}</span>
              <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 700, background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.25)", padding: "2px 8px", borderRadius: "8px", marginLeft: "8px", flexShrink: 0 }}>{s.weight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Human Score */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>The Human Score</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Rather than labeling text as "AI" or "human" with false confidence, Content Trace gives you a Human Score out of 100. Higher scores indicate stronger human writing signals. Lower scores indicate patterns more consistent with AI generation.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", margin: "20px 0" }}>
          {[
            { range: "65–100", label: "Likely Human", color: "#0a7373", bg: "rgba(10,115,115,0.06)", border: "rgba(10,115,115,0.2)" },
            { range: "35–64", label: "Ambiguous", color: "#c47a00", bg: "rgba(196,122,0,0.06)", border: "rgba(196,122,0,0.2)" },
            { range: "0–34", label: "Likely AI", color: "#c43302", bg: "rgba(196,51,2,0.06)", border: "rgba(196,51,2,0.2)" },
          ].map((v) => (
            <div key={v.label} style={{ border: `1px solid ${v.border}`, borderRadius: "10px", padding: "16px", background: v.bg, textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: v.color, marginBottom: "4px" }}>{v.range}</div>
              <div style={{ fontSize: "14px", color: v.color, fontWeight: 600 }}>{v.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
          These are probabilistic signals, not verdicts. A score of 72 doesn't mean a text is definitely human-written — it means it exhibits strong human writing characteristics across the 32 signals we measure.
        </p>
      </div>

      {/* Who it's for */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>Who it's for</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Content Trace is useful for anyone who cares about content authenticity:
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { who: "Writers & content creators", why: "Check your own work before publishing or submitting" },
            { who: "Editors & publishers", why: "Quickly assess whether a submission feels authentically human" },
            { who: "Teachers & academics", why: "A supplementary signal when reviewing student work" },
            { who: "Marketers", why: "Ensure AI-assisted content has been humanized effectively" },
            { who: "Hiring managers", why: "Spot-check whether written applications feel genuine" },
          ].map((item) => (
            <li key={item.who} style={{ display: "flex", gap: "12px", padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px" }}>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", minWidth: "180px" }}>{item.who}</span>
              <span style={{ fontSize: "15px", color: "var(--text-secondary)" }}>{item.why}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Who we are */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>Who we are</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Content Trace is built and maintained by <a href="https://www.webthrive.io/home" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Colin</a>, a digital marketing consultant at <strong style={{ color: "var(--text-primary)" }}>Web Thrive</strong> based in the United States.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
          Have a question, a feature request, or just want to say hello? We'd love to hear from you.{" "}
          <a href="/contact" style={{ color: "var(--accent)", textDecoration: "underline" }}>Get in touch →</a>
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", background: "var(--bg-elevated)", fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.75" }}>
        <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>A note on accuracy</strong>
        Content Trace provides probabilistic analysis only. Results should not be used as definitive evidence in academic, legal, employment, or disciplinary proceedings. AI detection is an imperfect science and no tool — including this one — is 100% accurate.
      </div>
    </main>
    </>
  );
}
