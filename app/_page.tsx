"use client";

import { useEffect, useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import RecentAnalyses from "@/components/RecentAnalyses";
import OptimizePanel from "@/components/OptimizePanel";
import SectionCard from "@/components/SectionCard";
import WorkspaceTabs from "@/components/WorkspaceTabs";
import Nav from "@/components/Nav";
import { X, ArrowRight, ChevronDown, ChevronUp, Zap, Sparkles, Scan } from "lucide-react";
import { CONTENT_TYPE_OPTIONS } from "@/lib/contentTypes";
import { fetchUsage, type UsageInfo } from "@/lib/billing/browser";
import { PLANS, PRO_YEARLY_PER_MONTH } from "@/lib/billing/config";
import { needsBotCheckFor, useTurnstile } from "@/hooks/useTurnstile";

// Testimonials stay hidden until they come from real customers who agreed to be quoted.
const SHOW_TESTIMONIALS = false;
const CHAR_LIMIT = 10000;

const SAMPLE_TEXT = `Artificial intelligence has fundamentally transformed how organizations approach data-driven decision making. By leveraging advanced machine learning algorithms and neural network architectures, businesses can now extract meaningful insights from vast datasets that would have been previously unanalyzable. This paradigm shift represents a significant opportunity for enterprises willing to embrace digital transformation.

It is important to note that implementing AI solutions requires careful consideration of both technical and organizational factors. Companies must ensure they have the right infrastructure, talent, and governance frameworks in place to successfully deploy these technologies at scale. Furthermore, ethical considerations around bias, transparency, and accountability must be thoroughly addressed.

In conclusion, organizations that strategically invest in AI capabilities will be well-positioned to achieve competitive advantages in an increasingly data-driven marketplace.`;

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
export default function AnalyzerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [streamingSections, setStreamingSections] = useState<AnalysisResult["sections"]>([]);
  const [sectionsComplete, setSectionsComplete] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [contentType, setContentType] = useState<string>("auto");
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [view, setView] = useState<"analysis" | "optimize">("analysis");
  const [optRuns, setOptRuns] = useState(0);
  const [textOpen, setTextOpen] = useState(false);

  const charLimit = usage?.charLimit ?? CHAR_LIMIT;
  const needsBotCheck = needsBotCheckFor(usage);
  const { ref: turnstileRef, reset: resetTurnstile, getFreshToken } = useTurnstile(needsBotCheck);

  // Signed-in users, and anyone who has started a check, get a focused tool view with no marketing copy.
  const signedIn = Boolean(usage?.signedIn);
  const landing = !signedIn && !loading && !result;

  useEffect(() => { fetchUsage().then(setUsage); }, []);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50) { setError("Please enter at least 50 characters."); return; }
    setLoading(true); setView("analysis"); setTextOpen(false); setError(null); setLimitMessage(null); setResult(null); setStreamingSections([]); setSectionsComplete(0); setDetectedType(null);
    let token: string | null = null;
    if (needsBotCheck) {
      token = await getFreshToken();
      if (!token) { setError("The quick human check did not finish. Please try again in a moment."); setLoading(false); return; }
    }
    let finished = false; // true once a "complete" or "error" event arrives
    try {
      const send = (t: string | null) => fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, contentType, turnstileToken: t }) });
      let res = await send(token);
      // A token can still be rejected (expired or already used). Get a new one and retry once.
      if (res.status === 403 && needsBotCheck) {
        let code: string | undefined;
        try { code = (await res.clone().json())?.code; } catch { /* not JSON */ }
        if (code === "bot_check") {
          const retryToken = await getFreshToken(true);
          if (retryToken) res = await send(retryToken);
        }
      }
      if (!res.ok) {
        // The server can return an HTML error page (500/504), so do not assume JSON.
        let message = "Analysis failed. Please try again.";
        let code: string | undefined;
        try { const data = await res.json(); if (data?.error) message = data.error; code = data?.code; } catch { /* non-JSON error page */ }
        if (code === "limit" || code === "too_long") { setLimitMessage(message); setLoading(false); resetTurnstile(); return; }
        throw new Error(message);
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
            if (event.type === "contentType") {
              setDetectedType(event.contentType?.label ?? null);
            } else if (event.type === "section") {
              setStreamingSections((prev) => [...prev, event.section]);
              setSectionsComplete((n) => n + 1);
            } else if (event.type === "complete") {
              finished = true;
              setResult({ ...event.result, text: text.substring(0, 500) });
              setHistoryId(typeof event.historyId === "string" ? event.historyId : null);
              setStreamingSections(event.result.sections);
              setLoading(false);
            } else if (event.type === "error") {
              finished = true;
              throw new Error(event.message);
            }
          } catch (parseErr: any) {
            if (parseErr.message && !parseErr.message.includes("JSON")) throw parseErr;
          }
        }
      }
      // Stream closed early (for example, a server timeout): do not leave the spinner running.
      if (!finished) throw new Error("The analysis did not finish. Please try again.");
      resetTurnstile();
      fetchUsage().then(setUsage);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      resetTurnstile();
      setLoading(false);
    }
  };

  const handleReset = () => { setView("analysis"); setOptRuns(0); setTextOpen(false); setHistoryId(null); setResult(null); setError(null); setStreamingSections([]); setSectionsComplete(0); };
  const loadSample = () => { setText(SAMPLE_TEXT); setResult(null); setError(null); };

  const usageLine = usage?.enabled && !usage.error ? (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
      <span>
        {usage.plan === "pro" && usage.proWordsLeft != null && <>Pro · {usage.proWordsLeft.toLocaleString()} words left this month</>}
        {usage.plan === "pack" && <>Word Pack · {(usage.packWords ?? 0).toLocaleString()} words left</>}
        {usage.plan === "free" && <>{usage.freeAnalysesLeft} of {usage.freeAnalysesTotal} free analyses left this month</>}
      </span>
      <span style={{ display: "flex", gap: "14px" }}>
        {usage.plan !== "pro" && <a href="/pricing" style={{ color: "var(--accent)", fontWeight: 600 }}>{usage.plan === "free" ? "Go Pro for longer texts" : "Upgrade"}</a>}
        {usage.signedIn && <a href="/account/history" style={{ color: "var(--text-secondary)" }}>History</a>}
        <a href={usage.signedIn ? "/account" : "/login?next=/"} style={{ color: "var(--text-secondary)" }}>{usage.signedIn ? "Account" : "Sign in"}</a>
      </span>
    </div>
  ) : null;

  return (
    <>
      <Nav current="/" />
      <main style={{ minHeight: "100vh", position: "relative", zIndex: 1, padding: "0 16px" }}>

      {landing ? (
        <header className="hero" style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 0 20px", textAlign: "center" }}>
          <h1 className="hero-title" style={{ fontSize: "clamp(30px, 6vw, 48px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "10px", letterSpacing: "-0.03em", textWrap: "balance" }}>
            The AI Detector That Shows You How to Fix It
          </h1>
          <h2 className="hero-sub" style={{ fontSize: "clamp(17px, 3.6vw, 24px)", fontWeight: 400, color: "#0b0b0b", lineHeight: 1.3, letterSpacing: "-0.01em", textWrap: "balance" }}>
            See the 32 signals behind your score. Then humanize it, optimize it for SEO, or shape it for AI answers.
          </h2>
        </header>
      ) : (
        <header style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 0 14px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
            {result || loading ? "Your analysis" : "Analyze and optimize your text"}
          </h1>
          {usageLine}
        </header>
      )}

      <div style={{ maxWidth: "760px", margin: "0 auto", paddingBottom: "40px" }}>

        <div className="input-card" style={{ border: "1px solid var(--border)", borderRadius: "16px", background: "var(--bg-card)", overflow: "hidden", marginBottom: "20px", boxShadow: "0 2px 12px rgba(1,2,33,0.06)" }}>
          {!result && <label htmlFor="ct-input" className="input-label">Paste your text to check it for AI</label>}
          {result && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "10px 16px", background: "var(--bg-elevated)", borderBottom: textOpen ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Analyzed text · {wordCount} words</span>
              <button onClick={() => setTextOpen((v) => !v)} aria-expanded={textOpen} style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)" }}>
                {textOpen ? "Hide text" : "Show text"}
              </button>
            </div>
          )}
          {(!result || textOpen) && (
          <textarea
            id="ct-input"
            className="input-area"
            value={text}
            onChange={(e) => { if (!result && !loading) setText(e.target.value.slice(0, charLimit)); }}
            readOnly={!!result || loading}
            placeholder="Paste any text here: blog post, email, essay, social content, product description, marketing copy..."
            style={{ width: "100%", minHeight: result ? "120px" : "240px", maxHeight: result ? "300px" : undefined, padding: "22px", background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "16px", fontFamily: "var(--font)", lineHeight: "1.75", resize: result ? "none" : "vertical", boxSizing: "border-box", opacity: result ? 0.8 : 1 }}
          />
          )}
          {!result && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "10px 18px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", background: "var(--bg-card)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <span>Content type</span>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  disabled={loading}
                  aria-label="Content type"
                  style={{ fontSize: "13px", fontFamily: "var(--font)", color: "var(--text-primary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "5px 8px", cursor: "pointer", maxWidth: "210px" }}
                >
                  <option value="auto">Auto-detect</option>
                  {CONTENT_TYPE_OPTIONS.map((o) => (<option key={o.id} value={o.id}>{o.label}</option>))}
                  <option value="general">General (standard weights)</option>
                </select>
              </label>
              {landing && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Adjusts which signals count for this kind of writing.</span>}
            </div>
          )}
          {!result && <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", background: "var(--bg-elevated)" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{wordCount} words · {charCount.toLocaleString()}/{charLimit.toLocaleString()} chars</span>
              <button onClick={loadSample} style={{ fontSize: "13px", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Load sample</button>
            </div>
            <button onClick={handleAnalyze} disabled={loading || charCount < 50} className="analyze-btn"
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: loading || charCount < 50 ? "var(--bg-elevated)" : "var(--accent)", color: loading || charCount < 50 ? "var(--text-muted)" : "white", border: loading || charCount < 50 ? "1px solid var(--border)" : "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading || charCount < 50 ? "not-allowed" : "pointer", fontFamily: "var(--font)", boxShadow: loading || charCount < 50 ? "none" : "0 2px 8px rgba(10,115,115,0.3)" }}>
              {loading
                ? (<><span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} className="spin" />Analyzing...</>)
                : (<><Scan size={15} />Analyze Text<ArrowRight size={15} /></>)}
            </button>
          </div>}
        </div>

        {needsBotCheck && <div ref={turnstileRef} style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }} />}

        {landing && usageLine && <div style={{ margin: "-8px 2px 16px" }}>{usageLine}</div>}

        {usage?.signedIn && !result && !loading && <RecentAnalyses refreshKey={historyId} />}

        {landing && (
          <p className="hero-sub" style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "640px", margin: "0 auto 8px", lineHeight: "1.7", textAlign: "center" }}>
            Content Trace checks your text for AI with <strong style={{ color: "var(--accent)", fontWeight: 600 }}>32 explained signals</strong>, then rewrites the weak spots for the goal you pick: <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Humanize</strong>, <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>SEO</strong> or <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>AI answers</strong>. You see every change, with the scores before and after. We edit wording only, and we never invent facts.
          </p>
        )}

        {limitMessage && (
          <div role="alert" style={{ border: "1px solid rgba(10,115,115,0.35)", borderRadius: "12px", background: "var(--accent-light)", padding: "18px 20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>{limitMessage}</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Pro is ${PRO_YEARLY_PER_MONTH} a month billed yearly (${PLANS.pro.yearlyPrice}), or ${PLANS.pro.monthlyPrice} month to month, for {PLANS.pro.wordsPerMonth.toLocaleString()} words a month and texts up to {PLANS.pro.charLimit.toLocaleString()} characters. Or buy a one-time Word Pack ({PLANS.pack.words.toLocaleString()} words for ${PLANS.pack.price}).
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href="/pricing" style={{ padding: "10px 16px", borderRadius: "8px", background: "var(--accent)", color: "white", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>See plans</a>
              {!usage?.signedIn && <a href="/login?next=/" style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, textDecoration: "none", background: "var(--bg-card)" }}>Sign in</a>}
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
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "16px", height: "16px", border: "2px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", flexShrink: 0 }} className="spin" />
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {sectionsComplete === 0 ? "Analyzing across 32 signals…" : `Analyzing… ${sectionsComplete} / 8 sections complete`}
                {detectedType && ` · Scoring as: ${detectedType}`}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <Zap size={14} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                Section Breakdown, streaming live
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Analysis complete</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Human Score {Math.round(result.aggregateScore)} <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-secondary)" }}>· {result.verdict}</span>
                </div>
              </div>
              <span style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {view === "analysis" && (
                  <button onClick={() => setView("optimize")} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "white", background: "var(--accent)", border: "none", borderRadius: "8px", padding: "10px 16px", cursor: "pointer", fontFamily: "var(--font)" }}>
                    <Sparkles size={14} />Optimize this text
                  </button>
                )}
                <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--text-secondary)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", cursor: "pointer", fontFamily: "var(--font)" }}>
                  <X size={13} />New analysis
                </button>
              </span>
            </div>
            {historyId && (
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
                Saved to your history. <a href={`/account/history/${historyId}`} style={{ color: "var(--accent)", fontWeight: 600 }}>Open it any time</a> · <a href="/account/history" style={{ color: "var(--accent)" }}>All past analyses</a>
              </div>
            )}
            {!historyId && usage?.enabled && !usage.signedIn && (
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
                This result is not saved. <a href="/login?next=/account/history" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in</a> to save future results to your history.
              </div>
            )}

            <WorkspaceTabs
              tabs={[{ id: "analysis", label: "Analysis" }, { id: "optimize", label: "Optimize & compare", badge: optRuns }]}
              active={view}
              onChange={setView}
            />

            <div style={{ display: view === "analysis" ? "block" : "none" }}>
              <ResultsDisplay result={result} />
            </div>
            <div style={{ display: view === "optimize" ? "block" : "none" }}>
              <OptimizePanel
                text={text}
                result={result}
                historyId={historyId}
                usage={usage}
                needsBotCheck={needsBotCheck}
                getToken={getFreshToken}
                onUsageChange={() => { fetchUsage().then(setUsage); }}
                onRunsChange={setOptRuns}
              />
            </div>
          </>
        )}

        {landing && (
        <>
      {/* THREE OPTIMIZERS */}
      <div style={{ margin: "36px 0 8px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>Three Ways to Improve Your Text</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>Check it for AI, then pick a goal. You see every change, with the scores before and after.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          {[
            { icon: "✍️", title: "Humanize", tag: "Make AI drafts read like a person wrote them.", points: ["Plain words and varied sentences", "Cuts AI filler and stock phrases", "Keeps your facts, quotes and voice"], best: "AI first drafts, emails, LinkedIn posts" },
            { icon: "🔎", title: "SEO", tag: "Help search engines understand your page.", points: ["Descriptive headings", "The main point in the first paragraph", "Your keyword placed naturally, never stuffed"], best: "Blog posts, landing pages, guides" },
            { icon: "💬", title: "AI answers (AEO)", tag: "Get quoted in AI Overviews, ChatGPT and Perplexity.", points: ["A direct answer up top", "Question-style headings", "Self-contained, quotable passages"], best: "FAQs, how-to content, explainers" },
          ].map((o) => (
            <div key={o.title} style={{ border: "1px solid rgba(10,115,115,0.3)", borderRadius: "14px", padding: "24px 20px", background: "linear-gradient(180deg, rgba(10,115,115,0.05), var(--bg-card))", boxShadow: "0 1px 6px rgba(1,2,33,0.05)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "28px" }}>{o.icon}</div>
              <div style={{ fontSize: "19px", fontWeight: 700, color: "var(--accent)" }}>{o.title}</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.45 }}>{o.tag}</div>
              <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {o.points.map((pt) => <li key={pt} style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{pt}</li>)}
              </ul>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "auto" }}><strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Best for:</strong> {o.best}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, maxWidth: "620px", margin: "18px auto 0" }}>
          We edit wording only. We never invent facts, quotes or stories. Where a real example or number would help, we add a marker like [Add: a real example] for you to fill in.
        </p>
      </div>

        </>
        )}

        {landing && (
          <div style={{ marginTop: "32px" }}>
            <div className="stats-tiles" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px", marginBottom: "20px" }}>
              {[{ value: "32", label: "Signals" }, { value: "3", label: "Optimizers" }, { value: "100", label: "Point Scale" }].map((s) => (
                <div key={s.label} className="stat-tile" style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 12px", background: "var(--bg-card)", textAlign: "center", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
                  <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--accent)", marginBottom: "6px" }}>{s.value}</div>
                  <div className="stat-label" style={{ fontSize: "15px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{s.label}</div>
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
      </div>

      {landing && (
      <>
      {/* HOW IT WORKS */}
      <div style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>How It Works</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>Three steps. No account needed to start.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { step: "1", icon: "📋", title: "Paste Your Text", desc: "A blog post, email, essay, social post or AI draft. Anything you want to check or improve." },
            { step: "2", icon: "🔍", title: "Check for AI", desc: "Get a Human Score out of 100 and the 32 signals behind it, each explained in plain language." },
            { step: "3", icon: "✨", title: "Optimize and Compare", desc: "Pick Humanize, SEO or AI answers. Compare before and after side by side, then copy the new version." },
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
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>For anyone who writes with AI, or reviews writing that might be.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {[
            { icon: "📣", label: "Content & SEO Teams", desc: "Humanize AI drafts and tune them for search and AI answers before they go live." },
            { icon: "✍️", label: "Writers & Marketers", desc: "Turn AI first drafts into copy that sounds like you, without losing your facts." },
            { icon: "🗞️", label: "Publishers & Editors", desc: "Screen submissions for AI patterns and see exactly which signals stand out." },
            { icon: "🎓", label: "Teachers & Educators", desc: "Get a second opinion on student work, with every signal explained." },
            { icon: "📚", label: "Students", desc: "Check your own writing for AI-like patterns and learn to write more naturally." },
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
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>An AI detector and an editor in one place.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
          {[
            { icon: "🆓", title: "Free to Start", desc: `${PLANS.free.analysesPerMonth} free analyses every month. No credit card. Pro from $${PRO_YEARLY_PER_MONTH}/month (billed yearly) when you need more.` },
            { icon: "🧠", title: "Explains Every Score", desc: "32 signals, each scored and explained. Not just a percentage." },
            { icon: "✨", title: "Three Optimizers", desc: "Humanize, SEO and AI answers, scored with the same engine before and after." },
            { icon: "🛡️", title: "Edits, Never Invents", desc: "Your facts, numbers and quotes stay. A fact check flags anything that changed." },
            { icon: "🔒", title: "Privacy Focused", desc: "Signed out, your text is never stored. Signed in, results go to your private history and you can delete them any time. Never used to train models." },
          ].map((item) => (
            <div key={item.title} style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "24px 18px", background: "var(--bg-card)", textAlign: "center", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{item.title}</div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.5" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS — hidden until we have quotes from real, named users (see SHOW_TESTIMONIALS) */}
      {SHOW_TESTIMONIALS && <div style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
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
      </div>}

      {/* FAQ */}
      <div id="faq" style={{ maxWidth: "760px", margin: "0 auto 60px" }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>Frequently Asked Questions</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px" }}>Everything you need to know about Content Trace.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { q: "How accurate is Content Trace?", a: "Content Trace uses a multi-signal approach across 32 factors to produce a probabilistic Human Score. It is significantly more nuanced than single-metric detectors, but no AI detection tool is 100% accurate. Scores should be interpreted as indicators, not verdicts, particularly for short texts or content that has been heavily edited." },
            { q: "Is it free?", a: `Yes, for ${PLANS.free.analysesPerMonth} analyses a month of up to ${PLANS.free.charLimit.toLocaleString()} characters each, with no account and no credit card. For more analyses and longer texts (up to ${PLANS.pro.charLimit.toLocaleString()} characters), Pro is $${PRO_YEARLY_PER_MONTH} a month billed yearly ($${PLANS.pro.yearlyPrice}) or $${PLANS.pro.monthlyPrice} month to month, with no ads, or you can buy a one-time Word Pack. See the Pricing page for details.` },
            { q: "What do the three optimizers do?", a: "After an analysis, the optimizer rewrites the weak spots it found for the goal you choose. Humanize makes AI drafts read like a person wrote them: plain words, varied sentences, no AI filler. SEO adds descriptive headings, puts the main point early and places your keyword naturally. AI answers adds a direct answer up top, question headings and passages that AI Overviews, ChatGPT and Perplexity can quote. Then it scores the new version with the same engine and shows every change side by side, so you can compare the Human Score, reading ease and Search & AI-answer readiness before and after. You can run all three on the same text." },
            { q: "Will Humanize make AI text undetectable?", a: "No, and we do not promise that. Humanize edits wording so a draft reads naturally. It never invents personal stories, opinions or facts to push the score up, so the Human Score may move only a little. Reading ease usually improves most. The biggest gains come from the real details you add where we place [Add: ...] markers, because specific, first-hand detail is what makes writing human." },
            { q: "Does the optimizer invent facts or guarantee rankings?", a: "No to both. It keeps your facts, numbers and claims. Where a real example, number or source would make the text stronger, it adds a marker like [Add: a real example from your work] for you to fill in. Readiness is a checklist based on what search engines and AI assistants tend to quote. No tool can guarantee rankings or AI citations, so review every change before you publish." },
            { q: "Can I use it for academic work?", a: "Educators can use Content Trace to screen student work, and students can use it to review their own writing. However, our disclaimer applies: results should not be used as sole evidence in academic disciplinary proceedings. AI detection is probabilistic, and a low Human Score does not prove AI authorship." },
            { q: "Does Content Trace store my text?", a: "Only if you sign in. Signed out, your text is processed in real time and is not stored, logged, or used to train any models. When you are signed in, each analysis and optimization is saved to your private history so you can come back to it. Only you can see it, and you can delete any item at any time. We never use your text to train models." },
            { q: "What makes Content Trace different from other AI detectors?", a: "Most AI detectors give you one percentage. Content Trace explains its score with 32 signals, including cognitive fingerprinting, voice, emotional texture and pragmatic signals that are hard for AI to fake. Then it helps you fix what it found: Humanize, SEO and AI-answer optimizers rewrite the weak spots and show every change before and after." },
          ].map((item, i) => (
            <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "22px 24px", background: "var(--bg-card)", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>{item.q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: "1.7" }}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>

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

      {/* DISCLAIMER */}
      <div style={{ maxWidth: "760px", margin: "0 auto 48px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", background: "var(--bg-elevated)", fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.75" }}>
          <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Disclaimer</strong>
          Content Trace provides probabilistic analysis only and does not constitute a definitive determination of authorship. Results should not be used as evidence in academic, legal, employment, or disciplinary proceedings. AI detection is an imperfect science. Scores may be affected by writing style, text length, editing, translation, or subject matter. A high Human Score does not guarantee human authorship, and a low score does not prove AI generation. Content Trace is provided without warranty of any kind. Web Thrive, LLC accepts no liability for decisions made based on analysis results.
        </div>
      </div>
      </>
      )}

      {!landing && (
        <p style={{ maxWidth: "760px", margin: "0 auto 40px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.7 }}>
          Scores are probabilistic and are not proof of authorship. <a href="/disclaimer" style={{ color: "var(--accent)" }}>Disclaimer</a> · <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy</a> · <a href="/pricing" style={{ color: "var(--accent)" }}>Plans</a>
        </p>
      )}
    </main>
    </>
  );
}
