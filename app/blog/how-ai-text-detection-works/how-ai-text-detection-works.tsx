import Nav from "@/components/Nav";
import type { Metadata } from "next";

const SITE_URL = "https://www.contenttrace.ai";
const SLUG = "how-ai-text-detection-works";

export const metadata: Metadata = {
  title: "How AI Text Detection Actually Works",
  description: "Most AI detectors feel like a black box. Here's what's actually happening under the hood — perplexity, behavioral signals, and why some approaches are far more reliable than others.",
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: "How AI Text Detection Actually Works | Content Trace",
    description: "What's actually happening when an AI detector analyzes your text — and why some approaches are more reliable than others.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
  },
  robots: { index: true, follow: true },
};

export default function Article1() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };

  return (
    <><Nav current="/blog" />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "#0a7373", background: "rgba(10,115,115,0.08)", border: "1px solid rgba(10,115,115,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>How AI Text Detection Actually Works</h1>
        <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "32px" }}>March 10, 2026 · 9 min read · By <a href="https://www.webthrive.io/home/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Colin</a></div>

        {/* TL;DR */}
        <div style={{ background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "10px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "AI detectors use two approaches: statistical (perplexity, burstiness) and behavioral (opinion drift, specificity). Behavioral signals are harder to fake.",
              "Perplexity is the most-cited signal but it's model-dependent and gets gamed easily by paraphrasing.",
              "The behavioral signals Content Trace weights most heavily reflect actual cognitive patterns — things that require a mind actively working through a problem.",
              "No detector is 100% accurate. Short texts, heavily edited AI content, and structured human writing all reduce reliability.",
              "A breakdown across 32 signals tells you far more than a single number — look at which sections score low, not just the aggregate.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>I'll be honest — when I first started looking into AI detection, I assumed it was basically magic. You paste text, the algorithm does something opaque, a number comes out. I didn't question it too hard because the numbers seemed roughly right. Then I actually dug into how these tools work, and came away with a much more complicated opinion. Some of what I found was reassuring. Some of it wasn't.</p>

          <p style={p}>The short version: AI detection works better than chance, and anyone who tells you it's either foolproof or useless is oversimplifying. The longer version is more interesting — and more useful if you actually want to understand what these scores mean.</p>

          {/* Stat banner */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", alignItems: "center", gap: "20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>32</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Individual signals Content Trace analyzes per submission</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Across 8 weighted sections — from cognitive fingerprinting (16%) to statistical proxies (8%).</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Free · Always</div>
          </div>

          <h2 style={h2s}>The two approaches — and why most tools use the wrong one</h2>

          <p style={p}>There are two ways to detect AI text. The first is statistical: measure properties of the writing itself — how predictable the word choices are, how uniform the sentence lengths run, how much vocabulary varies. These signals emerge from how language models work at a mechanical level. LLMs generate text by picking statistically likely continuations at each step. That process leaves fingerprints.</p>

          <p style={p}>The second approach is behavioral: look for the presence or absence of things that human writers do naturally. Do opinions shift mid-argument? Are there specific details that feel autobiographical rather than illustrative? Does the writer seem to be figuring something out, or delivering a pre-formed answer?</p>

          <p style={p}>Most commercial detectors lean almost entirely on the statistical approach because it's faster to compute and easier to explain. That's a mistake, in my view — though I came to this conclusion slowly, because the statistical signals are real. The problem is they're the easiest to game. Humans who write in structured styles (academics, lawyers, technical writers) score badly on them. AI text that's been lightly paraphrased can dodge them entirely. Behavioral signals are harder to fake because they're rooted in something AI genuinely doesn't do: think while writing.</p>

          <h2 style={h2s}>What perplexity actually measures — and where it breaks down</h2>

          <p style={p}>Perplexity is the signal everyone in this space talks about. The concept is straightforward: given what came before in a sentence, how surprising is the next word? Language models assign probabilities to every possible next token. Low perplexity means the text was predictable. High perplexity means the writing was full of unexpected choices.</p>

          <p style={p}>Human writers have higher perplexity. Not because we're trying to be unpredictable, but because we're not optimizing for statistical safety. We use the weird word that fits better. We reference something specific that shifts the expected trajectory of the paragraph. These aren't conscious choices — they're just what happens when a real person's mind is engaged in putting thought into language.</p>

          <h3 style={h3s}>The model-dependency problem nobody mentions</h3>

          <p style={p}>Here's the catch that took me a while to really internalize: perplexity is measured relative to a specific model. A sentence that's low-perplexity to GPT-4 might be high-perplexity to a smaller model. This means detector accuracy depends heavily on which model the detector was calibrated against, and as frontier models improve, older detectors become less reliable against new AI output. Most detector companies don't acknowledge this publicly.</p>

          <p style={p}>This is also why burstiness — the variance in sentence length and complexity across a text — tends to be a more durable signal than raw perplexity. Burstiness doesn't depend on any particular model; it's a property of the text itself. Human writing is naturally bursty. AI writing is unnaturally smooth. That pattern holds even as the underlying models evolve.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--accent)", background: "var(--accent-light)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              "Burstiness — the unpredictable swing between short and long sentences — is one of the hardest things for AI to fake, even intentionally."
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Statistical Proxies Signal</cite>
          </div>

          <h2 style={h2s}>The behavioral signals that actually matter</h2>

          <p style={p}>Here's what I find genuinely interesting about behavioral detection: the signals aren't arbitrary. They reflect something real about how human cognition shows up in writing — patterns that emerge from having a mind actively working through a problem.</p>

          <h3 style={h3s}>Opinion drift and self-correction</h3>

          <p style={p}>When a human writer works through an argument, their thinking often changes in motion. They start a paragraph committed to one position and end it somewhere slightly different, because writing clarified something they hadn't noticed. Sometimes they catch themselves. Sometimes they just let the drift stand — because it's honest.</p>

          <p style={p}>AI doesn't do this. The model commits to a conclusion before the first word is produced and executes toward it. The result is writing that's technically logical but lacks the texture of actual thought. No moment where the writer surprised themselves. No awkward pivot.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>Cognitive Fingerprinting · 16% weight</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Opinion Drift</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>Human writers change their minds mid-paragraph. AI writing stays exactly on plan from first word to last.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(196,51,2,0.1)", color: "#c43302", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>AI</span>
                <span style={{ color: "var(--text-secondary)" }}>"There are several key benefits to using AI writing tools. They save time, improve consistency, and help teams scale content output efficiently."</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(10,115,115,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Human</span>
                <span style={{ color: "var(--text-secondary)" }}>"The time savings are real — I've seen that firsthand. The consistency argument I'm less sure about. Consistent mediocrity isn't the goal, and I think that's worth saying out loud."</span>
              </div>
            </div>
          </div>

          <h3 style={h3s}>Specificity that feels accidentally true</h3>

          <p style={p}>Human writers reach for concrete details — a particular number, a specific place, a named person. These specifics serve two functions: they make the writing credible, and they make it personal. AI reaches for illustrative generalities because it has no real experiences to draw from. It can invent specifics, but invented specifics have a different texture — too clean, too perfectly illustrative. Real specifics are slightly awkward. That imperfect fit is part of what makes them feel true.</p>

          <p style={p}>You can run any piece of writing through <a href="https://contenttrace.ai" style={{ color: "var(--accent)", textDecoration: "underline" }}>Content Trace</a> to see how it scores on specificity, opinion drift, and all the other behavioral signals — free, no account required. It won't give you a verdict. It'll give you a breakdown, which is more useful.</p>

          <h2 style={h2s}>Why no detector is 100% — and why that's okay</h2>

          <p style={p}>I want to push back on something I see constantly: the framing that AI detectors are only useful if they're perfect. That's not how we evaluate any other diagnostic tool.</p>

          <p style={p}>A radiologist reading an X-ray isn't right 100% of the time. A fraud detection system isn't right 100% of the time. The question is whether the signal is better than chance, whether the error patterns are systematic in ways you can account for, and whether the tool is honest about its limitations. Good AI detectors can meet that bar — but only if they show their work instead of collapsing everything into a single number that implies certainty it doesn't have.</p>

          {/* Before/After */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", background: "var(--bg-card)", margin: "32px 0" }}>
            <div style={{ padding: "10px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Word Choice & Phrasing · Signal comparison
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "14px 18px", background: "rgba(196,51,2,0.03)", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#c43302", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>AI phrasing</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 10px" }}>"It's worth noting that perplexity is an important metric that can be leveraged to comprehensively assess the statistical properties of AI-generated content."</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ flex: 1, height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}><div style={{ width: "14%", height: "100%", background: "#c43302", borderRadius: "3px" }}></div></div>
                  <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "#c43302" }}>14</span>
                </div>
              </div>
              <div style={{ padding: "14px 18px", background: "rgba(10,115,115,0.03)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>Human phrasing</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 10px" }}>"Perplexity tells you how surprised the model was by each word. Low surprise usually means AI wrote it. That's the whole idea — though it breaks down faster than most detector companies admit."</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ flex: 1, height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}><div style={{ width: "81%", height: "100%", background: "var(--accent)", borderRadius: "3px" }}></div></div>
                  <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent)" }}>81</span>
                </div>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Frequently asked questions</h2>

          {[
            { q: "Can AI detectors be fooled by paraphrasing?", a: "Yes — statistical signals like perplexity can be weakened significantly by paraphrasing AI output. Behavioral signals are more robust, but heavy human editing of AI content does make it genuinely harder to catch. That's an honest limitation." },
            { q: "Why do detectors sometimes flag human writing as AI?", a: "Highly structured human writing — academic papers, legal documents, technical documentation — often scores low on statistical signals because it's deliberately formal and predictable. It's a false positive. This is one reason signal-level breakdowns are more useful than single scores." },
            { q: "Does text length affect accuracy?", a: "Significantly. Short texts under 100 words don't provide enough data points to establish reliable patterns. Content Trace flags confidence as Low on short texts for this exact reason." },
            { q: "What makes Content Trace different from GPTZero or Originality.ai?", a: "Most detectors give you a single score with little explanation. Content Trace breaks the analysis into 32 signals across 8 sections so you can see exactly which patterns triggered the result and form your own judgment." },
            { q: "Will AI detectors become obsolete as models improve?", a: "Statistical detectors will erode as models get better at mimicking surface-level human patterns. Behavioral detectors are more durable because they look for cognitive patterns — things that require actually thinking while writing — that models don't yet replicate reliably." },
          ].map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>If you want to go deeper on what separates AI and human writing at a linguistic level, <a href="/blog/why-ai-writing-sounds-different" style={{ color: "var(--accent)", textDecoration: "underline" }}>Why AI Writing Sounds Different</a> gets into the specific patterns that trained readers pick up on intuitively. And if you're working with AI drafts and want to make them publishable, <a href="/blog/how-to-humanize-ai-content" style={{ color: "var(--accent)", textDecoration: "underline" }}>How to Humanize AI Content</a> is the practical side of everything covered here.</p>

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>Want to see these 32 signals in action on your own content?</div>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(10,115,115,0.25)" }}>
            Try Content Trace free →
          </a>
        </div>
      </main>
    </>
  );
}
