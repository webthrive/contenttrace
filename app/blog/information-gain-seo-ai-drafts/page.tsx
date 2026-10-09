import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "information-gain-seo-ai-drafts";
const TITLE = "Information Gain: The SEO Edge an AI Draft Cannot Copy";
const DESCRIPTION = "Information gain SEO rewards pages that add something new. A raw AI draft remixes what ranks. How AI-assisted writers add data, experience and opinion.";
const HERO = `/blog/${SLUG}/hero.webp`;
const OG = `/og/blog/${SLUG}.jpg`; // 1200 x 630 social image

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "Why original data, first-hand experience and a clear opinion are the SEO edge a raw AI draft can't produce, and how to add them on purpose.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-06-03",
    modifiedTime: "2026-06-03",
    authors: ["Colin H"],
    images: [{ url: OG, width: 1200, height: 630, alt: "A lens over generic AI-style copy that strikes out a consensus phrase and highlights the writer's own numbers", type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "What is information gain in SEO?", a: "It's the idea that a page should add something a searcher hasn't already seen in the other results: new data, a first-hand account, a tested method or a clear argument. Google holds a patent on scoring documents this way, and its helpful content guidance asks whether a page offers original information and substantial value compared to other pages in search results." },
  { q: "Is information gain a confirmed Google ranking factor?", a: "No. The patent, \"Contextual estimation of link information gain,\" shows Google has researched the idea, and a patent is not proof of a live ranking system. The safer reading is that Google's own published guidance asks for the same thing in plain language, so the advice holds either way." },
  { q: "Can AI content have information gain?", a: "Yes, once a person feeds it something new. A raw AI draft predicts the most likely text on a topic, which is close to the consensus of what already ranks. Give the model your own numbers, notes, examples and opinions, and the AI-assisted result can carry plenty of information gain." },
  { q: "Why can't you just prompt the model for unique insights?", a: "Because the model can only draw on what it has seen. Asked for an original insight, it produces the most plausible-sounding one, which tends to be the same for every writer who asks. Or it invents a number, which is worse. Original material has to come from you." },
  { q: "Does information gain matter for AI Overviews and answer engines?", a: "The research points that way. In the 2023 GEO study by Aggarwal and colleagues, adding quotations, statistics and cited sources were among the most effective ways to raise a source's visibility in generative engine answers, while keyword stuffing scored below the unedited baseline." },
  { q: "How can Content Trace help with information gain?", a: "Content Trace explains its Human Score with 32 signals in 8 sections. Signals such as Insider/Niche Knowledge and Generic vs Specific Language show where a draft still sounds like the consensus, which is usually where the information gain is missing. It can't supply the new material. That part is yours." },
];

