"use client";

import { useEffect, useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import RecentAnalyses from "@/components/RecentAnalyses";
import OptimizePanel from "@/components/OptimizePanel";
import SectionCard from "@/components/SectionCard";
import WorkspaceTabs from "@/components/WorkspaceTabs";
import Nav from "@/components/Nav";
import { X, ArrowRight, Zap, Sparkles, Scan } from "lucide-react";
import { CONTENT_TYPE_OPTIONS } from "@/lib/contentTypes";
import { fetchUsage, type UsageInfo } from "@/lib/billing/browser";
import { TURNSTILE_BOX, clearHumanPass, getHumanPass, needsBotCheckFor, setHumanPass, useTurnstile } from "@/hooks/useTurnstile";
import LandingSections, { OptimizerCards } from "@/components/LandingSections";
import RichEditor from "@/components/RichEditor";
import MarkdownView from "@/components/MarkdownView";
import LimitModal, { takeDraft } from "@/components/LimitModal";
import { mdToPlain } from "@/lib/markdown";
import { LANDING_COPY, type LandingVariant } from "@/lib/landingCopy";

const CHAR_LIMIT = 10000;

const SAMPLE_TEXT = `Artificial intelligence has fundamentally transformed how organizations approach data-driven decision making. By leveraging advanced machine learning algorithms and neural network architectures, businesses can now extract meaningful insights from vast datasets that would have been previously unanalyzable. This paradigm shift represents a significant opportunity for enterprises willing to embrace digital transformation.

It is important to note that implementing AI solutions requires careful consideration of both technical and organizational factors. Companies must ensure they have the right infrastructure, talent, and governance frameworks in place to successfully deploy these technologies at scale. Furthermore, ethical considerations around bias, transparency, and accountability must be thoroughly addressed.

In conclusion, organizations that strategically invest in AI capabilities will be well-positioned to achieve competitive advantages in an increasingly data-driven marketplace.`;

// The home page and the paid search landing pages share this tool. `variant` picks the copy.
export default function AnalyzerPage({ variant = "home" }: { variant?: LandingVariant }) {
  const copy = LANDING_COPY[variant];
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [streamingSections, setStreamingSections] = useState<AnalysisResult["sections"]>([]);
  const [sectionsComplete, setSectionsComplete] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>("auto");
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [limitCode, setLimitCode] = useState<string>("limit");
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
  // Text saved before a sign-in link was sent from the limit popup.
  useEffect(() => { const d = takeDraft(); if (d) setText(d); }, []);

  const charCount = text.length;
  const plainText = mdToPlain(text);
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const overLimit = charCount > charLimit;

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50) { setError("Please enter at least 50 characters."); return; }
    if (overLimit) { setError(`Your text is over the ${charLimit.toLocaleString()} character limit for your plan. Shorten it, or go Pro for longer texts.`); return; }
    setLoading(true); setView("analysis"); setTextOpen(false); setError(null); setLimitMessage(null); setResult(null); setStreamingSections([]); setSectionsComplete(0); setDetectedType(null);
    // A human pass from an earlier check skips Turnstile. Otherwise get a fresh token.
    const humanPass = needsBotCheck ? getHumanPass() : null;
    let token: string | null = null;
    if (needsBotCheck && !humanPass) {
      token = await getFreshToken();
      if (!token) { setError("The quick human check did not finish. Please try again in a moment."); setLoading(false); return; }
    }
    let finished = false; // true once a "complete" or "error" event arrives
    try {
      const send = (t: string | null) => fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, contentType, turnstileToken: t, humanPass: t ? undefined : humanPass }) });
      let res = await send(token);
      // A token can still be rejected (expired or already used). Get a new one and retry once.
      if (res.status === 403 && needsBotCheck) {
        let code: string | undefined;
        try { code = (await res.clone().json())?.code; } catch { /* not JSON */ }
        if (code === "bot_check") {
          clearHumanPass();
          const retryToken = await getFreshToken(true);
          if (retryToken) res = await send(retryToken);
        }
      }
      if (!res.ok) {
        // The server can return an HTML error page (500/504), so do not assume JSON.
        let message = "Analysis failed. Please try again.";
        let code: string | undefined;
        try { const data = await res.json(); if (data?.error) message = data.error; code = data?.code; } catch { /* non-JSON error page */ }
        if (code === "limit" || code === "too_long") { setLimitCode(code); setLimitMessage(message); setLoading(false); resetTurnstile(); return; }
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
              setView(copy.afterAnalysis);
              setHistoryId(typeof event.historyId === "string" ? event.historyId : null);
              setHumanPass(event.humanPass);
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
            {copy.h1}
          </h1>
          <h2 className="hero-sub" style={{ fontSize: "clamp(17px, 3.6vw, 24px)", fontWeight: 400, color: "#0b0b0b", lineHeight: 1.3, letterSpacing: "-0.01em", textWrap: "balance" }}>
            {copy.sub}
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
          {!result && <label htmlFor="ct-input" className="input-label">{copy.inputLabel}</label>}
          {result && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "10px 16px", background: "var(--bg-elevated)", borderBottom: textOpen ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Analyzed text · {wordCount} words</span>
              <button onClick={() => setTextOpen((v) => !v)} aria-expanded={textOpen} style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)" }}>
                {textOpen ? "Hide text" : "Show text"}
              </button>
            </div>
          )}
          {!result && (
            <RichEditor
              id="ct-input"
              value={text}
              onChange={setText}
              editable={!loading}
              placeholder="Paste any text here: blog post, email, essay, social content, product description, marketing copy... Headings, bold and lists are kept."
            />
          )}
          {result && textOpen && (
            <div style={{ maxHeight: "300px", overflowY: "auto", padding: "16px 22px", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)", overflowWrap: "anywhere" }}>
              <MarkdownView text={text} />
            </div>
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
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{wordCount} words · <span style={{ color: overLimit ? "var(--red)" : undefined, fontWeight: overLimit ? 700 : undefined }}>{charCount.toLocaleString()}/{charLimit.toLocaleString()} chars</span></span>
              <button onClick={loadSample} style={{ fontSize: "13px", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Load sample</button>
            </div>
            <button onClick={handleAnalyze} disabled={loading || charCount < 50 || overLimit} className="analyze-btn"
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: loading || charCount < 50 || overLimit ? "var(--bg-elevated)" : "var(--accent)", color: loading || charCount < 50 || overLimit ? "var(--text-muted)" : "white", border: loading || charCount < 50 || overLimit ? "1px solid var(--border)" : "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading || charCount < 50 || overLimit ? "not-allowed" : "pointer", fontFamily: "var(--font)", boxShadow: loading || charCount < 50 || overLimit ? "none" : "0 2px 8px rgba(10,115,115,0.3)" }}>
              {loading
                ? (<><span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} className="spin" />Analyzing...</>)
                : (<><Scan size={15} />{copy.cta}<ArrowRight size={15} /></>)}
            </button>
          </div>}
        </div>

        {overLimit && !result && (
          <p role="alert" style={{ fontSize: "14px", color: "var(--red)", margin: "-8px 2px 14px" }}>
            Your text is over the {charLimit.toLocaleString()} character limit. Shorten it{usage?.plan !== "pro" ? <>, or <a href="/pricing" style={{ color: "var(--accent)", fontWeight: 600 }}>go Pro</a> for longer texts</> : ""}.
          </p>
        )}

        {needsBotCheck && <div ref={turnstileRef} style={TURNSTILE_BOX} />}

        {landing && copy.ctaNote && <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "-8px 2px 8px" }}>{copy.ctaNote}</p>}
        {landing && usageLine && <div style={{ margin: "-8px 2px 16px" }}>{usageLine}</div>}

        {usage?.signedIn && !result && !loading && <RecentAnalyses refreshKey={historyId} />}

        {landing && (
          <p className="hero-sub" style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "640px", margin: "0 auto 8px", lineHeight: "1.7", textAlign: "center" }}>
            {copy.intro}
          </p>
        )}

        {limitMessage && (
          <LimitModal message={limitMessage} code={limitCode} signedIn={Boolean(usage?.signedIn)} plan={usage?.plan} draftText={text} onClose={() => setLimitMessage(null)} />
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
                defaultGoal={copy.defaultGoal}
                autoRun={copy.autoRun}
              />
            </div>
          </>
        )}

        {landing && <OptimizerCards copy={copy} />}
      </div>

      {landing && <LandingSections copy={copy} />}

      {!landing && (
        <p style={{ maxWidth: "760px", margin: "0 auto 40px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.7 }}>
          Scores are probabilistic and are not proof of authorship. <a href="/disclaimer" style={{ color: "var(--accent)" }}>Disclaimer</a> · <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy</a> · <a href="/pricing" style={{ color: "var(--accent)" }}>Plans</a>
        </p>
      )}
    </main>
    </>
  );
}
