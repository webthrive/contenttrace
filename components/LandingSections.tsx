"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LandingCopy } from "@/lib/landingCopy";

const SECTIONS_INFO = [
  { name: "Cognitive Fingerprinting", weight: "16%", desc: "Traces of human thinking: self-correction, opinion drift, thinking out loud. The hardest signal for AI to fake.", factors: ["Opinion Drift / Self-Correction", "Thinking Out Loud", "Metacognitive Signals", "Cognitive Bias Presence"] },
  { name: "Word Choice & Phrasing", weight: "15%", desc: "AI filler phrases, hedging language, lack of contractions, and generic vs specific language patterns.", factors: ["AI Filler Phrases", "Hedging Language Overuse", "Lack of Contractions", "Generic vs Specific Language"] },
  { name: "Voice & Perspective", weight: "14%", desc: "Whether the writing has a distinct, authentic human point of view or reads as generic and neutral.", factors: ["Distinct Point of View", "Personal Anecdotes Present", "Emotional Authenticity", "Opinion Strength"] },
  { name: "Content & Logic", weight: "13%", desc: "Depth of treatment, insider knowledge, surprising observations. Things AI rarely generates unprompted.", factors: ["Depth vs Surface Treatment", "Insider/Niche Knowledge", "Surprising Observations", "Argument Completeness"] },
  { name: "Structure & Flow", weight: "12%", desc: "How sentences and paragraphs are organized. AI tends toward uniform rhythm and predictable patterns.", factors: ["Sentence Length Variation", "Transitional Phrase Overuse", "Predictable List Structures", "Paragraph Length Consistency"] },
  { name: "Emotional Texture", weight: "12%", desc: "Whether emotion feels genuine or performed, and whether vulnerability is present in the writing.", factors: ["Genuine vs Performed Empathy", "Vulnerability Present", "Emotional Range", "Specificity of Feeling"] },
  { name: "Pragmatics & Subtext", weight: "10%", desc: "Subtext, irony, register shifts. Human writers imply things; AI tends to over-explain everything.", factors: ["Subtext and Implication", "Irony or Dry Humor", "Register Shifts", "Over-Explicitness"] },
  { name: "Statistical Proxies", weight: "Reference", desc: "Vocabulary richness, burstiness, hedging, and entropy, measured in code. Shown for reference only: in our tests they did not separate human and AI writing, so they do not change the score.", factors: ["Vocabulary Richness", "Burstiness Approximation", "Response Calibration", "Entropy Variance"] },
];

const SECTION: React.CSSProperties = { maxWidth: "760px", margin: "0 auto 60px" };
const CARD: React.CSSProperties = { border: "1px solid var(--border)", borderRadius: "14px", background: "var(--bg-card)", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" };

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>{title}</h2>
      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>{sub}</p>
    </>
  );
}

// The three optimizer cards, shown right under the tool.
export function OptimizerCards({ copy }: { copy: LandingCopy }) {
  const o = copy.optimizers;
  return (
    <div style={{ margin: "36px 0 8px" }}>
      <Heading title={o.title} sub={o.sub} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
        {o.items.map((it) => (
          <div key={it.title} style={{ border: "1px solid rgba(10,115,115,0.3)", borderRadius: "14px", padding: "24px 20px", background: "linear-gradient(180deg, rgba(10,115,115,0.05), var(--bg-card))", boxShadow: "0 1px 6px rgba(1,2,33,0.05)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "28px" }}>{it.icon}</div>
            <div style={{ fontSize: "19px", fontWeight: 700, color: "var(--accent)" }}>{it.title}</div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.45 }}>{it.tag}</div>
            <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {it.points.map((pt) => <li key={pt} style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{pt}</li>)}
            </ul>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "auto" }}><strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Best for:</strong> {it.best}</div>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, maxWidth: "620px", margin: "18px auto 0" }}>{o.note}</p>
    </div>
  );
}