export default function InformationGainSeoAiDrafts() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const a = { color: "var(--accent)", textDecoration: "underline" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-06-03" dateModified="2026-06-03" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "#a35f00", background: "rgba(196,122,0,0.08)", border: "1px solid rgba(196,122,0,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Analysis</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="June 3, 2026" readTime="8 min read" />

        <BlogHero src={HERO} alt="A lens over generic AI-style copy strikes out the phrase 'experts agree that' and highlights the writer's own numbers, showing that original material beats the consensus." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Information gain is what a page adds beyond the pages a searcher has already seen. Google patented a way to score it and asks for it in its helpful content guidance.",
              "A raw AI draft is built from the most likely text on a topic, so it lands close to the consensus of what already ranks. Its information gain is near zero by design.",
              "Prompting the model for \"unique insights\" doesn't fix this. The model can only return the most plausible insight, which is the one every other writer gets too.",
              "Original numbers, first-hand experience, a defended opinion and real worked examples are the four sources of gain a writer controls. None of them can be generated.",
              "Answer engines seem to reward the same material: in the GEO study, quotations, statistics and cited sources lifted visibility, while keyword stuffing did worse than doing nothing.",
              "AI-assisted writers should let the model handle the commodity layer and spend their own time on the gain layer.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>In June 2022, the US patent office granted Google LLC patent US11354342B2, titled &quot;Contextual estimation of link information gain.&quot; It was filed in October 2018. The abstract describes a score for &quot;additional information that is included in the document beyond information contained in documents that were previously viewed by the user.&quot;</p>

          <p style={p}>Read that again with an AI draft open in another tab. A score for what a page adds beyond what the reader has already seen. Most raw AI output adds almost nothing, and that&apos;s the whole problem with publishing it as is.</p>

          <p style={p}>The position here is simple. Information gain is the one SEO edge an AI-assisted writer can&apos;t outsource to the model, and it&apos;s the edge that matters most now that anyone can produce a competent draft in forty seconds. Use AI. Use it heavily. Just don&apos;t expect it to hand you the part of the page that only you can write.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>40%</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Top visibility boost reported in the 2023 GEO study of generative engines</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Quotations, statistics and cited sources were among the methods that worked. Keyword stuffing was not.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "#a35f00", background: "rgba(196,122,0,0.08)", border: "1px solid rgba(196,122,0,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Analysis</div>
          </div>
          </a>

          <h2 style={h2s}>What information gain means, and what the patent does not prove</h2>

          <p style={p}>The idea behind information gain is old and almost obvious. If a searcher has already read three pages about a topic, a fourth page that repeats them is worth little to that person. A fourth page with a new data point, a contrary argument or a method nobody else describes is worth a lot.</p>

          <p style={p}>Here&apos;s the insider caveat that SEO threads tend to skip. A granted patent tells you what a company&apos;s engineers researched and wanted to protect. It doesn&apos;t tell you whether the method runs in live ranking, or how much weight it carries. Google holds a very large number of search patents, and plenty of them describe systems that may never have shipped. Anyone who says &quot;Google ranks by information gain score&quot; with total confidence is selling something.</p>

          <p style={p}>The patent isn&apos;t really needed to make the case, though. Google&apos;s own guide to helpful, reliable, people-first content asks the same question in plainer words. Does the content provide &quot;original information, reporting, research, or analysis&quot;? Does it provide &quot;substantial value when compared to other pages in search results&quot;? Does it avoid &quot;simply copying or rewriting&quot; other sources? Does it show &quot;first-hand expertise and a depth of knowledge&quot;?</p>

          <p style={p}>That&apos;s information gain with the math taken out. Whether a patent score sits behind it or not, the published standard points in one direction.</p>

          <h2 style={h2s}>Why a raw AI draft starts near zero</h2>

          <p style={p}>A language model writes by predicting likely text. Ask it for a post on onboarding emails and it gives you the most probable post on onboarding emails, assembled from patterns across everything it has read. That includes the pages already ranking for the keyword. The output is a smooth average of the consensus.</p>

          <p style={p}>This is the source of a very specific bad feeling. You open the top five results for your keyword after drafting, and your draft could be any of them. Same subheadings. Same three tips. Same closing line about consistency being key. The draft is fine. It&apos;s also redundant before it&apos;s published, and that sinking realization tends to arrive at about 6 p.m. on deadline day.</p>

          <p style={p}>The obvious fix is to tell the model to be original. &quot;Include unique insights.&quot; &quot;Add a fresh perspective.&quot; It doesn&apos;t work, because the model can only reach for the most plausible insight available to it, and the most plausible insight is by definition the common one. A model asked for a unique take will cheerfully produce one. The same one, for everybody who asks. Push harder and it starts inventing statistics, which turns a redundancy problem into an accuracy problem.</p>

          <p style={p}>So the gain has to come from outside the model. That&apos;s simply how a prediction engine works, and it&apos;s no knock on AI. <a href="/blog/prompting-for-a-better-first-draft" style={a}>Prompting for a better first draft</a> helps a lot here, since a model given your notes and numbers writes around them. But somebody has to have the notes and numbers first.</p>

          <h2 style={h2s}>The four sources of information gain a writer controls</h2>

          <p style={p}>Strip it down and there are four kinds of material a raw AI draft can&apos;t produce on its own. Each one is something the writer or the company has and the rest of page one doesn&apos;t.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="A raw AI draft card labeled as the consensus of pages that already rank, plus four cards for the sources of information gain: original data, experience, opinion and worked specifics." caption="The model supplies the commodity layer. The four cards on the right are the parts only the writer can add." />

          <p style={p}>Original data comes first because it&apos;s the hardest to fake and the easiest to cite. It doesn&apos;t need to be a survey of thousands. A count from your own support tickets, a before-and-after from one campaign or a small benchmark you ran yourself all qualify. The bar is that nobody else has the number.</p>

          <p style={p}>First-hand experience is what happened when you tried the thing. The failed version counts as much as the successful one, and it often counts more, because every other page describes the method as if it always works.</p>

          <p style={p}>A defended opinion is a claim the top results don&apos;t make. Read page one, find the point they all agree on, and ask whether you actually agree. If you don&apos;t, say so and say why. That paragraph is information gain in its purest form, and it costs nothing but nerve.</p>

          <p style={p}>Worked specifics are real examples carried all the way through, instead of &quot;imagine a company that...&quot; illustrations. <a href="/blog/the-specificity-test" style={a}>The Specificity Test</a> covers this in depth. Take a hypothetical post about onboarding emails: the consensus version says &quot;send a welcome email right away.&quot; The version with gain shows the actual subject line a team used, what it replaced and what changed afterward. Only the second one teaches a reader something.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Content & Logic · Signal</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Insider/Niche Knowledge</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>A sentence with insider knowledge contains a detail a general reader wouldn&apos;t know to include. Consensus drafts rarely have one.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Before</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Google values original content, so it&apos;s important to create unique, high-quality articles that provide value to readers.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>After</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Google&apos;s information gain patent was filed in 2018 and granted in 2022. A patent shows research interest. It doesn&apos;t confirm a live ranking system.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>What answer engines reward when they quote a page</h2>

          <p style={p}>Search is no longer only ten blue links. AI Overviews and chat-style answer engines pick passages to quote, and the question of what gets picked is still young. One of the better early studies is &quot;GEO: Generative Engine Optimization&quot; by Pranjal Aggarwal and colleagues, published in 2023. The authors tested ways of editing source pages and measured how visible those sources became in generative engine responses.</p>

          <p style={p}>Their headline result: the right edits could boost visibility by up to 40%. The methods near the top were adding quotations from relevant sources, adding statistics and citing sources. In other words, adding evidence. Each of those is a form of information gain, or at least a signal of it.</p>

          <p style={p}>The surprising part sits at the bottom of the same table. Keyword stuffing, the oldest trick in SEO, scored below the unedited baseline. Twenty years of habit, outperformed by leaving the page alone. The authors also note that results vary across domains, so treat the study as a direction and not a recipe.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;Including citations, quotations from relevant sources, and statistics can significantly boost source visibility.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Aggarwal et al. · GEO: Generative Engine Optimization</cite>
          </div>

          <p style={p}>Put the patent, the guidance and the study side by side and they agree on the practical point. Pages that bring something new, with evidence attached, are the pages worth surfacing. A paraphrase of page one has nothing to quote that page one didn&apos;t already say better.</p>

          <h2 style={h2s}>How to add information gain on purpose</h2>

          <p style={p}>Information gain rarely shows up by accident in an AI-assisted workflow. It has to be planned before the model writes anything, then checked after. Here&apos;s a five-step loop that keeps AI doing what it&apos;s good at.</p>

          <Figure src={`/blog/${SLUG}/inline-2.webp`} alt="A five-step workflow: list what the top five results all say, write a gain list, let AI draft around it, mark claims any page could make, and replace them with your own evidence." caption="AI drafts the structure and the commodity layer. The writer owns the gain list and the final swap." />

          <p style={p}>Start by reading the top five results for the keyword and writing down what they all say. That overlap is the commodity layer. Your page needs to cover it briefly, because readers expect it, and then move past it.</p>

          <p style={p}>Next, write a gain list before you prompt. It can be short: one number you have, one thing you tried, one point where you disagree with page one, one real example. If the list is empty, that&apos;s useful to know. It means the post isn&apos;t ready to write yet, and no prompt will fix that.</p>

          <p style={p}>Then let the model draft around the gain list. Paste it into the prompt and ask the model to build the structure and the commodity sections, leaving clear slots for your material. This is where AI saves real hours, and there&apos;s no reason to feel guilty about it. <a href="/blog/google-is-fine-with-ai-assisted-content" style={a}>Google is fine with AI-assisted content</a> that helps people.</p>

          <p style={p}>After the draft comes back, mark every sentence that any competitor could have written word for word. The model can help with this pass if you ask it to flag generic claims. Finally, replace the marked sentences with your evidence, or cut them. A shorter page with real gain beats a longer page that repeats the top five.</p>

          <p style={p}>One honest limit: nobody outside Google knows how much weight information gain carries in any given query, and some queries reward the consensus answer because the consensus is correct. A page on how to boil an egg doesn&apos;t need a contrarian take. For most commercial and how-to topics, though, the crowded middle of page one is exactly where a page with something new can stand out. The <a href="/blog/the-generic-middle-of-ai-drafts" style={a}>generic middle of AI drafts</a> is usually where that new material belongs.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a: ans }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{ans}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For the full case that search engines accept AI-assisted work, read <a href="/blog/google-is-fine-with-ai-assisted-content" style={a}>Google Is Fine With AI-Assisted Content. Readers Are the Harder Audience</a>. <a href="/blog/prompting-for-a-better-first-draft" style={a}>Prompting for a Better First Draft</a> shows how to feed a gain list into the model. And <a href="/blog/the-specificity-test" style={a}>The Specificity Test</a> goes deeper on turning illustrations into real examples. A defended opinion is easier to keep when the voice is written down, as <a href="/blog/brand-voice-guides-ai-can-follow" style={a}>Brand Voice Guides That AI Can Actually Follow</a> explains.</p>

          <Sources items={[
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
            { label: "Google Patents: US11354342B2, Contextual estimation of link information gain (Google LLC)", href: "https://patents.google.com/patent/US11354342B2/en" },
            { label: "Aggarwal et al., GEO: Generative Engine Optimization (arXiv 2311.09735)", href: "https://arxiv.org/abs/2311.09735" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See where your draft still reads like page one.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
