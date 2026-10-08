import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "how-contenttrace-is-calibrated";
const TITLE = "How ContentTrace Is Calibrated: Testing Against Human and AI Writing";
const DESCRIPTION = "ContentTrace's internal Oct 3, 2026 test: 162 samples, leave-one-out, 89% accuracy, AUC up to 94.8%, and the limits that still matter.";
const HERO = `/blog/${SLUG}/hero.webp`;
const OG = `/og/blog/${SLUG}.jpg`; // 1200 x 630 social image

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "The method, the numbers and the known limits of ContentTrace's internal calibration test, published in full.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-10-06",
    modifiedTime: "2026-10-06",
    authors: ["Colin H"],
    images: [{ url: OG, width: 1200, height: 630, alt: "A lens strikes out a 99% accurate claim and shows the real internal results: 71 of 75 human texts and 62 of 75 AI texts", type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "How accurate is ContentTrace?", a: "In internal testing on October 3, 2026, leave-one-out accuracy was 89% on 150 texts: 71 of 75 human texts and 62 of 75 AI texts classified correctly. That's a modest sample, not a guarantee, and results on short texts are weaker." },
  { q: "Can a ContentTrace score prove a text is AI content?", a: "No. The score is an editing aid. It ranges from 2 to 98 because no tool can be certain who wrote a text, and the same test missed 4 of 75 human texts. Never treat it as the only evidence about a person." },
  { q: "Why were the human samples written before 2022?", a: "So they couldn't be AI-assisted. Texts from before modern chat assistants were widely available give a clean human baseline: Reddit ELI5 answers, tweets, company and personal blogs, Enron emails, Python PEPs, arXiv abstracts and Reuters news." },
  { q: "What does leave-one-out mean here?", a: "Each text is scored as if it had never been part of the sample, so it can't help set the bar it's judged against. It's a fair way to test on a small set, though the scikit-learn docs note it can give high-variance estimates." },
  { q: "Does ContentTrace catch AI text that was prompted to sound human?", a: "Rarely. In the internal test, AI text prompted to sound human was caught only 3 of 12 times. That limit is real and it's published on purpose." },
  { q: "What was the routing fix?", a: "Answers to a person's question now count as general text even when they're technical. Before the fix, technical AI explainers were compared against formal anchors and scored far too human." },
];

