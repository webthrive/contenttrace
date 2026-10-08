import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "why-your-ai-detector-score-keeps-changing";
const TITLE = "Why Your AI Detector Score Keeps Changing (And What to Do About It)";
const DESCRIPTION = "Same text, different tools, different scores. Why AI detector results vary across tools and runs, which variation matters, and how to read scores well.";
const HERO = `/blog/${SLUG}/hero.webp`;
const OG = `/og/blog/${SLUG}.jpg`; // 1200 x 630 social image

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "Why the same text gets different AI detector scores across tools and runs, and how to read a score without overreacting.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-03-15",
    modifiedTime: "2026-10-07",
    authors: ["Colin H"],
    images: [{ url: OG, width: 1200, height: 630, alt: "Score bars from four tools disagree on the same text, beside a breakdown that points to one weak section", type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "Is one AI detector more accurate than the others?", a: "Not across the board. Tools do better or worse depending on the model that wrote the text, the genre and the length. In the 2023 test of 14 tools by Weber-Wulff and colleagues, none reached 80% accuracy and only five scored above 70%." },
  { q: "Why does the same text score differently when a paragraph is added?", a: "Most tools score patterns across the whole text, so a new paragraph changes the overall mix. If the added paragraph reads differently from the rest, the total moves. That's expected behavior, and it's also a hint about which paragraph is pulling the score." },
  { q: "Should you trust a tool that claims perfect consistency?", a: "Consistency and accuracy are separate things. A tool can return the same wrong number every time. Stable results on the same text are a good sign, but the better question is whether the tool explains why it scored the way it did." },
  { q: "What does a mid-range AI content score actually mean?", a: "Usually that the text has features pointing both ways: edited AI-assisted writing, structured human writing, or a document mixed from several sources. A verdict is the wrong response. Look at which parts of the text drive the score and edit those." },
  { q: "How short is too short for an AI detector?", a: "Shorter than most people expect. Turnitin requires at least 300 words of prose before it gives a result, and OpenAI described its own classifier as very unreliable below 1,000 characters. Social posts and short emails sit well inside that unreliable zone." },
  { q: "Does detector accuracy drop as AI models improve?", a: "For tools that lean on word-level statistics, newer models make the job harder, and paraphrasing makes it harder still. Signals about substance, such as whether a text has real examples or takes a position, hold up better, which is one more reason to read a breakdown instead of a single number." },
];

