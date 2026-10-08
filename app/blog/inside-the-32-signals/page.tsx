import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "inside-the-32-signals";
const TITLE = "Inside the 32 Signals: How ContentTrace Reads a Draft";
const DESCRIPTION = "How ContentTrace scores a draft: Claude as an editor with a fixed rubric at temperature 0, 8 sections, content types and calibration. The full method.";
const HERO = `/blog/${SLUG}/hero.webp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "The method behind the Human Score: an LLM editor with a fixed rubric, code metrics shown for reference, content types and calibration.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-10-03",
    modifiedTime: "2026-10-03",
    authors: ["Colin H"],
    images: [{ url: HERO, width: 1600, height: 900, alt: "A lens over generic AI filler text turns several key factors into 32 signals, each with two notes" }],
  },
  twitter: { card: "summary_large_image", images: [HERO] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "Is ContentTrace a trained AI detector?", a: "No. It's a rubric applied by Claude acting as an editor, plus a few code metrics and a calibration step. Nothing is trained on your text and nothing learns from it. The score is a guide for editing, not a verdict on who wrote the piece." },
  { q: "Why does the same draft get the same score twice?", a: "The judging calls run at temperature 0 with a fixed rubric, so the model has almost no room to wander. Anthropic's own docs note that temperature 0 still isn't fully deterministic, which is why a repeat run can land a point or so away instead of on the exact same number." },
  { q: "What are the two observations under each signal?", a: "Every signal gets a score from 0 to 10 and two short notes that point at the text: a phrase, a pattern, a paragraph. They're the most useful part of the report, because they tell you where to edit instead of just how much." },
  { q: "Do the Statistical Proxies affect the Human Score?", a: "No. Vocabulary Richness, Burstiness Approximation, Response Calibration and Entropy Variance are measured in code and shown for reference. They carry no weight in the score." },
  { q: "Why did a signal show as N/A?", a: "The content type decided it doesn't fit the genre. A company blog post, for example, isn't expected to carry personal anecdotes or vulnerability, so those signals are left out of the score instead of counted against the text." },
  { q: "How should AI content be edited using the 32 signals?", a: "Start with the lowest section, read its observations, and fix the exact passages they point to. Then score again. Chasing the overall number tends to produce cosmetic edits. Fixing the weakest section produces real ones." },
];

export default function InsideThe32Signals() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-10-03" dateModified="2026-10-03" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="October 3, 2026" readTime="8 min read" />

        <BlogHero src={HERO} alt="A lens over dim, generic AI-style text strikes out the phrase several key factors and replaces it with 32 signals, each with two notes." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "ContentTrace reads a draft the way a strict editor would: Claude applies a fixed rubric to seven sections in parallel calls, at temperature 0.",
              "Every signal gets a score from 0 to 10 plus two short observations that point to the exact text behind the score.",
              "The eighth section, Statistical Proxies, is measured in code and shown for reference only. It carries no weight in the Human Score.",
              "Ten content types change the section weights and mark signals that don't fit the genre as N/A, so a white paper isn't punished for lacking a personal story.",
              "Calibration maps the raw score so typical AI text lands near 25 and typical human text near 75, capped between 2 and 98.",
              "The observations are worth more than the number. Edit what they point to, then score again.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>Paste a draft into ContentTrace and seven requests leave at the same moment. Each one carries the full text and a single section of a fixed rubric. A few seconds later, seven sets of scores come back, each signal with two short notes attached, and code adds a handful of measurements on the side. The Human Score at the top of the report is the last thing computed, and the least interesting.</p>

          <p style={p}>That ordering is deliberate. Since the scoring engine was rebuilt on September 30, 2026, the method has been simple to describe and slightly unusual: a language model acting as an editor, a rubric it can&apos;t improvise around, and a calibration step that turns raw marks into a number people can read. No secret classifier. No model trained on your writing.</p>

          <p style={p}>This post walks through each piece, because a score you can&apos;t inspect is a score you shouldn&apos;t trust.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>32</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Signals in 8 sections explain every ContentTrace result</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>28 are judged against a rubric. 4 are measured in code and shown for reference.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Explainer</div>
          </div>
          </a>

          <h2 style={h2s}>An editor with a fixed rubric</h2>

          <p style={p}>The core of the engine is what researchers call LLM-as-a-judge. Claude, Anthropic&apos;s model, reads the draft as an editor and scores it against written criteria. The approach has a real research base. In the MT-Bench and Chatbot Arena study, Lianmin Zheng and colleagues found that strong model judges reached over 80% agreement with human preferences, about the same rate at which humans agree with each other.</p>

          <p style={p}>The same study listed the weak spots: position bias, verbosity bias, self-enhancement bias. A rubric is the fix for most of them. The judge isn&apos;t asked whether a draft &quot;feels human.&quot; It&apos;s asked to rate specific, named behaviors, one at a time, on a 0 to 10 scale.</p>

          <p style={p}>The obvious design is one large prompt that reads the whole draft and returns all 28 judged signals at once. It works on paper. In practice, a single call juggling that many criteria risks letting them bleed into each other, so a draft with great word choice drifts upward on voice too. Splitting the work into seven parallel calls, one per section, keeps each judgment narrow. It also happens to be faster, which is a nice side effect of good hygiene.</p>

          <p style={p}>Every call runs at temperature 0, the setting that removes most of the model&apos;s randomness. Anthropic&apos;s API documentation recommends values near 0 for analytical work and adds an honest caveat: even at 0, results aren&apos;t fully deterministic. So the promise is the same score or a very close one for the same text, never a magic fixed number. Anyone selling the second version is selling something.</p>

          <h2 style={h2s}>Two observations per signal, pointing at the text</h2>

          <p style={p}>A bare 4 out of 10 on Opinion Strength tells you almost nothing. That&apos;s why every signal comes back with two short observations that cite the draft itself: the hedge in the second paragraph, the conclusion that weighs both sides and picks neither, the example that reads like it was invented for the occasion.</p>

          <p style={p}>This is the insider detail most people miss on their first report. The notes are the product. The scores exist so you know which notes to read first.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Cognitive Fingerprinting · 16% default weight</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Opinion Drift / Self-Correction</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>People change their minds on the page. Raw AI output almost never does. This signal looks for a visible turn in the reasoning.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Before</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Short intros improve engagement. Readers want value quickly, so keeping introductions brief is a best practice.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>After</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Short intros seem like the safe rule. They fail on how-to posts, where a reader needs one line of context before step one makes sense.&quot;</span>
              </div>
            </div>
          </div>

          <p style={p}>The rubric also names the newer habits of AI drafts, the ones that slipped past older checklists: chat-style openers and closing offers, the &quot;it isn&apos;t this, it&apos;s that&quot; contrast formula, ideas grouped in threes over and over, em dashes used for rhythm, conclusions that never commit, smooth coverage with no insider detail, and empathy that could apply to anyone. There&apos;s a mild irony in asking a model to spot these. It knows the moves because models made them famous.</p>

          <p style={p}>That irony carries a real risk. The G-Eval paper by Yang Liu and colleagues warned that LLM evaluators may favor text written by LLMs. A judge left to its own taste might reward the very polish it produces. Naming the patterns explicitly is the counterweight.</p>

          <h2 style={h2s}>Eight sections, and the one that carries no weight</h2>

          <p style={p}>The 32 signals sit in eight sections. Seven are judged by the rubric. The eighth, Statistical Proxies, holds Vocabulary Richness, Burstiness Approximation, Response Calibration and Entropy Variance. Those four are computed in code and shown in the report, but they carry no weight in the Human Score.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Eight ContentTrace sections with default weights: Structure and Flow 12%, Word Choice 15%, Voice 14%, Content and Logic 13%, Cognitive Fingerprinting 16%, Emotional Texture 12%, Pragmatics 10%, and Statistical Proxies shown for reference only." caption="Default weights before any content type adjusts them. Cognitive Fingerprinting counts most; Statistical Proxies count not at all." />

          <p style={p}>That last choice surprises people, and it should. Burstiness, the idea that human sentence lengths swing more than machine ones, is the most quoted &quot;AI tell&quot; on the internet. It&apos;s also easy to fake and easy to misread, since plenty of careful human writers keep an even rhythm. A metric that sounds scientific and moves the score on noise does more harm than good, so it stays on the page as context and off the scale.</p>

          <p style={p}>The default weights favor thinking over surface. Cognitive Fingerprinting leads at 16%, then Word Choice & Phrasing at 15% and Voice & Perspective at 14%. Content & Logic sits at 13%, Structure & Flow and Emotional Texture at 12% each, and Pragmatics & Subtext at 10%. They&apos;re relative weights: the score is a weighted average over whichever sections apply to the text.</p>

          <h2 style={h2s}>Content types decide what counts</h2>

          <p style={p}>A rubric that expects personal stories everywhere would flunk every API reference ever written. So ContentTrace sorts each text into one of 10 content types, detected automatically or picked by you: General, Personal blog / essay, Thought leadership / opinion, Company blog / brand article, Corporate / white paper, Technical / documentation, Academic / student essay, Marketing / web copy, Social post, and Email / letter.</p>

          <p style={p}>Each type shifts the section weights and marks signals that don&apos;t fit the genre as N/A, which removes them from the score. A company blog post leaves out Personal Anecdotes Present, Vulnerability Present, Opinion Drift / Self-Correction and Thinking Out Loud, because brand articles rarely speak as one person. Technical documentation leaves out 7 signals, including Opinion Strength and Irony or Dry Humor. Nobody wants jokes in their install guide.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--accent)", background: "var(--accent-light)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;When a signal doesn&apos;t fit the genre, its absence says nothing about the writing. So the rubric stops asking.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Voice & Perspective Signal</cite>
          </div>

          <h2 style={h2s}>Calibration: from raw marks to a readable score</h2>

          <p style={p}>Raw rubric scores mean different things in different genres. Formal writing scores lower on voice signals even when a person wrote every word, while a chatty email scores higher. Comparing them on one scale would be unfair to the white paper.</p>

          <p style={p}>So the content types roll up into 4 calibration groups: formal (academic, technical, corporate), business (company blog, thought leadership, marketing), personal (personal blog, social, email) and general (chat or Q&A answers and mixed text). Within each group, the displayed score is anchored so it reads 25 at the median raw score of AI samples and 75 at the median raw score of human samples.</p>

          <p style={p}>The result is capped between 2 and 98. No score of 0, no score of 100. That cap is a small, stubborn piece of honesty: no tool can be certain who wrote a text, so the scale refuses to pretend.</p>

          <h2 style={h2s}>How to use the report without chasing the number</h2>

          <p style={p}>There&apos;s a specific sinking feeling in pasting a draft you&apos;re proud of and watching the Human Score come back at, say, 41. The instinct is to start fiddling: add a contraction here, a short sentence there, hit score again. That route produces cosmetic edits and very little better writing.</p>

          <p style={p}>The better route is boring and works. Open the lowest section. Read both observations under its lowest signal. Go to the passage they quote and fix the thing they describe, usually by adding something real: a position, a detail only someone close to the work would know, a moment where the argument turns. Then score again and see whether the observations changed. A draft readers finish is the target, and the signals map the parts they&apos;d skip.</p>

          <p style={p}>ContentTrace is pro-AI by design. Drafting with a model is fine. Google&apos;s guidance on helpful content asks how and why a page was made, and treats automation as something to disclose where readers would expect it, never as a ban. The report exists to show where an AI-assisted draft still reads like everybody else&apos;s, so the final version doesn&apos;t.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>To turn a report into edits, <a href="/blog/how-to-read-a-detection-report" style={{ color: "var(--accent)", textDecoration: "underline" }}>How to Read a Detection Report</a> walks through it section by section. <a href="/blog/why-your-ai-detector-score-keeps-changing" style={{ color: "var(--accent)", textDecoration: "underline" }}>Why Your AI Detector Score Keeps Changing</a> covers why fixed settings matter. And <a href="/blog/how-to-humanize-ai-content" style={{ color: "var(--accent)", textDecoration: "underline" }}>How to Humanize AI Content</a> maps practical edits to the sections.</p>

          <Sources items={[
            { label: "Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (arXiv, 2023)", href: "https://arxiv.org/abs/2306.05685" },
            { label: "Liu et al., G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment (arXiv, 2023)", href: "https://arxiv.org/abs/2303.16634" },
            { label: "Anthropic Claude API docs: Create a Message (temperature parameter)", href: "https://platform.claude.com/docs/en/api/messages/create" },
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See the 32 signals and their observations on your own draft.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
