import Nav from "@/components/Nav";
import type { Metadata } from "next";

const SITE_URL = "https://www.telltaleproof.com";
const SLUG = "how-ai-text-detection-works";

export const metadata: Metadata = {
  title: "How AI Text Detection Actually Works",
  description: "Most AI detectors feel like a black box — you paste text and get a number. Here's what's actually happening under the hood, and why some approaches are more reliable than others.",
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: "How AI Text Detection Actually Works | Telltale Proof",
    description: "What's actually happening when an AI detector analyzes your text — and why some approaches are more reliable than others.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Telltale Proof",
    type: "article",
  },
  robots: { index: true, follow: true },
};

export default function Article1() {
  return (
    <><Nav current="/blog" />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>
      
      <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "#0a7373", background: "rgba(10,115,115,0.08)", border: "1px solid rgba(10,115,115,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
      <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>How AI Text Detection Actually Works</h1>
      <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "40px" }}>March 10, 2026 · 6 min read · By <a href="https://www.webthrive.io/home/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Colin</a></div>

      <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

        <p style={{ marginBottom: "20px" }}>I'll be honest — when I first started looking into AI detection, I assumed it was basically magic. You paste text, the algorithm does something opaque, a number comes out. I didn't question it too hard because the numbers seemed roughly right. Then I actually dug into how these tools work, and I came away with a much more complicated opinion.</p>

        <p style={{ marginBottom: "20px" }}>The short version: AI detection is real, it works better than chance, and anyone who tells you it's either foolproof or useless is oversimplifying. The longer version is more interesting.</p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "36px 0 14px", letterSpacing: "-0.01em" }}>The two approaches — and why most tools use the wrong one</h2>

        <p style={{ marginBottom: "20px" }}>There are two ways to detect AI text. The first is statistical: measure properties of the writing — how predictable the word choices are, how uniform the sentence lengths, how much the vocabulary varies. These signals come from how language models work at a mechanical level. LLMs generate text by picking statistically likely continuations. That leaves fingerprints.</p>

        <p style={{ marginBottom: "20px" }}>The second approach is behavioral: look for the presence or absence of things that human writers do naturally. Do opinions shift mid-argument? Are there specific details that couldn't have been invented? Does the writer seem to be figuring something out, or just delivering a pre-formed answer?</p>

        <p style={{ marginBottom: "20px" }}>Most commercial detectors lean almost entirely on the statistical approach because it's easier to quantify and faster to compute. That's a mistake, in my view. Statistical signals are real, but they're also the easiest to game — either accidentally, by humans who write in structured styles, or deliberately, by prompting models to be less predictable. Behavioral signals are harder to fake. They're also harder to measure, which is why most tools don't bother.</p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "36px 0 14px", letterSpacing: "-0.01em" }}>What perplexity actually measures</h2>

        <p style={{ marginBottom: "20px" }}>Perplexity is the signal everyone in this space talks about. The concept is straightforward: given what came before in a sentence, how surprising is the next word? Language models assign probabilities to every possible next token. Low perplexity means the text was predictable — each word followed naturally from the last. High perplexity means the text was full of unexpected choices.</p>

        <p style={{ marginBottom: "20px" }}>Human writers have higher perplexity. Not because we're trying to be unpredictable, but because we're not optimizing for statistical safety. We use the weird word that fits better. We start a sentence in an unusual place. We reference something specific that shifts the expected trajectory of the paragraph.</p>

        <p style={{ marginBottom: "20px" }}>The catch — and this took me a while to really internalize — is that perplexity is measured relative to a specific model. A sentence that's low-perplexity to GPT-4 might be high-perplexity to a smaller model. This means detector accuracy depends heavily on which model it's calibrated against, and as models improve, older detectors become less reliable. It's a moving target.</p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "36px 0 14px", letterSpacing: "-0.01em" }}>The behavioral signals that actually matter</h2>

        <p style={{ marginBottom: "20px" }}>Here's what I find genuinely interesting about behavioral detection: the signals aren't arbitrary. They reflect something real about how human cognition shows up in writing.</p>

        <p style={{ marginBottom: "20px" }}>Take opinion drift. When a human writer works through an argument, their thinking often changes in motion. They start a paragraph committed to one position and end it somewhere slightly different, because the act of writing clarified something. AI doesn't do this. It commits to a conclusion before the first word and executes toward it. The result is writing that's technically logical but lacks the texture of actual thought.</p>

        <p style={{ marginBottom: "20px" }}>Or take specificity. Human writers reach for concrete details — a particular number, a specific place, a named person — in ways that feel autobiographical rather than illustrative. AI reaches for illustrative details, which are subtly different. They serve the point without anchoring it to reality.</p>

        <p style={{ marginBottom: "20px" }}>These are the signals Telltale Proof weighs most heavily, and honestly, they're the ones I trust most. They're harder to fake, harder to prompt away, and more directly connected to whether an actual mind was engaged in the writing.</p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "36px 0 14px", letterSpacing: "-0.01em" }}>Why no detector is 100% — and why that's okay</h2>

        <p style={{ marginBottom: "20px" }}>I want to push back on something I see a lot in coverage of AI detection: the framing that detectors are only useful if they're perfect. That's not how we evaluate any other diagnostic tool.</p>

        <p style={{ marginBottom: "20px" }}>A doctor reading an X-ray isn't right 100% of the time. A fraud detection algorithm isn't right 100% of the time. The question is whether the signal is better than chance, whether the errors are systematic in ways you can account for, and whether the tool is honest about its limitations. Good AI detectors can absolutely meet that bar — if they explain their reasoning instead of hiding behind a single score.</p>

        <p style={{ marginBottom: "20px" }}>That's the philosophy behind Telltale Proof. Not "here's your verdict," but "here are 32 signals, here's what each one found, make your own judgment." I think that's a more honest way to do this — and ultimately more useful than false confidence in either direction.</p>

      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
        <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>Want to see these signals in action?</div>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(10,115,115,0.25)" }}>
          Try Telltale Proof free →
        </a>
      </div>
    </main>
    </>
  );
}
