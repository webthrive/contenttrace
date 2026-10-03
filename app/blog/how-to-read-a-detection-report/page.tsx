import Nav from "@/components/Nav";
import type { Metadata } from "next";

const SITE_URL = "https://www.contenttrace.ai";
const SLUG = "how-to-read-a-detection-report";

export const metadata: Metadata = {
  title: "How to Read a Detection Report: Making Sense of Your Score",
  description: "A single percentage tells you almost nothing useful. Here's how to read AI detection results in a way that actually helps you improve your content.",
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: "How to Read a Detection Report | Content Trace",
    description: "A single percentage tells you almost nothing useful. Here's how to read AI detection results in a way that actually helps you improve your content.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
  },
  robots: { index: true, follow: true },
};

export default function PostHowToReadADetectionReport() {
  const p: React.CSSProperties = { marginBottom: "20px" };
  const h2s: React.CSSProperties = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s: React.CSSProperties = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };

  return (
    <><Nav current="/blog" />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "#c43302", background: "rgba(196,51,2,0.08)", border: "1px solid rgba(196,51,2,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Guide</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>How to Read a Detection Report: Making Sense of Your Score</h1>
        <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "32px" }}>April 26, 2026 · 8 min read · By <a href="https://www.webthrive.io/home/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Colin</a></div>

        <div style={{ background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "10px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "The aggregate score is a summary — it compresses information in ways that hide what's actually going on. Always look at the category breakdown.",
              "High behavioral scores with low statistical scores mean the text has been edited or paraphrased but lacks human cognitive markers. That's your editing target.",
              "High statistical scores with low behavioral scores are unusual and worth investigating — it often means very structured human writing (legal, academic) that pattern-matches to AI.",
              "Scores in the 35–65% range are often more informative than 90%+ scores. Mixed signals tell a story about what's human and what isn't.",
              "The useful question is never 'is this AI?' — it's 'which parts of this content are missing human thinking, and where?'",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>Most people who run text through an AI detector look at the number and form an opinion based on whether it&apos;s above or below some threshold they have in their head. Above 70%: probably AI. Below 30%: probably human. 50%: unclear, move on.</p>

          <p style={p}>That&apos;s a reasonable instinct and it&apos;s wrong in a useful way — wrong in the sense that the aggregate score is a significant compression of much more specific information, and acting on the aggregate alone means missing most of what the detection actually found.</p>

          <p style={p}>I built Content Trace partly because I wanted a detection tool that showed its work — that gave you the category breakdown rather than just the number. But even with a breakdown available, I see people default to the aggregate. This post is an attempt to explain what you&apos;re actually looking at when you run a detection, and how to use the results in a way that&apos;s actually useful.</p>

          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
              <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>8</div>
              <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
              <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Weighted categories in Content Trace&apos;s analysis</strong>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Each category tells a different story. Cognitive fingerprinting (16%) and structural patterns (12%) are the hardest signals to fake.</p>
              </div>
              <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Free · Always</div>
            </div>
          </a>

          <h2 style={h2s}>The two families of signal — and why they diverge</h2>

          <p style={p}>Detection signals break into two broad families: statistical and behavioral. Understanding what each measures is essential to reading what a score is telling you.</p>

          <p style={p}>Statistical signals measure properties of the text itself — word predictability (perplexity), sentence length variation (burstiness), vocabulary range, and similar surface features. These signals emerge from how language models generate text mechanically: by choosing statistically likely continuations at each step, they produce output that&apos;s measurably more uniform than human writing in certain ways.</p>

          <p style={p}>Behavioral signals measure the presence or absence of things that humans do when they write — opinion drift across a piece, self-corrections and caveats, specific authentic detail that doesn&apos;t fully serve the argument, the kind of structural discovery that happens when someone is actually working something out rather than delivering a pre-formed answer.</p>

          <p style={p}>The critical insight is that these two families respond differently to editing and post-processing. Statistical signals change when text is paraphrased or restructured. Behavioral signals don&apos;t — they&apos;re properties of the underlying thinking, not the surface text. When you see a big gap between these two families in a detection result, it&apos;s telling you something specific about what happened to the content.</p>

          <h2 style={h2s}>Reading the patterns — what different score profiles mean</h2>

          <h3 style={h3s}>High behavioral, low statistical</h3>

          <p style={p}>This is the most common pattern for content that was AI-generated and then processed through a paraphrasing tool. The statistical surface has been disrupted — word choices are more varied, sentence lengths less uniform — but the behavioral markers didn&apos;t move because they&apos;re not in the text surface. The opinions are still uniformly consistent. There&apos;s still no self-correction. The examples are still constructed rather than remembered.</p>

          <p style={p}>If you&apos;re editing content and see this pattern, the paraphrasing is done. That&apos;s not your problem anymore. Your problem is everything in the behavioral categories, and the fix is actual editorial work: adding a genuine position, a real sourced claim, a detail from experience. Adding more paraphrasing will do nothing useful.</p>

          <h3 style={h3s}>High statistical, low behavioral</h3>

          <p style={p}>This pattern is less common and more interesting. Statistically the text looks like AI — low perplexity, high uniformity — but behaviorally it looks human. This typically means one of three things: very structured human writing in a formal register (legal documents, academic papers, technical documentation), a human writer who happens to write in a particularly uniform style, or AI output that had genuine human knowledge injected into it without restructuring the surface text.</p>

          <p style={p}>Structured human writing flags this way because academic and legal register is deliberately uniform — precise vocabulary is a feature, varied sentence length is a bug. If you&apos;re running that kind of content through detection, a high statistical score is expected and shouldn&apos;t be alarming. The behavioral signals will tell you whether there&apos;s genuine thinking in the content, which matters more.</p>

          <h3 style={h3s}>Both high — close to pure AI</h3>

          <p style={p}>When both categories score high, the content is very likely largely unedited AI output. The statistical patterns of language model generation are present and the behavioral signals of human cognition are absent. This is the profile of a piece that went from prompt to publish with minimal intervention.</p>

          <p style={p}>The specific categories worth looking at here: cognitive fingerprinting (authentic specificity, self-correction), opinion and perspective (is there a genuine take anywhere in the piece?), and structural patterns (does the argument develop or just get delivered?). These three categories carry the most weight and are the most actionable.</p>

          <h3 style={h3s}>Both low — genuinely human or heavily edited</h3>

          <p style={p}>Low scores across both families mean either genuinely human writing or content where substantial human editing added both surface variation and cognitive depth. This is the target profile for AI-assisted content — not necessarily zero statistical AI signal, but low enough on both dimensions that the human contribution is clearly dominant.</p>

          <p style={p}>It&apos;s worth noting that both-low doesn&apos;t mean &quot;definitely human.&quot; A skilled writer who produces very human-sounding AI content, or AI output that went through extensive genuine editing, can land here too. Detection is probabilistic at every score. The question is always what&apos;s more likely given the full profile.</p>

          <h2 style={h2s}>The middle range — where the interesting stuff lives</h2>

          <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "24px 0" }}>
            <div style={{ padding: "12px 18px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>Score Interpretation</div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "2px" }}>What different aggregate ranges typically mean</div>
            </div>
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { range: "85–100%", label: "Very likely AI or minimally edited", color: "#ff6b6b" },
                { range: "65–84%", label: "Probably AI with some editing; behavioral signals elevated", color: "#f0a030" },
                { range: "35–64%", label: "Mixed — examine category breakdown closely", color: "#c47a00" },
                { range: "15–34%", label: "Probably human or heavily edited AI", color: "#5fad8a" },
                { range: "0–14%", label: "Very likely human writing", color: "var(--accent)" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "baseline", fontSize: "14px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: row.color, flexShrink: 0, minWidth: "80px" }}>{row.range}</span>
                  <span style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={p}>Scores in the 35–65% range are often where the most useful information lives. A 90% score is straightforward — the content is probably mostly AI. A 50% score with high behavioral and low statistical signals tells you something much more specific: the text has been edited but the editing didn&apos;t add human thinking. That&apos;s a precise diagnosis with a precise fix.</p>

          <h2 style={h2s}>The right question to bring to a detection result</h2>

          <p style={p}>The question &quot;is this AI?&quot; is rarely the useful one. It&apos;s a binary framing for a probabilistic measurement, and acting on it tends to produce either false confidence (low score = fine) or false alarm (high score = discard).</p>

          <p style={p}>The question I&apos;d recommend instead: which categories in this result are high, and what would it take to move them? High cognitive fingerprinting means add authentic specificity — a real example, a sourced detail, something from memory. High opinion uniformity means add a genuine take — a position that could be wrong, that someone with knowledge of the topic might disagree with. High structural pattern score means the argument was delivered rather than developed — add the working-through, the caveat, the discovery.</p>

          <p style={p}>Detection used this way is an editing tool. Not a judgment on whether the content is acceptable, but a map of where the human contribution is thin and where more editorial work would improve it. That&apos;s the frame that makes detection results actionable — and it&apos;s a more honest account of what they actually measure.</p>

        </div>
      </main>
    </>
  );
}