export default function HowContentTraceIsCalibrated() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-10-06" dateModified="2026-10-06" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="October 6, 2026" readTime="7 min read" />

        <BlogHero src={HERO} alt="A lens over boastful detector marketing strikes out 99% accurate and shows the internal results instead: 71 of 75 human texts and 62 of 75 AI texts." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Any tool that scores writing should publish its test method, sample sizes and misses. These are ContentTrace's, from internal testing on October 3, 2026.",
              "The test scored 162 samples: 75 human texts written before 2022 and 87 AI replies from Claude, ChatGPT and Gemini.",
              "Leave-one-out accuracy was 89%: 71 of 75 human texts and 62 of 75 AI texts classified correctly.",
              "A routing fix and new anchors raised the area under the curve from 83.7% to 94.8%.",
              "AI text prompted to sound human was caught only 3 of 12 times, the business calibration group is small, and short texts give weaker signals.",
              "This is a modest internal sample. Treat the score as an editing aid, never as proof about a person.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>On July 20, 2023, OpenAI switched off its own AI text classifier. The company&apos;s announcement had already stated the numbers plainly: the tool correctly flagged 26% of AI-written text and wrongly labeled human writing as AI-written 9% of the time. It was, in OpenAI&apos;s words, &quot;very unreliable on short texts.&quot; The update that retired it cited &quot;its low rate of accuracy.&quot;</p>

          <p style={p}>That episode set a useful standard, and few tools have met it since. Most accuracy claims in this market arrive as one large number with no sample, no method and no misses. A detector advertised as 99% accurate on data nobody can see is a horoscope with a decimal point.</p>

          <p style={p}>So here is the opposite. Below is how ContentTrace was calibrated, the internal test behind it, every headline number, and the places it still falls short.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>162</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Samples scored in the internal October 3, 2026 evaluation</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>75 human texts written before 2022, 87 AI replies from three providers.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Internal test</div>
          </div>
          </a>

          <h2 style={h2s}>What went into the test</h2>

          <p style={p}>The human side had to be beyond doubt, so every human text predates 2022, before chat assistants were part of everyday writing. The 75 samples span very different registers: Reddit ELI5 answers, tweets, company blogs and personal blogs, emails from the public Enron corpus, Python Enhancement Proposals, arXiv abstracts and Reuters news.</p>

          <p style={p}>The AI side came from 29 prompts sent to three providers, Claude, ChatGPT and Gemini, at default settings with no system prompt. That produced 87 replies. Twelve of them were &quot;humanized&quot; samples, where the model was asked to sound human, and those are reported separately. The other 75 form the AI group in the main results.</p>

          <p style={p}>Default settings with no system prompt were a deliberate choice. That&apos;s what a writer gets from a fresh chat window, so it&apos;s the realistic baseline for raw AI output. It&apos;s also the easiest case to catch. Drafts written with a detailed brief, a voice guide or a few rounds of human editing will look different, and that&apos;s fine, because those are the AI-assisted drafts ContentTrace exists to help improve. The test measures whether the score separates unedited model output from human writing. It doesn&apos;t measure how good any of it is.</p>

          <p style={p}>The mix matters more than the size. A test made only of student essays would say nothing about Slack-length emails or API docs, and writers bring both to a scoring tool.</p>

          <h2 style={h2s}>How calibration works</h2>

          <p style={p}>Raw scores from the rubric mean different things in different genres. A Python PEP written by a person still scores low on Emotional Texture, because specs don&apos;t have feelings. So the 10 content types roll up into 4 calibration groups: formal, business, personal and general.</p>

          <p style={p}>Each group gets two anchors taken from the test data. The displayed score reads 25 at the median raw score of that group&apos;s AI samples and 75 at the median raw score of its human samples. The final number is capped between 2 and 98, since no tool can be certain who wrote a text.</p>

          <p style={p}>Accuracy was measured with leave-one-out. Each text is scored with anchors computed from all the other texts, so no sample helps set the bar it&apos;s judged against. The scikit-learn documentation describes the method well: each learning set takes &quot;all the samples except one, the test set being the sample left out.&quot; The same page notes that leave-one-out &quot;often results in high variance&quot; as an estimate. On 150 texts, that warning applies, and it&apos;s one more reason to read every number below as provisional.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Statistical Proxies · reference only, no weight</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Burstiness Approximation</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>The most quoted AI tell online separated human from AI text no better than chance in this test. Since then, all four Statistical Proxies are measured and shown for reference, with no weight in the Human Score.</p>
            </div>
          </div>

          <h2 style={h2s}>The results</h2>

          <p style={p}>With the new calibration, leave-one-out accuracy was 89%. Of the 75 human texts, 71 were classified correctly. Of the 75 AI texts, 62 were.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Bar chart of internal leave-one-out results: human texts 71 of 75, AI texts 62 of 75, Gemini 23 of 25, Claude 20 of 25, ChatGPT 19 of 25, AI prompted to sound human 3 of 12, with area under the curve rising from 83.7% to 94.8%." caption="Internal test, October 3, 2026. A modest sample, published with its misses." />

          <p style={p}>The split runs in the right direction for a tool like this: 4 human misses against 13 AI misses. Wrongly flagging a person costs far more than missing a machine.</p>

          <p style={p}>By provider, Gemini replies were caught 23 of 25 times, Claude 20 of 25 and ChatGPT 19 of 25. The gap between them is small enough on samples this size that ranking the providers would be overreading it.</p>

          <p style={p}>The area under the curve for the displayed score rose from 83.7% to 94.8% after the changes described in the next section. Google&apos;s machine learning course gives the cleanest definition of that metric: the probability that a model ranks a randomly chosen positive example above a randomly chosen negative one. 50% is a coin flip and 100% is perfect separation. At 94.8%, a random AI text in this sample usually scores below a random human text, though not always.</p>

          <h2 style={h2s}>The routing fix</h2>

          <p style={p}>Part of that jump came from routing, not scoring. Content types decide which calibration anchors apply, and one class of text was going to the wrong place.</p>

          <p style={p}>A technical AI explainer, say, a model&apos;s answer to someone asking how DNS caching works, reads like documentation. So it was routed to the formal group and compared against formal human anchors, the PEPs and arXiv abstracts. Against that bar it looked lively, and it scored far too human.</p>

          <p style={p}>The tempting conclusion from misses like those is that the judge can&apos;t read technical writing. That reading is wrong, and acting on it would have meant rebuilding the wrong part. The judge was scoring fine. The comparison was off. Now answers to a person&apos;s question count as &quot;general&quot; even when they&apos;re technical, and they&apos;re measured against the right anchors.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--accent)", background: "var(--accent-light)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;A score only means something next to the right comparison. Change the comparison and the same text tells a different story.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Colin H · Web Thrive</cite>
          </div>

          <h2 style={h2s}>Known limits, stated plainly</h2>

          <p style={p}>The weakest result is the one most people will ask about. AI text prompted to &quot;sound human&quot; was caught only 3 of 12 times. A model told to add contractions, hedge less and vary its rhythm can clear many surface checks. That doesn&apos;t make the text better for readers, which is the argument of a separate post on why undetectable AI is the wrong goal, but it does mean the score is easy to move without real editing.</p>

          <p style={p}>The remaining AI misses include formal AI documents and some AI emails and social posts. On the human side, the misses were a company &quot;what is product analytics&quot; article, 2 short emails and 1 academic abstract. Reading that list is uncomfortable, because each one is a real person&apos;s writing that the system called machine-like, and a company explainer is exactly the kind of page ContentTrace users write.</p>

          <p style={p}>Two structural limits sit under those misses. The business calibration group is small, with 8 human and 9 AI samples, and needs more data before its anchors deserve much trust. And short texts give weaker signals across the board, the same problem OpenAI named for its own classifier. A 60-word email simply contains fewer places for a writer&apos;s habits to show.</p>

          <p style={p}>There&apos;s a broader caution too. Research by Weixin Liang and colleagues found that popular detectors &quot;consistently misclassify non-native English writing samples as AI-generated.&quot; The ContentTrace test didn&apos;t isolate non-native writers, so it can&apos;t claim to be free of that bias. That&apos;s the honest position, and it&apos;s why the score should never be the only evidence about a person.</p>

          <p style={p}>These are internal results on a modest sample. They aren&apos;t a guarantee. What they do show is a method anyone can follow, numbers with denominators, and a list of misses. That&apos;s the minimum any writing score should publish, and the reason ContentTrace frames its score as a guide to editing AI-assisted drafts, never a verdict.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For the scoring method these anchors sit on, read <a href="/blog/inside-the-32-signals" style={{ color: "var(--accent)", textDecoration: "underline" }}>Inside the 32 Signals</a>. <a href="/blog/editor-not-author-content-optimizer" style={{ color: "var(--accent)", textDecoration: "underline" }}>Editor, Not Author</a> explains how rewrites are re-scored by the same engine. <a href="/blog/can-ai-detectors-be-fooled" style={{ color: "var(--accent)", textDecoration: "underline" }}>Can AI Detectors Be Fooled?</a> covers why chasing a passing score misses the point.</p>

          <Sources items={[
            { label: "OpenAI: New AI classifier for indicating AI-written text (with July 2023 update)", href: "https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/" },
            { label: "Google for Developers, Machine Learning Crash Course: ROC and AUC", href: "https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc" },
            { label: "scikit-learn: Cross-validation, Leave One Out (LOO)", href: "https://scikit-learn.org/stable/modules/cross_validation.html" },
            { label: "Liang et al., GPT detectors are biased against non-native English writers (arXiv, 2023)", href: "https://arxiv.org/abs/2304.02819" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See how a calibrated score reads your own draft, section by section.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