export default function PostScoreKeepsChanging() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-03-15" dateModified="2026-10-07" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="March 15, 2026" readTime="7 min read" updated="October 7, 2026" />

        <BlogHero src={HERO} alt="Score bars from four tools disagree about the same text, next to a section breakdown that points to the one part of the draft worth editing." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Different detectors measure different things, against different reference models and training data. Disagreement between tools is normal.",
              "Within one tool, scores can drift because of random sampling, how the text is split into chunks, or a model update nobody announced.",
              "Length matters more than anything else. Turnitin won't score fewer than 300 words of prose, and OpenAI called its own classifier very unreliable under 1,000 characters.",
              "Averaging four tools doesn't fix anything. Look for which parts of the text drive the result.",
              "A score that swings between tools is telling you the text is mixed. That's a reason to edit, never a verdict on the writer.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>When OpenAI released its own AI text classifier in January 2023, it shipped with an unusual warning: &quot;The classifier is very unreliable on short texts (below 1,000 characters).&quot; It correctly flagged 26% of AI-written text and wrongly flagged human text 9% of the time. Six months later, OpenAI took it down, citing its &quot;low rate of accuracy.&quot;</p>

          <p style={p}>That was the company that built the model, trying to detect its own output. So when a writer pastes the same blog post into four detectors and gets four very different numbers, nothing has broken. The frustration is real, especially when one tool says 12% and another says 88% on a paragraph the writer typed by hand. But the variation has causes, and once you know them, a changing score becomes much less alarming and a lot more useful.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>300</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Words of prose Turnitin requires before it gives an AI writing result</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Below that, the vendor won&apos;t score at all. Short texts give every tool too little to work with.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Explainer</div>
          </div>
          </a>

          <h2 style={h2s}>Why different tools give different scores</h2>

          <p style={p}>Different detectors measure different things, and that explains most of it. A tool built mainly on word predictability will disagree with a tool that weighs how a text argues, because the same text can look ordinary on one dimension and unusual on the other. Each tool reports on a different property of the same text.</p>

          <p style={p}>Then there&apos;s the reference model. Predictability is always measured against some language model: how surprising are these words, given what that model would expect? Tools use different reference models. Text that looks expected to one can look surprising to another, and text written by a model the tool never saw in training is the hardest case of all.</p>

          <p style={p}>Training data matters too. Every classifier learns from labeled examples of human and AI text. Which years, which models, which genres: all of that shapes what it recognizes. Two tools trained on different sets will split on edge cases, and most interesting writing is an edge case of some kind.</p>

          <p style={p}>Here&apos;s a surprising one from the largest independent test of the period. Weber-Wulff and seven co-authors tested 14 tools on 54 documents. Human-written text was classified correctly 96% of the time on average. Human text that had been machine-translated into English scored about 20% lower. Nothing about who wrote it changed. Only the route the words took into English.</p>

          <p style={p}>Finally, thresholds differ. One tool&apos;s 60% is not another tool&apos;s 60%. Each vendor decides where its scale bends, and few publish how. Comparing raw numbers across tools is a bit like comparing shoe sizes across countries without the chart.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Two groups of causes: across tools, scores differ because of signals, reference models, training data and thresholds; across runs of one tool, because of sampling, chunking, silent updates and edits." caption="Most score changes trace back to one of these eight causes, and none of them means the writer did anything wrong." />

          <h2 style={h2s}>Why scores vary across runs of the same tool</h2>

          <p style={p}>This surprises people more. Run the same text through the same detector twice and get 71%, then 68%. If the input didn&apos;t change, why did the output?</p>

          <p style={p}>A few reasons. Some tools use language models with random sampling switched on, so the same input can produce slightly different results from one call to the next. Some tools split text into chunks, score each one and combine them, and a medium-length text isn&apos;t always split the same way. Pasting from a different source can add or drop headings, lists and line breaks, which changes the chunks too. And some vendors update their classifiers without telling anyone, so the tool you used last Tuesday may not be the tool you&apos;re using today.</p>

          <p style={p}>A few points of drift between runs is normal. Swings of ten points or more on identical text point to a tool that isn&apos;t stable, and that&apos;s worth knowing before anyone makes a decision based on its number.</p>

          <h2 style={h2s}>The text length problem</h2>

          <p style={p}>Every detector gets less reliable as text gets shorter. Most signals need several instances before a pattern means anything. One sentence can be unusual whether a person or a model wrote it. Several paragraphs give a tool enough repetitions to tell a habit from an accident.</p>

          <p style={p}>The vendors say this themselves, in small print. Turnitin needs at least 300 words of prose to produce a result. It also marks scores between 1% and 20% with an asterisk, because its testing found &quot;a higher incidence of false positives&quot; in that range. Few people who see that asterisk know what it means.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Structure & Flow</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Sentence Length Variation</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>Rhythm signals need enough sentences to mean anything. In a short text, one long sentence can change the picture. These are hypothetical examples.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Too short</span>
                <span style={{ color: "var(--text-secondary)" }}>A three-sentence LinkedIn post. Any rhythm reading here is mostly noise, whoever wrote it.</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Enough</span>
                <span style={{ color: "var(--text-secondary)" }}>A 1,500-word article. Sixty-plus sentences show whether the rhythm really varies or keeps the same beat.</span>
              </div>
            </div>
          </div>

          <p style={p}>The awkward part: much of what people most want to check is short. Social posts, email copy, ad text. A tweet that scores 85% AI tells you very little. A long article with the same patterns showing up section after section tells you a lot more.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;The classifier is very unreliable on short texts (below 1,000 characters).&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>OpenAI · on its own AI text classifier, 2023</cite>
          </div>

          <Figure src={`/blog/${SLUG}/inline-2.webp`} alt="Three vendor warnings about short or low-scoring text: OpenAI under 1,000 characters, Turnitin under 300 words, and Turnitin scores from 1 to 20 percent marked with an asterisk." caption="The vendors publish their own limits. They're just rarely read." />

          <h2 style={h2s}>Score instability is information</h2>

          <p style={p}>When a text scores very differently across tools, the split says something about the text, as well as about the tools.</p>

          <p style={p}>Unedited AI output tends to score high across well-built tools, because several independent signals point the same way. Clearly human writing tends to score low for the same reason. Text that sends tools in different directions usually sits in mixed territory: an AI-assisted draft where the writer added real material in some sections and not others, formal human writing that shares surface patterns with models, or a document stitched from several sources.</p>

          <p style={p}>The obvious fix is to run four tools and average the results. It doesn&apos;t work, because the tools aren&apos;t measuring the same thing, so the average describes nothing in particular. A better habit is to look for agreement. If several tools with different methods all point at the same section, that section probably needs work. If one tool out of four disagrees, that&apos;s one tool.</p>

          <h2 style={h2s}>How to get more consistent results</h2>

          <h3 style={h3s}>Check longer text</h3>
          <p style={p}>If a piece is under a few hundred words, check it together with the content around it, or accept that the number is soft. More text gives more stable readings.</p>

          <h3 style={h3s}>Read the breakdown before the headline number</h3>
          <p style={p}>A single number hides what drives it. A breakdown shows which qualities of the writing are pulling the result, and one odd sentence moves a section less than it moves a total. <a href="/" style={{ color: "var(--accent)", textDecoration: "underline" }}>Content Trace</a> explains its results with 32 signals in 8 sections for exactly this reason: a writer can see which part of the draft to edit next.</p>

          <h3 style={h3s}>Treat the middle as a to-do list</h3>
          <p style={p}>A mid-range score means features point both ways. That&apos;s a reason to look at the weakest sections and improve them, and never a reason to accuse anyone. The goal of checking an AI-assisted draft is a better draft, one with real examples and a clear position, that readers finish.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For the mechanics behind these tools, see <a href="/blog/how-ai-text-detection-works" style={{ color: "var(--accent)", textDecoration: "underline" }}>How AI Text Detection Actually Works</a>. <a href="/blog/can-ai-detectors-be-fooled" style={{ color: "var(--accent)", textDecoration: "underline" }}>Can AI Detectors Be Fooled?</a> covers why chasing a lower score is the wrong goal. And <a href="/blog/how-to-read-a-detection-report" style={{ color: "var(--accent)", textDecoration: "underline" }}>How to Read a Detection Report</a> walks through a breakdown section by section.</p>

          <Sources items={[
            { label: "OpenAI: New AI classifier for indicating AI-written text (withdrawn July 2023 for low accuracy)", href: "https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/" },
            { label: "Turnitin Guides: AI writing detection", href: "https://fa-help.turnitin.com/ai-writing-detection.htm" },
            { label: "Weber-Wulff et al. (2023): Testing of detection tools for AI-generated text, International Journal for Educational Integrity", href: "https://link.springer.com/article/10.1007/s40979-023-00146-z" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See which parts of your draft drive the result.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Try Content Trace free →
          </a>
        </div>
      </main>
    </>
  );
}
