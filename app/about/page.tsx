import Nav from "@/components/Nav";
import type { Metadata } from "next";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: "About",
  description: "Content Trace is an AI content detector that explains its score with 32 signals, then helps you fix the weak spots with three optimizers: Humanize, SEO and AI answers.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Content Trace",
    description: "AI detection that explains why, plus Humanize, SEO and AI-answer optimizers that show every change.",
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
          AI writing tools are now part of everyday work. Most teams start with an AI draft, and that's fine. The problem is what comes next: drafts that sound generic, read like every other page, and get passed over by readers, search engines and AI assistants. At the same time, teachers, editors and publishers still want to know what they're reading.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Most AI detectors give you one score and a verdict with no explanation, and then leave you on your own. Content Trace shows you <em>why</em> something scores the way it does. Then it helps you fix it, with three optimizers that rewrite the weak spots and show every change before and after.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
          We also wanted it to be easy to try. Anyone can run a few full analyses every month for free, with no account. Pro and one-time Word Packs are there for people who check and optimize longer texts, or do it often.
        </p>
      </div>

      {/* How it works */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>How it works</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Content Trace analyzes text across 8 sections and 32 individual signals, from sentence rhythm and word choice to reasoning patterns and emotional texture. Each signal is scored on its own and explained in plain language, so you can see exactly what drives the result.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "20px" }}>
          Most signals are read by Claude, Anthropic's AI model, which reviews the writing the way a trained editor would. A few are measured directly from the text, such as how much sentence length varies. The analysis settings are fixed, so the same text gets the same or a very close score each time.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          {[
            "Structure & Flow",
            "Word Choice & Phrasing",
            "Voice & Perspective",
            "Content & Logic",
            "Cognitive Fingerprinting",
            "Emotional Texture",
            "Pragmatics & Subtext",
            "Statistical Proxies",
          ].map((name) => (
            <div key={name} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", background: "var(--bg-card)" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimizers */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>Then optimize it: three goals</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "16px" }}>
          After an analysis, you pick a goal. The optimizer rewrites the weak spots the analysis found, then scores the new version with the same engine. You compare the two versions side by side, with the Human Score, reading ease and Search & AI-answer readiness before and after. You can run all three goals on the same text.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
          {[
            { name: "Humanize", what: "Makes AI drafts read like a person wrote them. Plain words, varied sentences, no AI filler or stock phrases." },
            { name: "SEO", what: "Humanize, plus descriptive headings, the main point early, and your target keyword placed naturally." },
            { name: "AI answers (AEO)", what: "Humanize, plus a direct answer up top, question-style headings and self-contained passages that Google AI Overviews, ChatGPT and Perplexity can quote." },
          ].map((o) => (
            <div key={o.name} style={{ padding: "14px 16px", background: "var(--bg-card)", border: "1px solid rgba(10,115,115,0.3)", borderRadius: "10px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>{o.name}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)" }}>{o.what}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          The optimizer is an editor, not an author. It keeps your facts, numbers, names and quotes. It does not add opinions, feelings or stories you did not write. A fact check compares the new version with your original and flags any name, number or quote that changed. Where a real example or source would make the text stronger, it adds a marker like [Add: a real example from your work] for you to fill in.
        </p>
        <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
          Because we do not invent details to game the score, the Human Score may move only a little. Reading ease and readiness usually improve most. No tool can guarantee rankings or AI citations, so review every change before you publish.
        </p>
      </div>

      {/* Content type */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>Scoring adjusts to the type of content</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          A white paper and a personal blog post should not be judged by the same rules. Good corporate writing is formal and rarely tells personal stories. A good personal essay often does. A detector that ignores this marks careful professional writing as "AI" too often.
        </p>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          So Content Trace first identifies the type of content, or uses the type you choose. Then it adjusts the analysis:
        </p>
        <ul style={{ fontSize: "16px", color: "var(--text-secondary)", paddingLeft: "20px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>Signals that do not fit the type are left out of the score. For example, personal anecdotes do not count for a company blog or a technical document.</li>
          <li>The sections that matter most for that type get more weight.</li>
          <li>The final score is calibrated against real human and AI writing of the same kind, so a typical human-written white paper and a typical human-written essay both land in the human range.</li>
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
          {["Personal blog / essay", "Thought leadership", "Company blog", "Corporate / white paper", "Technical", "Academic", "Marketing copy", "Social post", "Email / letter", "General"].map((t) => (
            <span key={t} style={{ fontSize: "13px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.25)", borderRadius: "999px", padding: "4px 12px" }}>{t}</span>
          ))}
        </div>
        <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
          Every report says which type was used and which signals were left out, so you always know how your text was scored.
        </p>
      </div>

      {/* Human Score */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>The Human Score</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Rather than labeling text as "AI" or "human" with false confidence, Content Trace gives you a Human Score out of 100. Higher scores indicate stronger human writing signals. Lower scores indicate patterns more consistent with AI generation. Each report also shows a confidence level, which is lower for short texts.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", margin: "20px 0" }}>
          {[
            { range: "75–100", label: "Likely Human", color: "#0a7373", bg: "rgba(10,115,115,0.06)", border: "rgba(10,115,115,0.2)" },
            { range: "50–74", label: "Leans Human", color: "#0a8a6a", bg: "rgba(10,138,106,0.06)", border: "rgba(10,138,106,0.2)" },
            { range: "25–49", label: "Leans AI", color: "#c47a00", bg: "rgba(196,122,0,0.06)", border: "rgba(196,122,0,0.2)" },
            { range: "0–24", label: "Likely AI-Generated", color: "#c43302", bg: "rgba(196,51,2,0.06)", border: "rgba(196,51,2,0.2)" },
          ].map((v) => (
            <div key={v.label} style={{ border: `1px solid ${v.border}`, borderRadius: "10px", padding: "16px", background: v.bg, textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: v.color, marginBottom: "4px" }}>{v.range}</div>
              <div style={{ fontSize: "14px", color: v.color, fontWeight: 600 }}>{v.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
          These are probabilistic signals, not verdicts. A score of 72 doesn't mean a text is definitely human-written. It means it shows more human than AI writing characteristics for its type of content.
        </p>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", marginTop: "12px" }}>
          One limit we want to be open about: AI text that a person has heavily rewritten, or that was prompted to imitate a casual human style, can score in the human range. No detector catches all of it, and we say so in every report.
        </p>
      </div>

      {/* Who it's for */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>Who it's for</h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Content Trace is for anyone who writes with AI, or reviews writing that might be:
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { who: "Content & SEO teams", why: "Humanize AI drafts and tune them for search and AI answers" },
            { who: "Marketers", why: "Turn AI first drafts into copy that sounds like your brand" },
            { who: "Writers & creators", why: "Check your own work and tighten it before you publish" },
            { who: "Editors & publishers", why: "See which signals stand out in a submission" },
            { who: "Teachers & academics", why: "A supplementary signal when reviewing student work" },
          ].map((item) => (
            <li key={item.who} style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px" }}>
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
        Content Trace provides probabilistic analysis only. Results should not be used as definitive evidence in academic, legal, employment, or disciplinary proceedings. AI detection is an imperfect science, and no tool, including this one, is 100% accurate.
      </div>
    </main>
    </>
  );
}