// Everything below the tool for signed-out visitors: guide, steps, audiences, reasons, AI check details, FAQ, blog, disclaimer.
export default function LandingSections({ copy }: { copy: LandingCopy }) {
  const [sectionsOpen, setSectionsOpen] = useState(false);
  return (
    <>
      {copy.guide && (
        <div style={SECTION}>
          <Heading title={copy.guide.title} sub={copy.guide.sub} />
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {copy.guide.tips.map((t, i) => (
              <li key={t.title} style={{ ...CARD, padding: "16px 20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: "30px", height: "30px", borderRadius: "50%", background: "var(--accent-light)", color: "var(--accent)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{t.title}</div>
                  <div style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6 }}>{t.desc}</div>
                </div>
              </li>
            ))}
          </ol>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.6, maxWidth: "620px", margin: "18px auto 0" }}>{copy.guide.outro}</p>
        </div>
      )}

      <div style={SECTION}>
        <Heading title={copy.steps.title} sub={copy.steps.sub} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {copy.steps.items.map((item, i) => (
            <div key={item.title} style={{ ...CARD, padding: "28px 22px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
              <div style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.3)", borderRadius: "12px", padding: "3px 10px", marginBottom: "12px", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>STEP {i + 1}</div>
              <div style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{item.title}</div>
              <div style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={SECTION}>
        <Heading title={copy.audiences.title} sub={copy.audiences.sub} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {copy.audiences.items.map((item) => (
            <div key={item.title} style={{ ...CARD, borderRadius: "12px", padding: "20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "24px", flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "5px" }}>{item.title}</div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.5" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={SECTION}>
        <Heading title={copy.reasons.title} sub={copy.reasons.sub} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
          {copy.reasons.items.map((item) => (
            <div key={item.title} style={{ ...CARD, padding: "24px 18px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{item.title}</div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.5" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {copy.showDetectorDetails && (
        <div style={SECTION}>
          <Heading title="How the AI Check Works" sub="Every optimization starts with a check across 8 sections and 32 signals." />
            {/* Score Scale Bar */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "var(--bg-card)", padding: "20px 24px", marginBottom: "12px", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "12px" }}>How scores are interpreted</div>
              <div style={{ position: "relative", marginBottom: "6px" }}>
                <div style={{ height: "10px", borderRadius: "6px", background: "linear-gradient(to right, #c43302 0%, #c43302 25%, #c47a00 25%, #c47a00 50%, #0a8a6a 50%, #0a8a6a 75%, #0a7373 75%, #0a7373 100%)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "10px" }}>
                <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
              </div>
              <div className="scale-zones-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                {[
                  { label: "Likely AI",    range: "0 – 24",   color: "#c43302", bg: "rgba(196,51,2,0.08)",   border: "rgba(196,51,2,0.2)" },
                  { label: "Leans AI",     range: "25 – 49",  color: "#c47a00", bg: "rgba(196,122,0,0.08)",  border: "rgba(196,122,0,0.2)" },
                  { label: "Leans Human",  range: "50 – 74",  color: "#0a8a6a", bg: "rgba(10,138,106,0.08)", border: "rgba(10,138,106,0.2)" },
                  { label: "Likely Human", range: "75 – 100", color: "#0a7373", bg: "rgba(10,115,115,0.08)", border: "rgba(10,115,115,0.2)" },
                ].map((z) => (
                  <div key={z.label} style={{ textAlign: "center", padding: "7px 6px", borderRadius: "8px", background: z.bg, border: `1px solid ${z.border}` }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: z.color }}>{z.label}</div>
                    <div style={{ fontSize: "10px", color: z.color, fontFamily: "var(--font-mono)", opacity: 0.8, marginTop: "2px" }}>{z.range}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "var(--bg-card)", overflow: "hidden", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <button onClick={() => setSectionsOpen(!sectionsOpen)}
                style={{ width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>What we analyze</div>
                  <div style={{ fontSize: "15px", color: "var(--text-muted)" }}>8 sections · 32 individual factors, each scored and explained</div>
                </div>
                <span style={{ color: "var(--text-muted)", flexShrink: 0, marginLeft: "12px" }}>
                  {sectionsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>

              {sectionsOpen && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "20px 24px 24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
                    {SECTIONS_INFO.map((sec) => (
                      <div key={sec.name} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", background: "var(--bg-elevated)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                          <div style={{ fontSize: "19px", fontWeight: 600, color: "var(--text-primary)" }}>{sec.name}</div>
                          <span style={{ fontSize: "13px", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 700, background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.3)", padding: "3px 10px", borderRadius: "10px", flexShrink: 0, marginLeft: "10px" }}>{sec.weight}</span>
                        </div>
                        <div style={{ fontSize: "17px", color: "#444", lineHeight: "1.6", marginBottom: "14px" }}>{sec.desc}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {sec.factors.map((f) => (
                            <span key={f} style={{ fontSize: "13px", color: "var(--text-secondary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "4px 10px" }}>{f}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      )}

      <div id="faq" style={SECTION}>
        <Heading title="Frequently Asked Questions" sub="Everything you need to know about Content Trace." />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {copy.faqs.map((item) => (
            <div key={item.q} style={{ ...CARD, borderRadius: "12px", padding: "22px 24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>{item.q}</h3>
              <div style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.7" }}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      {copy.showBlog && (
      <>
      {/* BLOG POSTS */}
      <div style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "4px" }}>From the blog</h2>
            <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>Articles on AI writing, detection, and content authenticity.</p>
          </div>
          <a href="/blog" style={{ fontSize: "14px", color: "var(--accent)", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, marginLeft: "16px" }}>All posts →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { slug: "how-ai-text-detection-works", title: "How AI Text Detection Actually Works", date: "March 10, 2026", readTime: "6 min", excerpt: "What's actually happening under the hood, and why some detection approaches are more reliable than others.", tag: "Explainer", tagColor: "#0a7373", tagBg: "rgba(10,115,115,0.08)", tagBorder: "rgba(10,115,115,0.2)" },
            { slug: "why-ai-writing-sounds-different", title: "Why AI Writing Sounds Different", date: "March 10, 2026", readTime: "7 min", excerpt: "AI writing is grammatically flawless. So why does it feel off? The answer is in how humans actually think on the page.", tag: "Analysis", tagColor: "#c47a00", tagBg: "rgba(196,122,0,0.08)", tagBorder: "rgba(196,122,0,0.2)" },
            { slug: "how-to-humanize-ai-content", title: "How to Humanize AI Content: A Practical Guide", date: "March 10, 2026", readTime: "8 min", excerpt: "A practical framework for making AI-generated content read authentically before you publish.", tag: "Guide", tagColor: "#c43302", tagBg: "rgba(196,51,2,0.08)", tagBorder: "rgba(196,51,2,0.2)" },
          ].map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px", background: "var(--bg-card)", boxShadow: "0 1px 6px rgba(1,2,33,0.05)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(1,2,33,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 6px rgba(1,2,33,0.05)")}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: post.tagColor, background: post.tagBg, border: `1px solid ${post.tagBorder}`, padding: "2px 8px", borderRadius: "6px" }}>{post.tag}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{post.readTime}</span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", lineHeight: 1.35, letterSpacing: "-0.01em" }}>{post.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "16px", flex: 1 }}>{post.excerpt}</p>
              <span style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>Read →</span>
            </a>
          ))}
        </div>
      </div>

      </>
      )}

      {/* DISCLAIMER */}
      <div style={{ maxWidth: "760px", margin: "0 auto 48px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", background: "var(--bg-elevated)", fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.75" }}>
          <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Disclaimer</strong>
          Content Trace provides probabilistic analysis only and does not constitute a definitive determination of authorship. Results should not be used as evidence in academic, legal, employment, or disciplinary proceedings. AI detection is an imperfect science. Scores may be affected by writing style, text length, editing, translation, or subject matter. A high Human Score does not guarantee human authorship, and a low score does not prove AI generation. Content Trace is provided without warranty of any kind. Web Thrive, LLC accepts no liability for decisions made based on analysis results.
        </div>
      </div>
    </>
  );
}
