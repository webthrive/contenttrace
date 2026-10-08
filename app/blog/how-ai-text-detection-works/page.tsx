import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "how-ai-text-detection-works";
const TITLE = "How AI Text Detection Actually Works";
const DESCRIPTION = "Perplexity, trained classifiers and rubric-based reading: how each AI text detection approach works, where it breaks, and why burstiness got demoted.";
const HERO = `/blog/${SLUG}/hero.webp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "The three main ways software reads text for signs of AI, what each one measures, and where each one fails.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-03-19",
    modifiedTime: "2026-10-07",
    authors: ["Colin H"],
    images: [{ url: HERO, width: 1600, height: 900, alt: "A lens over AI-style text strikes out a one-number verdict and shows three detection methods instead" }],
  },
  twitter: { card: "summary_large_image", images: [HERO] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "Can AI detectors be fooled by paraphrasing?", a: "Yes. A 2023 University of Maryland study found that recursive paraphrasing significantly reduced detection rates across watermark, neural, zero-shot and retrieval-based detectors. Rubric-based reading holds up a little better against light paraphrasing, but heavy human editing of an AI draft really does change the writing, and no method can see through that." },
  { q: "Why do detectors sometimes flag human writing as AI?", a: "Formal, structured and second-language writing is predictable by design, so it looks low-perplexity to a scoring model. In the Stanford study of TOEFL essays, seven detectors flagged real student essays as AI-generated 61.22% of the time on average. That's the main reason a single score should never be treated as proof about a person." },
  { q: "Does text length affect accuracy?", a: "A lot. Short texts give every method fewer patterns to read, so a score on a two-line email carries far less information than a score on an 800-word article. OpenAI said its own classifier was very unreliable on texts below 1,000 characters." },
  { q: "Is burstiness a reliable sign of AI writing?", a: "Not on its own. In ContentTrace internal testing on October 3, 2026, burstiness separated human and AI text no better than chance. ContentTrace still shows it, but for reference only, with no weight in the score. The test was a modest internal sample, so treat the finding as a strong caution rather than a final word." },
  { q: "What makes Content Trace different from a typical AI detector?", a: "Most detectors return one number. ContentTrace explains its results with 32 signals in 8 sections, so a writer can see which parts of a draft read as generic and fix them. The goal is better writing for readers, search and AI answers, with the score used as an editing diagnostic." },
  { q: "Will AI detectors become obsolete as models improve?", a: "Statistical detectors will keep eroding as models get better at surface-level variety. Rubric-based reading should last longer because it looks for real opinions, insider detail and self-correction, which come from a writer thinking. That's a judgment call, though. Nobody knows yet how far models will close the gap." },
];

export default function HowAiTextDetectionWorks() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-03-19" dateModified="2026-10-07" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="March 19, 2026" readTime="8 min read" updated="October 7, 2026" />

        <BlogHero src={HERO} alt="A lens over dim AI-style text strikes out a one-number verdict and highlights the three ways detectors actually read writing." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "AI text detection comes in three families: perplexity-style statistics, trained classifiers and rubric-based reading. Each one fails in a different way.",
              "Perplexity is the most-cited signal, but it depends on the model doing the scoring, and it punishes formal and second-language writing.",
              "Trained classifiers learn the AI output they were trained on. New models and simple paraphrasing push them off balance.",
              "Burstiness looked like a durable signal. In ContentTrace internal testing on October 3, 2026, it separated human and AI text no better than chance, so it now carries no weight.",
              "Rubric-based reading looks for evidence of a writer thinking, like opinions, insider detail and self-correction. Those signals are the most useful ones for editing.",
              "No method is certain. A signal-level breakdown helps a writer improve a draft. A single number used as a verdict on a person does harm.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>In 2023, a Stanford team ran 91 essays from the TOEFL, the English exam many non-native speakers take for university admission, through seven popular GPT detectors. Every essay was written by a person. On average, the detectors labeled them AI-generated 61.22% of the time. Eighteen of the 91 were flagged by all seven tools at once.</p>

          <p style={p}>That result says less about those students than about how detection works. The tools weren&apos;t broken in some random way. They were doing exactly what they were built to do, and the method itself had a blind spot that lines up with careful, plain, textbook English.</p>

          <p style={p}>Most people treat detectors as a black box: paste text in, get a number out. The box only holds a few kinds of machinery, though. Once you know which kind you&apos;re looking at, the scores start to make sense. So do the failures.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>3</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Families of AI text detection, each with its own blind spot</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Knowing which one produced a score tells you how far to trust it.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Explainer</div>
          </div>
          </a>

          <h2 style={h2s}>The three ways software reads text for signs of AI</h2>

          <p style={p}>The first family is statistical. It measures properties of the text itself: how predictable each word is, how much the vocabulary varies, how sentence length swings. These signals come from the way language models generate text, one likely token after another. That process leaves marks.</p>

          <p style={p}>The second family is the trained classifier. Someone collects a large pile of human text and a large pile of AI output, then trains a model to tell them apart. It never explains itself. It just returns a probability.</p>

          <p style={p}>The third family is rubric-based reading. Instead of counting tokens, it reads the text against a fixed list of things human writers tend to do and AI drafts tend to skip. Does an opinion shift mid-argument? Is there a detail only an insider would know? Is the writer working something out, or delivering a finished answer?</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Three cards compare detection methods: perplexity reads word predictability and breaks on formal writing, classifiers learn past AI output and break on new models, rubric reading checks for thinking and costs more to run." caption="Each family reads something different, so each one fails on a different kind of writing." />

          <p style={p}>Most commercial detectors lean on the first two, because they&apos;re fast and cheap at scale. For anyone trying to improve a draft, that&apos;s the wrong choice. The statistical signals are real, but they&apos;re the easiest to game and the least useful to a writer. Knowing a paragraph is &quot;low perplexity&quot; tells you nothing about what to change.</p>

          <h2 style={h2s}>What perplexity actually measures, and where it breaks down</h2>

          <p style={p}>Perplexity is the signal everyone in this space talks about. The idea is simple: given everything that came before, how surprising is the next word? A language model assigns a probability to every possible next token. Low perplexity means the text was predictable. High perplexity means it was full of unexpected choices.</p>

          <p style={p}>Human writers usually score higher, and not because they&apos;re trying to be unpredictable. They pick the odd word that fits better. They mention something specific that bends the paragraph off its expected path. Nobody plans those choices. They&apos;re what happens when a real person turns a thought into language.</p>

          <p style={p}>Researchers have refined the idea. DetectGPT, from a Stanford group in 2023, compares a passage with slightly altered copies of itself and checks whether the original sits near a peak of the model&apos;s probability curve. On fake news written by the 20-billion-parameter GPT-NeoX model, it raised the detection score (AUROC) from 0.81 for the best earlier zero-shot method to 0.95.</p>

          <h3 style={h3s}>The model-dependency problem few vendors mention</h3>

          <p style={p}>Here&apos;s the catch, and it explains most strange scores: perplexity is always measured relative to a specific model. A sentence that looks predictable to one model may look surprising to another. Detector accuracy therefore depends on which model is doing the scoring, and as frontier models change, older detectors drift. The number on screen looks absolute. It isn&apos;t.</p>

          <p style={p}>It also explains the TOEFL result. Writers working in a second language often choose common words and safe structures on purpose. To a scoring model, that careful English looks like machine output. The method can&apos;t tell &quot;predictable because a model wrote it&quot; from &quot;predictable because the writer was being careful.&quot;</p>

          <p style={p}>The obvious fix is to look at rhythm instead. Burstiness, the swing between short and long sentences, is a property of the text alone, so it shouldn&apos;t depend on any model. The original version of this post called it a more durable signal than perplexity. That claim didn&apos;t survive testing.</p>

          {/* Update box */}
          <div style={{ border: "1px solid rgba(236,72,96,0.3)", borderRadius: "12px", background: "var(--red-bg)", padding: "16px 20px", margin: "28px 0" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>Update, October 2026</div>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 10px" }}>In ContentTrace internal testing on October 3, 2026, burstiness separated human and AI text no better than chance. The test used 162 scored samples: 75 human texts written before 2022 and 87 AI replies from Claude, ChatGPT and Gemini.</p>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>Burstiness is still shown in every ContentTrace report, under Statistical Proxies, but for reference only. It carries no weight in the score, and neither do the other statistical proxies. These are internal results on a modest sample, and short texts give weaker signals.</p>
          </div>

          <p style={p}>Why would rhythm fail as a number when readers clearly feel it? The best explanation is that a raw variance figure ignores context. Plenty of human writing is evenly paced (an email, a how-to), and current models vary sentence length more than older ones did. Readers notice rhythm in relation to meaning. A spreadsheet of sentence lengths can&apos;t.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;Burstiness separated human and AI text no better than chance, so it is now shown for reference only.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Statistical Proxies Signal</cite>
          </div>

          <h2 style={h2s}>Trained classifiers: fast, confident and tied to the past</h2>

          <p style={p}>A classifier is only as current as its training data. It learns what AI output looked like when the dataset was built, and every new model release moves the target. That&apos;s why classifier vendors retrain constantly, and why a score from one month may not match a score from the next.</p>

          <p style={p}>The most public example is OpenAI&apos;s own classifier. By the company&apos;s published numbers, it caught 26% of AI-written text and wrongly flagged human text 9% of the time. OpenAI withdrew it on July 20, 2023, citing its low rate of accuracy. There&apos;s a dry lesson in that. The company that built the model couldn&apos;t reliably spot the model&apos;s writing.</p>

          <p style={p}>Paraphrasing makes things worse. A 2023 University of Maryland paper tested watermark, neural, zero-shot and retrieval-based detectors against recursive paraphrasing, where another model rewords an AI draft, sometimes more than once. Detection rates dropped significantly, while text quality fell only slightly in many cases. To a classifier, a reworded draft can look like a different kind of text entirely.</p>

          <h2 style={h2s}>Rubric-based reading: the signals that come from thinking</h2>

          <p style={p}>The third approach is the interesting one, because its signals aren&apos;t arbitrary. They describe something real about how a mind shows up on the page. This is the approach ContentTrace takes. It explains its results with 32 signals in 8 sections, and the sections that count describe the writing, not the token math.</p>

          <h3 style={h3s}>Opinion drift and self-correction</h3>

          <p style={p}>When people work through an argument in writing, their thinking moves. They start a paragraph committed to one position and finish somewhere slightly different, because writing it down revealed something. Sometimes they catch it and correct it. Sometimes they let the drift stand, because it&apos;s honest.</p>

          <p style={p}>AI drafts rarely do this. The model heads toward a conclusion from the first word and keeps going. The result is technically logical and strangely flat. Nothing in it surprised its own author.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>Cognitive Fingerprinting · 16% weight</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Opinion Drift / Self-Correction</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>Human writers change course mid-paragraph. AI drafts stay on plan from the first word to the last.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>AI draft</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;There are several key benefits to using AI writing tools. They save time, improve consistency, and help teams scale content output efficiently.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Edited</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;The time savings are real. The consistency argument is shakier. Consistent mediocrity was never the goal, and somebody should say so out loud.&quot;</span>
              </div>
            </div>
          </div>

          <h3 style={h3s}>Specificity that feels accidentally true</h3>

          <p style={p}>Human writers reach for concrete details: a particular number, a named place, the tool that broke on a Tuesday. Those details make writing credible and personal at once. AI drafts reach for illustrative generalities because the model has no experiences to draw from. It can invent specifics, but invented ones have a different texture. They&apos;re too clean and too perfectly on point. Real specifics are slightly awkward, and that imperfect fit is part of what makes them feel true.</p>

          <p style={p}>This is where rubric-based reading earns its keep. A low score on Insider/Niche Knowledge doesn&apos;t accuse anyone of anything. It points at the paragraph that needs a real example. You can run a draft through <a href="/" style={{ color: "var(--accent)", textDecoration: "underline" }}>Content Trace</a> to see the breakdown section by section, free and with no account.</p>

          <Figure src={`/blog/${SLUG}/inline-2.webp`} alt="A diagram of ContentTrace's 8 report sections: 7 rubric sections carry weight in the score, while the Statistical Proxies section, including burstiness, is shown for reference only." caption="Since the October 2026 testing, only the rubric sections move the score. The statistical proxies stay visible as context." />

          <h2 style={h2s}>Why no detector is 100%, and what the score is for</h2>

          <p style={p}>A common framing says AI detectors are useless unless they&apos;re perfect. Nobody judges other diagnostic tools that way. A radiologist reading an X-ray isn&apos;t right every time, and neither is a bank&apos;s fraud filter. The real questions are whether the signal beats chance, whether its errors follow patterns you can account for, and whether the tool is honest about its limits.</p>

          <p style={p}>Honesty is where most tools fall down. A single percentage implies a certainty no method has. The frustration that causes is specific and avoidable. Picture a student who wrote every word watching a dashboard call the essay 90% AI, and there&apos;s nothing in the report to argue with. The TOEFL study shows that this happens to real people, at scale.</p>

          <p style={p}>The better use of any score is editorial. Treat it as a map of where a draft reads as generic, then fix those places. That works whether the draft started with a model, a person or both, and it&apos;s the use that actually helps content perform with readers, in search and in AI answers.</p>

          {/* Before/After */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", background: "var(--bg-card)", margin: "32px 0" }}>
            <div style={{ padding: "10px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Word Choice &amp; Phrasing · Before and after
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "14px 18px", background: "rgba(236,72,96,0.03)", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>AI draft</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>&quot;It&apos;s worth noting that perplexity is an important metric that can be leveraged to comprehensively assess the statistical properties of AI-generated text.&quot;</p>
              </div>
              <div style={{ padding: "14px 18px", background: "rgba(87,13,158,0.03)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>Edited</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>&quot;Perplexity tells you how surprised a model was by each word. Low surprise often means a model wrote it. The idea breaks down faster than most vendors admit.&quot;</p>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For the research on beating detectors, <a href="/blog/can-ai-detectors-be-fooled" style={{ color: "var(--accent)", textDecoration: "underline" }}>Can AI Detectors Be Fooled?</a> goes further into paraphrasing and its limits. <a href="/blog/behavioral-signals-that-give-ai-writing-away" style={{ color: "var(--accent)", textDecoration: "underline" }}>The Behavioral Signals That Give AI Writing Away</a> covers the rubric signals one by one. And <a href="/blog/why-your-ai-detector-score-keeps-changing" style={{ color: "var(--accent)", textDecoration: "underline" }}>Why Your AI Detector Score Keeps Changing</a> explains the drift described above.</p>

          <Sources items={[
            { label: "Liang et al. (2023), GPT detectors are biased against non-native English writers (arXiv)", href: "https://arxiv.org/abs/2304.02819" },
            { label: "Mitchell et al. (2023), DetectGPT: Zero-Shot Machine-Generated Text Detection using Probability Curvature (arXiv)", href: "https://arxiv.org/abs/2301.11305" },
            { label: "Sadasivan et al. (2023), Can AI-Generated Text be Reliably Detected? (arXiv)", href: "https://arxiv.org/abs/2303.11156" },
            { label: "OpenAI: New AI classifier for indicating AI-written text (with July 2023 withdrawal note)", href: "https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See which sections of your draft read as generic, and fix them before you publish.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
