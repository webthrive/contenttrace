import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "how-to-read-a-detection-report";
const TITLE = "How to Read a Detection Report: Treat the Score as an Editing Map";
const DESCRIPTION = "A single score says almost nothing useful. Read the section breakdown instead, and a writing report becomes a precise map of what to edit next.";
const HERO = `/blog/${SLUG}/hero.webp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "The headline number is a summary. The section breakdown is the diagnosis. Here is how to read a report and turn it into edits.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-04-26",
    modifiedTime: "2026-10-07",
    authors: ["Colin H"],
    images: [{ url: HERO, width: 1600, height: 900, alt: "A writing report where one overall score sits above section bars, and the lowest bar is marked as the next edit" }],
  },
  twitter: { card: "summary_large_image", images: [HERO] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "What does the overall score in a detection report mean?", a: "It's a summary of many separate signals, compressed into one number. It tells you roughly how human the writing reads overall. It can't tell you what to fix, and it can't prove who wrote the text. For that, read the section breakdown." },
  { q: "Is a low score proof that AI wrote the text?", a: "No. No tool can be certain, and detectors have a documented record of false positives. OpenAI withdrew its own classifier in 2023 for low accuracy, and a Stanford study found popular detectors flagged most essays by non-native English writers as AI-generated. Treat a low score as a reason to edit, never as a verdict on a person." },
  { q: "Which part of the report should you read first?", a: "Read the lowest section first, then the signal notes inside it. The lowest section points to the biggest gap between the draft and writing that reads as human. Fixing it usually moves the overall score more than polishing sections that are already strong." },
  { q: "Why did a paraphrased draft still score low?", a: "Paraphrasing changes the surface of the text: word choice and sentence shape. It doesn't add a position, a real example or any visible thinking. Sections that measure voice, logic and reasoning stay low until someone adds those things." },
  { q: "Why do formal documents sometimes score low even when a person wrote them?", a: "Formal writing is deliberately uniform and impersonal, so it shares surface traits with AI drafts. Content Trace adjusts for content type, but very formal human writing can still read as machine-like. That's one more reason the score is a diagnostic and not a judgment." },
  { q: "How should you use an AI content report after editing?", a: "Score the draft, fix the lowest section, then score again and compare section by section. If the section you worked on didn't move, the edit stayed on the surface. If it moved and the overall score barely changed, look at the next lowest section." },
];

export default function PostHowToReadADetectionReport() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };
  const a = { color: "var(--accent)", textDecoration: "underline" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-04-26" dateModified="2026-10-07" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Guide</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="April 26, 2026" readTime="8 min read" updated="October 7, 2026" />

        <BlogHero src={HERO} alt="A dark writing report with one overall score above a set of section bars, where the lowest bar is marked in coral as the next edit to make." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "The overall score is a summary that hides most of what the analysis found. The section breakdown is where the useful information lives.",
              "A score is a diagnostic for editing. It is never proof of who wrote something, and treating it as a verdict hurts real writers.",
              "Surface sections (structure, word choice) and thinking sections (voice, logic, reasoning) respond to different edits. A gap between them tells you which edit is missing.",
              "A middling score with a lopsided breakdown is often the most useful report you can get, because it points to one precise fix.",
              "The right question is never \"is this AI?\" It's \"which sections are low, and what would move them?\"",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>In 2023, OpenAI released a classifier meant to flag AI-written text. On its own challenge set, it correctly identified 26% of AI-written text and wrongly labeled human writing as AI 9% of the time. On July 20, 2023, OpenAI pulled it, citing &quot;its low rate of accuracy.&quot; The company behind ChatGPT couldn&apos;t make a single number trustworthy enough to act on.</p>

          <p style={p}>That history matters for anyone reading a report today. Most people still look at the headline number and decide based on a threshold in their head. High, fine. Low, rewrite it or worse, accuse someone. Somewhere in the middle, shrug and move on.</p>

          <p style={p}>That instinct is understandable and wrong in a useful way. The overall score compresses a lot of specific information into one figure, and acting on the figure alone means ignoring most of what the analysis found. Content Trace was built to show its work: it explains every score with 32 signals in 8 sections. Even so, plenty of people read the big number and stop. This guide covers what the rest of the report says and how to turn it into edits.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>8</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Sections in every Content Trace report, each pointing to a different edit</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>32 signals in total. The lowest section is almost always the best place to start.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Guide</div>
          </div>
          </a>

          <h2 style={h2s}>Why the headline number is the least useful part</h2>

          <p style={p}>A score is a probability-flavored summary. It answers a vague question (&quot;how human does this read overall?&quot;) and hides the specific ones. Two drafts can land on the same number for completely different reasons: one is polished but says nothing, the other has real ideas buried in clumsy sentences. They need opposite edits.</p>

          <p style={p}>The number also can&apos;t carry the weight people put on it. No tool can be certain about authorship. A 2023 Stanford study by Weixin Liang and colleagues tested seven popular GPT detectors on essays written by non-native English speakers for the TOEFL exam. The detectors misclassified more than half of them as AI-generated, with an average false positive rate of 61.22%. Those essays were written by people. A score used as a verdict would have punished every one of them.</p>

          <p style={p}>So read the score the way a doctor reads a temperature. It says something is going on. It doesn&apos;t say what.</p>

          <h2 style={h2s}>Surface sections and thinking sections</h2>

          <p style={p}>The 8 sections in a Content Trace report fall into two rough families, and knowing which is which is most of the skill.</p>

          <p style={p}>Surface sections describe the shape of the text. Structure & Flow looks at sentence and paragraph rhythm. Word Choice & Phrasing looks at filler phrases, hedging, contractions and generic wording. These change quickly when you edit sentences.</p>

          <p style={p}>Thinking sections describe what&apos;s underneath. Voice & Perspective asks whether the piece takes a position. Content & Logic looks for depth, insider knowledge and surprising observations. Cognitive Fingerprinting looks for visible reasoning, such as a writer changing their mind mid-argument. Emotional Texture and Pragmatics & Subtext look for real feeling, irony and implication. None of these move when you swap words. They move when someone adds thinking.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="The eight report sections split into two groups: surface sections that change with sentence edits, and thinking sections that change only when real ideas, positions and examples are added." caption="Sentence edits move the surface sections. Only new thinking moves the rest." />

          <p style={p}>The eighth section, Statistical Proxies, measures things like vocabulary richness and burstiness in code. Older detectors leaned hard on measures like these. In later internal ContentTrace testing, burstiness separated human from AI text no better than chance, so those numbers are now shown for reference only and carry no weight in the score.</p>

          <h2 style={h2s}>Four report profiles and what each one means</h2>

          <h3 style={h3s}>Strong surface, weak thinking</h3>

          <p style={p}>This is the most common profile for an AI draft that has been polished or run through a paraphrasing tool. The sentences vary, the filler is gone, the rhythm is fine. But the opinions are still evenly balanced, there&apos;s no self-correction, and the examples are still constructed rather than remembered.</p>

          <p style={p}>If you see this, the sentence work is done. That isn&apos;t the problem anymore. The fix is editorial: add a real position, a sourced claim, a detail from experience. Another pass of word swaps will do nothing, except make the report look exactly the same with fresher synonyms.</p>

          <h3 style={h3s}>Weak surface, strong thinking</h3>

          <p style={p}>Less common and more interesting. The structure looks machine-like (uniform sentences, formal register) but the voice and logic sections read as human. This usually means formal human writing, like legal, academic or technical documents, where uniformity is a feature. It can also mean a rough human draft with good ideas and stiff sentences.</p>

          <p style={p}>Content Trace adjusts for content type, but very formal writing can still read as uniform. If that&apos;s your genre, a weaker surface reading is expected and shouldn&apos;t alarm anyone. The thinking sections tell you whether there&apos;s real substance, and that matters more.</p>

          <h3 style={h3s}>Weak on both</h3>

          <p style={p}>When both families are low, the text is very likely close to a raw AI draft that went from prompt to page with little intervention. Start with the thinking sections, because surface edits on a piece with nothing to say just produce a smoother piece with nothing to say.</p>

          <h3 style={h3s}>Strong on both</h3>

          <p style={p}>This is the target for AI-assisted work: the human contribution is clearly dominant, in the sentences and in the ideas. Strong on both still doesn&apos;t mean &quot;definitely human.&quot; A heavily edited AI draft can land here, and that&apos;s fine. The report measures how the writing reads, and writing that reads this way is doing its job for readers.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Cognitive Fingerprinting</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Opinion Drift / Self-Correction</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>This signal is usually the last thing to move in a polished AI draft, because paraphrasing never adds a change of mind. (Example lines are hypothetical.)</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Before</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Shorter onboarding emails generally improve activation rates across most user segments.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>After</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Shorter onboarding emails should win. They didn&apos;t for admins, who wanted the setup steps in one place. So the answer depends on who&apos;s reading.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>The middle range is where the useful reports live</h2>

          <p style={p}>A very high or very low score is easy to read and rarely surprising. A score in the middle with a lopsided breakdown is the report worth studying. It says the draft is half there, and it says which half is missing.</p>

          <p style={p}>The obvious response to a middling score is to rewrite the whole piece. It doesn&apos;t work, because a full rewrite usually repeats the same habits that produced the first draft, and the weak section stays weak. A targeted edit on the lowest section, followed by a rescore, tells you far more. If that section moves, the edit worked. If it doesn&apos;t, the edit stayed on the surface.</p>

          <Figure src={`/blog/${SLUG}/inline-2.webp`} alt="A table that maps four low report sections to the edit that fixes each one: Voice and Perspective needs a real position, Content and Logic needs a real example, Cognitive Fingerprinting needs visible reasoning, Word Choice needs filler cut." caption="Each low section points to one kind of edit. Make it, then score again." />

          <h2 style={h2s}>The right question to bring to a report</h2>

          <p style={p}>&quot;Is this AI?&quot; is almost never the useful question. It&apos;s a yes-or-no frame for a measurement that isn&apos;t yes-or-no, and it produces false comfort (good score, ship it) or false alarm (bad score, bin it). Neither helps the reader who will eventually see the piece.</p>

          <p style={p}>The better question: which sections are low, and what would move them? Low Voice & Perspective means the piece needs a position someone could disagree with. Low Content & Logic means it needs a real example, a sourced number or a detail only an insider would know. Low Cognitive Fingerprinting means the argument was delivered rather than worked out, so add the caveat, the doubt, the moment the thinking changed.</p>

          <p style={p}>There&apos;s a specific sting the first time a writer runs something they wrote entirely themselves and gets a middling score. It feels like being accused by a spreadsheet. Then they open the breakdown, see that Voice & Perspective is low because the piece never actually commits to anything, and the sting turns into something closer to recognition. The report was right about the writing. It just had nothing to say about the writer, and it was never supposed to.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;Read the score the way a doctor reads a temperature. It says something is going on. It doesn&apos;t say what.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Cognitive Fingerprinting Signal</cite>
          </div>

          <p style={p}>Used this way, a report is an editing tool. It isn&apos;t a ruling on whether content is acceptable or on who made it. It&apos;s a map of where the human contribution is thin and where the next hour of editing will pay off. That&apos;s also what Google&apos;s guidance on helpful content rewards: original information, real analysis and first-hand expertise, however the first draft got written. Reading the <a href="/" style={a}>Content Trace</a> breakdown is simply a faster way to find where those things are missing.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a: ans }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{ans}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>If scores move around between runs, <a href="/blog/why-your-ai-detector-score-keeps-changing" style={a}>Why Your AI Detector Score Keeps Changing</a> explains why. <a href="/blog/how-to-humanize-ai-content" style={a}>How to Humanize AI Content</a> turns each low section into an editing pass, <a href="/blog/the-specificity-test" style={a}>The Specificity Test</a> goes deep on the Content &amp; Logic fix, and <a href="/blog/ai-content-policies-at-work" style={a}>AI Writing Policies at Work</a> covers how teams use reports inside a review step.</p>

          <Sources items={[
            { label: "OpenAI: New AI classifier for indicating AI-written text (with July 2023 discontinuation note)", href: "https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/" },
            { label: "Liang et al. (2023), GPT detectors are biased against non-native English writers", href: "https://arxiv.org/abs/2304.02819" },
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See which section of your draft needs the next edit.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
