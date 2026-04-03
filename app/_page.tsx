"use client";

import { useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import SectionCard from "@/components/SectionCard";
import { Scan, X, ArrowRight, ChevronDown, ChevronUp, Zap } from "lucide-react";

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
  const [streamingSections, setStreamingSections] = useState<AnalysisResult["sections"]>([]);
  const [sectionsComplete, setSectionsComplete] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50) { setError("Please enter at least 50 characters."); return; }
    setLoading(true); setError(null); setResult(null); setStreamingSections([]); setSectionsComplete(0);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "section") {
              setStreamingSections((prev) => [...prev, event.section]);
              setSectionsComplete((n) => n + 1);
            } else if (event.type === "complete") {
              setResult({ ...event.result, text: text.substring(0, 500) });
              setStreamingSections(event.result.sections);
              setLoading(false);
            } else if (event.type === "error") {
              throw new Error(event.message);
            }
          } catch (parseErr: any) {
            if (parseErr.message && !parseErr.message.includes("JSON")) throw parseErr;
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); setStreamingSections([]); setSectionsComplete(0); };
  const loadSample = () => { setText(SAMPLE_TEXT); setResult(null); setError(null); };

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1, padding: "0 16px" }}>

      <header style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 0 28px", textAlign: "center" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.3)", borderRadius: "20px", padding: "7px 16px", marginBottom: "24px", textDecoration: "none" }}>
          <Scan size={14} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "13px", color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em", fontWeight: 500, textAlign: "center" }}>
            <span className="badge-desktop">Free AI Content Detector by Content Trace</span>
            <span className="badge-mobile">Free AI Content Detector<br />by Content Trace</span>
          </span>
        </a>
        <h1 style={{ fontSize: "clamp(32px, 7vw, 62px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "10px", letterSpacing: "-0.03em" }}>
          Deep AI Content Analysis
        </h1>
        <h2 style={{ fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 400, color: "#0b0b0b", lineHeight: 1.3, marginBottom: "24px", letterSpacing: "-0.01em" }}>
          Paste. Analyze. Know.
        </h2>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "640px", margin: "0 auto", lineHeight: "1.7" }}>
          Content Trace is a free AI detection tool that analyzes text across <strong style={{ color: "var(--accent)", fontWeight: 600 }}>32 signals</strong> including writing patterns, sentence structure, and cognitive fingerprinting. Used by educators, writers, and content professionals worldwide.
        </p>
      </header>

      <div style={{ maxWidth: "760px", margin: "0 auto", paddingBottom: "40px" }}>

        {(true) && (
          <div style={{ border: "1px solid var(--border)", borderRadius: "16px", background: "var(--bg-card)", overflow: "hidden", marginBottom: "20px", boxShadow: "0 2px 12px rgba(1,2,33,0.06)" }}>
            <textarea
              value={text}
              onChange={(e) => { if (!result && !loading) setText(e.target.value.slice(0, CHAR_LIMIT)); }}
              readOnly={!!result || loading}
              placeholder="Paste any text here — blog post, email, essay, social content, product description, marketing copy..."
              style={{ width: "100%", minHeight: result ? "120px" : "240px", padding: "22px", background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "16px", fontFamily: "var(--font)", lineHeight: "1.75", resize: result ? "none" : "vertical", boxSizing: "border-box", opacity: result ? 0.7 : 1 }}
            />
            {!result && <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", background: "var(--bg-elevated)" }}>
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
            </div>}
          </div>
        )}

        {error && (
          <div style={{ border: "1px solid rgba(196,51,2,0.3)", borderRadius: "10px", background: "rgba(196,51,2,0.06)", padding: "14px 18px", fontSize: "15px", color: "var(--red)", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {error}
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)" }}><X size={15} /></button>
          </div>
        )}

        {loading && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "16px", height: "16px", border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", flexShrink: 0 }} className="spin" />
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {sectionsComplete === 0 ? "Analyzing across 32 signals…" : `Analyzing… ${sectionsComplete} / 8 sections complete`}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <Zap size={14} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                Section Breakdown — streaming live
              </span>
            </div>
            {/* Completed sections */}
            {streamingSections.map((section, i) => (
              <SectionCard key={section.name} section={section} index={i} />
            ))}
            {/* Skeleton placeholders for all 8 slots not yet filled */}
            {Array.from({ length: Math.max(0, 8 - streamingSections.length) }).map((_, i) => (
              <div key={`skel-${i}`} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 20px", marginBottom: "8px", background: "var(--bg-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, marginRight: "16px" }}>
                    <div style={{ height: "13px", background: "var(--bg-elevated)", borderRadius: "6px", width: `${30 + (i * 7) % 25}%`, marginBottom: "10px" }} className="pulse" />
                    <div style={{ height: "6px", background: "var(--bg-elevated)", borderRadius: "6px", width: "100%" }} className="pulse" />
                  </div>
                  <div style={{ height: "20px", width: "36px", background: "var(--bg-elevated)", borderRadius: "6px" }} className="pulse" />
                </div>
              </div>
            ))}
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
      </div>

      {/* DISCLAIMER */}
      <div style={{ maxWidth: "760px", margin: "0 auto 40px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", background: "var(--bg-elevated)", fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.75" }}>
          <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Disclaimer</strong>
          Content Trace provides probabilistic analysis only and does not constitute a definitive determination of authorship. Results should not be used as evidence in academic, legal, employment, or disciplinary proceedings. AI detection is an imperfect science — scores may be affected by writing style, text length, editing, translation, or subject matter. A high Human Score does not guarantee human authorship, and a low score does not prove AI generation. Content Trace is provided free of charge and without warranty of any kind. Web Thrive, LLC accepts no liability for decisions made based on analysis results.
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>How It Works</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>Three steps. No account. No waiting.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { step: "1", icon: "📋", title: "Paste Your Text", desc: "Drop in any text — an essay, blog post, email, social caption, or anything else you want to check." },
            { step: "2", icon: "🔍", title: "Analyze", desc: "Our model scores your content across 8 sections and 32 individual signals in seconds." },
            { step: "3", icon: "📊", title: "Get Your Results", desc: "Receive a Human Score out of 100, with a full breakdown by section so you know exactly why." },
          ].map((item) => (
            <div key={item.step} style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "28px 22px", background: "var(--bg-card)", textAlign: "center", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
              <div style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.3)", borderRadius: "12px", padding: "3px 10px", marginBottom: "12px", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>STEP {item.step}</div>
              <div style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{item.title}</div>
              <div style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WHO USES THIS */}
      <div style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>Who Uses Content Trace</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>Trusted by people who care about content authenticity.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {[
            { icon: "🎓", label: "Teachers & Educators", desc: "Verify student submissions and maintain academic integrity without expensive institutional tools." },
            { icon: "✍️", label: "Writers & Bloggers", desc: "Confirm your own work reads as authentically human before publishing or submitting." },
            { icon: "📣", label: "Content & SEO Professionals", desc: "Audit content before it goes live — especially when working with freelancers or AI-assisted drafts." },
            { icon: "📚", label: "Students", desc: "Check your own writing for AI-like patterns before submitting, and understand how to write more naturally." },
            { icon: "🗞️", label: "Publishers & Editors", desc: "Screen incoming content and maintain quality standards across a growing volume of submissions." },
          ].map((item) => (
            <div key={item.label} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", background: "var(--bg-card)", display: "flex", gap: "14px", alignItems: "flex-start", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <span style={{ fontSize: "24px", flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "5px" }}>{item.label}</div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.5" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>Why Content Trace</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>Not all AI detectors are built the same.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
          {[
            { icon: "🆓", title: "100% Free", desc: "No paywalls. No trial periods. No credit card. Free, always." },
            { icon: "🧠", title: "32 Signals", desc: "Far beyond basic perplexity checks — we analyze cognitive fingerprinting, voice, emotion, and more." },
            { icon: "🚫", title: "No Signup Required", desc: "Paste and analyze. No account, no email, no friction." },
            { icon: "🔒", title: "Privacy Focused", desc: "Your text is never stored or used to train models. What you paste stays yours." },
          ].map((item) => (
            <div key={item.title} style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "24px 18px", background: "var(--bg-card)", textAlign: "center", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{item.title}</div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.5" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>What People Are Saying</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>Used by educators, writers, and content teams every day.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { quote: "Quick and accurate — a lifesaver for my classroom. I finally have a free tool I can actually rely on.", author: "High school English teacher" },
            { quote: "I use this before submitting any freelance piece. It catches patterns in my writing I didn't even notice.", author: "Freelance content writer" },
            { quote: "The section breakdown is genuinely useful. It doesn't just give a score — it tells you why.", author: "SEO manager at a digital agency" },
          ].map((t, i) => (
            <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", background: "var(--bg-card)", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <div style={{ fontSize: "24px", color: "var(--accent)", marginBottom: "12px", lineHeight: 1 }}>"</div>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "16px", fontStyle: "italic" }}>{t.quote}</p>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>— {t.author}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>Frequently Asked Questions</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>Everything you need to know about Content Trace.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { q: "How accurate is Content Trace?", a: "Content Trace uses a multi-signal approach across 32 factors to produce a probabilistic Human Score. It is significantly more nuanced than single-metric detectors, but no AI detection tool is 100% accurate. Scores should be interpreted as indicators, not verdicts — particularly for short texts or content that has been heavily edited." },
            { q: "Is it really free?", a: "Yes, completely. There is no paid tier, no trial, and no credit card required. Content Trace is free to use for any volume of analysis. We're supported by advertising, not subscriptions." },
            { q: "Can I use it for academic work?", a: "Content Trace is commonly used by educators to screen student work and by students to review their own writing. However, our disclaimer applies: results should not be used as sole evidence in academic disciplinary proceedings. AI detection is probabilistic, and a low Human Score does not prove AI authorship." },
            { q: "Does Content Trace store my text?", a: "No. Text submitted for analysis is processed in real time and is not stored, logged, or used to train any models. Your content remains private." },
            { q: "What makes Content Trace different from other AI detectors?", a: "Most AI detectors rely on statistical proxies like perplexity and burstiness. Content Trace goes further — analyzing cognitive fingerprinting, emotional texture, voice authenticity, and pragmatic signals that are much harder for AI to replicate. The result is a richer, more explainable score." },
          ].map((item, i) => (
            <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "22px 24px", background: "var(--bg-card)", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>{item.q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.7" }}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
