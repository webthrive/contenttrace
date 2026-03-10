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

      {/* HEADER */}
      <header style={{ maxWidth: "760px", margin: "0 auto", padding: "52px 0 36px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "20px", padding: "7px 16px", marginBottom: "24px" }}>
          <Scan size={14} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "13px", color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em", fontWeight: 500 }}>Free AI Text Detector</span>
        </div>

        <h1 style={{ fontSize: "clamp(36px, 6vw, 58px)", fontFamily: "var(--font)", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.12, marginBottom: "18px", letterSpacing: "-0.02em" }}>
          Is your content<br />TelltaleProof?
        </h1>

        <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto 12px", lineHeight: "1.65" }}>
          The free AI writing detector that goes deeper. Analyze any text across <strong style={{ color: "var(--text-primary)" }}>8 sections and 32 individual signals</strong> — structure, voice, cognitive fingerprinting, emotional texture, and more.
        </p>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", maxWidth: "440px", margin: "0 auto" }}>
          Paste your content below and get a Human Score out of 100. No account required. Always free.
        </p>
      </header>

      <div style={{ maxWidth: "760px", margin: "0 auto", paddingBottom: "80px" }}>

        {/* INPUT */}
        {!result && (
          <div style={{ border: "1px solid var(--border-light)", borderRadius: "16px", background: "var(--bg-card)", overflow: "hidden", marginBottom: "20px" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, CHAR_LIMIT))}
              placeholder="Paste any text here — blog post, email, essay, social content, product description, marketing copy..."
              style={{ width: "100%", minHeight: "240px", padding: "22px", background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "16px", fontFamily: "var(--font)", lineHeight: "1.75", resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{wordCount} words · {charCount.toLocaleString()}/{CHAR_LIMIT.toLocaleString()} chars</span>
                <button onClick={loadSample} style={{ fontSize: "13px", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Load sample</button>
              </div>
              <button onClick={handleAnalyze} disabled={loading || charCount < 50}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: loading || charCount < 50 ? "var(--bg-elevated)" : "var(--accent)", color: loading || charCount < 50 ? "var(--text-muted)" : "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading || charCount < 50 ? "not-allowed" : "pointer", fontFamily: "var(--font)" }}>
                {loading
                  ? (<><span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} className="spin" />Analyzing...</>)
                  : (<><Scan size={15} />Analyze Text<ArrowRight size={15} /></>)}
              </button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{ border: "1px solid rgba(248,113,113,0.3)", borderRadius: "10px", background: "rgba(248,113,113,0.08)", padding: "14px 18px", fontSize: "15px", color: "#f87171", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {error}
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171" }}><X size={15} /></button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
            <div style={{ width: "44px", height: "44px", border: "2px solid var(--border-light)", borderTopColor: "var(--accent)", borderRadius: "50%", margin: "0 auto 18px" }} className="spin" />
            <div style={{ fontSize: "16px", marginBottom: "6px" }}>Running deep analysis across 32 signals...</div>
            <div style={{ fontSize: "14px" }}>This takes 10–20 seconds</div>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Analysis complete</span>
              <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--text-secondary)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 14px", cursor: "pointer", fontFamily: "var(--font)" }}>
                <X size={13} />New Analysis
              </button>
            </div>
            <ResultsDisplay result={result} />
          </>
        )}

        {/* WHAT WE ANALYZE — collapsible */}
        {!result && !loading && (
          <div style={{ marginTop: "32px" }}>

            {/* Quick stats bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
              {[
                { value: "8", label: "Sections" },
                { value: "32", label: "Signals" },
                { value: "100", label: "Point Scale" },
                { value: "Free", label: "Always" },
              ].map((s) => (
                <div key={s.label} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 12px", background: "var(--bg-card)", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontFamily: "var(--font)", color: "var(--accent)", marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Expandable sections breakdown */}
            <div style={{ border: "1px solid var(--border-light)", borderRadius: "14px", background: "var(--bg-card)", overflow: "hidden" }}>
              <button
                onClick={() => setSectionsOpen(!sectionsOpen)}
                style={{ width: "100%", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "3px" }}>What we analyze</div>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>8 sections · 32 individual factors — each scored and explained</div>
                </div>
                <span style={{ color: "var(--text-muted)", flexShrink: 0, marginLeft: "12px" }}>
                  {sectionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {sectionsOpen && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px 20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
                    {SECTIONS_INFO.map((sec) => (
                      <div key={sec.name} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", background: "var(--bg-elevated)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                          <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{sec.name}</div>
                          <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)", background: "rgba(99,102,241,0.12)", padding: "2px 8px", borderRadius: "10px", flexShrink: 0, marginLeft: "8px" }}>{sec.weight}</span>
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "10px" }}>{sec.desc}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {sec.factors.map((f) => (
                            <span key={f} style={{ fontSize: "11px", color: "var(--text-secondary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 8px" }}>{f}</span>
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

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "10px" }}>
            © {new Date().getFullYear()} TelltaleProof. Free AI text detection tool. Results are probabilistic, not definitive.
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Use", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
            ].map((link) => (
              <a key={link.href} href={link.href} style={{ fontSize: "14px", color: "var(--text-muted)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
