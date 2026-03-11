"use client";

import { useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Scan, X, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const CHAR_LIMIT = 10000;

const SAMPLE_TEXT = `Artificial intelligence has fundamentally transformed how organizations approach data-driven decision making. By leveraging advanced machine learning algorithms and neural network architectures, businesses can now extract meaningful insights from vast datasets that would have been previously unanalyzable. This paradigm shift represents a significant opportunity for enterprises willing to embrace digital transformation.

It is important to note that implementing AI solutions requires careful consideration of both technical and organizational factors. Companies must ensure they have the right infrastructure, talent, and governance frameworks in place to successfully deploy these technologies at scale. Furthermore, ethical considerations around bias, transparency, and accountability must be thoroughly addressed.

In conclusion, organizations that strategically invest in AI capabilities will be well-positioned to achieve competitive advantages in an increasingly data-driven marketplace.`;

const SECTIONS_INFO = [
  { name: "Cognitive Fingerprinting", weight: "16%", desc: "Traces of human thinking — self-correction, opinion drift, thinking out loud. The hardest signal for AI to fake.", factors: ["Opinion Drift / Self-Correction", "Thinking Out Loud", "Metacognitive Signals", "Cognitive Bias Presence"] },
  { name: "Word Choice & Phrasing", weight: "15%", desc: "AI filler phrases, hedging language, lack of contractions, and generic vs specific language patterns.", factors: ["AI Filler Phrases", "Hedging Language Overuse", "Lack of Contractions", "Generic vs Specific Language"] },
  { name: "Voice & Perspective", weight: "14%", desc: "Whether the writing has a distinct, authentic human point of view or reads as generic and neutral.", factors: ["Distinct Point of View", "Personal Anecdotes Present", "Emotional Authenticity", "Opinion Strength"] },
  { name: "Content & Logic", weight: "13%", desc: "Depth of treatment, insider knowledge, surprising observations — things AI rarely generates unprompted.", factors: ["Depth vs Surface Treatment", "Insider/Niche Knowledge", "Surprising Observations", "Argument Completeness"] },
  { name: "Structure & Flow", weight: "12%", desc: "How sentences and paragraphs are organized. AI tends toward uniform rhythm and predictable patterns.", factors: ["Sentence Length Variation", "Transitional Phrase Overuse", "Predictable List Structures", "Paragraph Length Consistency"] },
  { name: "Emotional Texture", weight: "12%", desc: "Whether emotion feels genuine or performed, and whether vulnerability is present in the writing.", factors: ["Genuine vs Performed Empathy", "Vulnerability Present", "Emotional Range", "Specificity of Feeling"] },
  { name: "Pragmatics & Subtext", weight: "10%", desc: "Subtext, irony, register shifts — human writers imply things; AI tends to over-explain everything.", factors: ["Subtext and Implication", "Irony or Dry Humor", "Register Shifts", "Over-Explicitness"] },
  { name: "Statistical Proxies", weight: "8%", desc: "Approximations of vocabulary richness, burstiness, and entropy — the signals used in academic detection.", factors: ["Vocabulary Richness", "Burstiness Approximation", "Response Calibration", "Entropy Variance"] },
];

export default function AnalyzerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50) { setError("Please enter at least 50 characters."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const handleReset = () => { setResult(null); setError(null); };
  const loadSample = () => { setText(SAMPLE_TEXT); setResult(null); setError(null); };

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1, padding: "0 16px" }}>

      <header style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 0 28px", textAlign: "center" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.3)", borderRadius: "20px", padding: "7px 16px", marginBottom: "24px", textDecoration: "none" }}>
          <Scan size={14} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "13px", color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em", fontWeight: 500, textAlign: "center" }}>Free AI Content Detector<br />by Telltale Proof</span>
        </a>
        <h1 style={{ fontSize: "clamp(32px, 7vw, 62px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "10px", letterSpacing: "-0.03em" }}>
          Deep AI Content Analysis
        </h1>
        <h2 style={{ fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 400, color: "#0b0b0b", lineHeight: 1.3, marginBottom: "24px", letterSpacing: "-0.01em" }}>
          Paste. Analyze. Know.
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "640px", margin: "0 auto", lineHeight: "1.7" }}>
          The free AI writing detector that goes deeper.<br />
          Analyze any text across <strong style={{ color: "var(--accent)", fontWeight: 600 }}>8 sections and 32 individual signals</strong> — structure, voice, cognitive fingerprinting, emotional texture, and more.
        </p>
      </header>

      <div style={{ maxWidth: "760px", margin: "0 auto", paddingBottom: "40px" }}>

        {!result && (
          <div style={{ border: "1px solid var(--border)", borderRadius: "16px", background: "var(--bg-card)", overflow: "hidden", marginBottom: "20px", boxShadow: "0 2px 12px rgba(1,2,33,0.06)" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, CHAR_LIMIT))}
              placeholder="Paste any text here — blog post, email, essay, social content, product description, marketing copy..."
              style={{ width: "100%", minHeight: "240px", padding: "22px", background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "16px", fontFamily: "var(--font)", lineHeight: "1.75", resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", background: "var(--bg-elevated)" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{wordCount} words · {charCount.toLocaleString()}/{CHAR_LIMIT.toLocaleString()} chars</span>
                <button onClick={loadSample} style={{ fontSize: "13px", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Load sample</button>
              </div>
              <button onClick={handleAnalyze} disabled={loading || charCount < 50}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: loading || charCount < 50 ? "var(--bg-elevated)" : "var(--accent)", color: loading || charCount < 50 ? "var(--text-muted)" : "white", border: loading || charCount < 50 ? "1px solid var(--border)" : "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading || charCount < 50 ? "not-allowed" : "pointer", fontFamily: "var(--font)", boxShadow: loading || charCount < 50 ? "none" : "0 2px 8px rgba(10,115,115,0.3)" }}>
                {loading
                  ? (<><span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} className="spin" />Analyzing...</>)
                  : (<><Scan size={15} />Analyze Text<ArrowRight size={15} /></>)}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ border: "1px solid rgba(196,51,2,0.3)", borderRadius: "10px", background: "rgba(196,51,2,0.06)", padding: "14px 18px", fontSize: "15px", color: "var(--red)", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {error}
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)" }}><X size={15} /></button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
            <div style={{ width: "44px", height: "44px", border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", margin: "0 auto 18px" }} className="spin" />
            <div style={{ fontSize: "16px", marginBottom: "6px", color: "var(--text-secondary)" }}>Running deep analysis across 32 signals...</div>
            <div style={{ fontSize: "14px" }}>This takes 10–20 seconds</div>
          </div>
        )}

        {result && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Analysis complete</span>
              <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--text-secondary)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 14px", cursor: "pointer" }}>
                <X size={13} />New Analysis
              </button>
            </div>
            <ResultsDisplay result={result} />
          </>
        )}

        {!result && !loading && (
          <div style={{ marginTop: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px", marginBottom: "20px" }}>
              {[{ value: "8", label: "Sections" }, { value: "32", label: "Signals" }, { value: "100", label: "Point Scale" }, { value: "Free", label: "Always" }].map((s) => (
                <div key={s.label} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 12px", background: "var(--bg-card)", textAlign: "center", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
                  <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--accent)", marginBottom: "6px" }}>{s.value}</div>
                  <div style={{ fontSize: "15px", color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Score Scale Bar */}
            <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "var(--bg-card)", padding: "20px 24px", marginBottom: "12px", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "12px" }}>How scores are interpreted</div>
              <div style={{ position: "relative", marginBottom: "6px" }}>
                <div style={{ height: "10px", borderRadius: "6px", background: "linear-gradient(to right, #c43302 0%, #c43302 25%, #c47a00 25%, #c47a00 50%, #0a8a6a 50%, #0a8a6a 75%, #0a7373 75%, #0a7373 100%)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "10px" }}>
                <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
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
                  <div style={{ fontSize: "15px", color: "var(--text-muted)" }}>8 sections · 32 individual factors — each scored and explained</div>
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
                        <div style={{ fontSize: "17px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "14px" }}>{sec.desc}</div>
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
      </div>

      {/* DISCLAIMER */}
      <div style={{ maxWidth: "760px", margin: "0 auto 40px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", background: "var(--bg-elevated)", fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.75" }}>
          <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Disclaimer</strong>
          Telltale Proof provides probabilistic analysis only and does not constitute a definitive determination of authorship. Results should not be used as evidence in academic, legal, employment, or disciplinary proceedings. AI detection is an imperfect science — scores may be affected by writing style, text length, editing, translation, or subject matter. A high Human Score does not guarantee human authorship, and a low score does not prove AI generation. Telltale Proof is provided free of charge and without warranty of any kind. Web Thrive, LLC accepts no liability for decisions made based on analysis results.
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 16px", textAlign: "center", background: "var(--bg-card)" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "10px" }}>
            © {new Date().getFullYear()} Web Thrive, LLC. Telltale Proof is a free AI text detection tool. Results are probabilistic, not definitive.
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
            {[{ label: "About", href: "/about" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/contact" }, { label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Use", href: "/terms" }, { label: "Cookie Policy", href: "/cookies" }].map((link) => (
              <a key={link.href} href={link.href} style={{ fontSize: "14px", color: "var(--text-muted)", textDecoration: "none" }}>{link.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
