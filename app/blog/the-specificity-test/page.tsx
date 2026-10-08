import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "the-specificity-test";
const TITLE = "The Specificity Test: The Detail That Makes Writing Memorable";
const DESCRIPTION = "AI drafts are accurate and generic. The fastest way to improve one is the specificity test: find where specific, inconvenient detail is missing and add it.";
const HERO = `/blog/${SLUG}/hero.webp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "Specific, inconvenient detail is what separates writing people remember from generic AI drafts. Here is how to test for it and add it.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-04-14",
    modifiedTime: "2026-10-07",
    authors: ["Colin H"],
    images: [{ url: HERO, width: 1600, height: 900, alt: "A lens over generic AI text strikes out a vague claim and highlights an exact number and date" }],
  },
  twitter: { card: "summary_large_image", images: [HERO] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "What is the specificity test?", a: "It's a quick editing check: read a draft and mark every example, number and claim that could appear unchanged in a competitor's article. Those marks show where the piece needs a real detail, such as an exact figure, a named source, a date or a complication that actually happened." },
  { q: "Why does AI content fail the specificity test so often?", a: "A language model reaches for the most typical example for a claim, because typical is what its training rewards. Typical examples fit the point perfectly and say nothing new. Real details come from memory, records and sources, which the model doesn't have for your work." },
  { q: "Can you prompt an AI model to be more specific?", a: "Partly. Better prompts help with structure and focus. But when a model is asked for specifics it has no access to, it tends to invent precise-looking numbers and tidy case studies. That fake precision is worse than plain vagueness, so the real details still have to come from the writer." },
  { q: "Are round numbers always a bad sign?", a: "No. Some real numbers are round. The problem is an unsourced figure that looks exact, or a vague quantity like \"significantly improved\" standing in for a number nobody checked. If the number came from a report you opened, keep it and name the report." },
  { q: "Does specific detail help SEO and AI answers too?", a: "Yes. Google's guidance on helpful content asks whether a page offers original information and first-hand expertise. Specific, sourced details are the visible evidence of both, and they give AI answer engines self-contained facts worth quoting." },
  { q: "How does Content Trace help with specificity?", a: "Content Trace explains its score with 32 signals in 8 sections. Signals such as Generic vs Specific Language and Insider/Niche Knowledge point to the passages that still read as generic, so you know where to add a real detail first." },
];

export default function PostTheSpecificityTest() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };
  const a = { color: "var(--accent)", textDecoration: "underline" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-04-14" dateModified="2026-10-07" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="April 14, 2026" readTime="7 min read" updated="October 7, 2026" />

        <BlogHero src={HERO} alt="A lens over dim, generic AI text strikes out a vague claim in coral and highlights an exact number and date in violet, showing what specific detail adds." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "The fastest test for a generic draft is to look for specific, inconvenient detail, the kind that doesn't fully serve the argument but could only come from someone who was there.",
              "AI drafts optimize for illustrative clarity. Every example fits the point exactly, and that tidiness is what makes them forgettable.",
              "Concrete text is easier to understand, more interesting and better remembered. A 2000 study in the Journal of Educational Psychology found concreteness was the best predictor of all three.",
              "Fake precision, like an unsourced \"73% of marketers\", is worse than honest vagueness, because it implies research that never happened.",
              "The test is an editing tool. Use it on your own AI-assisted drafts to find exactly where a real detail needs to go.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>In a study published in the Journal of Educational Psychology in 2000, Mark Sadoski, Ernest Goetz and Maximo Rodriguez had undergraduates read four kinds of text: persuasive essays, expository passages, literary stories and narratives. Across all of them, concrete text was recalled better than abstract text. The authors called concreteness &quot;overwhelmingly the best predictor&quot; of how understandable, interesting and memorable a passage was.</p>

          <p style={p}>That finding is twenty-six years old. It explains almost everything wrong with the average AI draft.</p>

          <p style={p}>AI writing is rarely wrong. It&apos;s comprehensive, accurate and covers a topic from several reasonable angles. It is also almost entirely generic, and the genericness has a texture an experienced editor learns to spot in a paragraph or two. The examples are too perfect. The anecdotes are too illustrative. The numbers are either missing or suspiciously round.</p>

          <p style={p}>The cause is structural. A language model writes by predicting what comes next from patterns in its training data. When it needs an example, it reaches for the most representative one: the example that best fits the pattern of &quot;example that supports this kind of claim.&quot; A person does the opposite. A person asks what actually happened, in a project, a report or a case they read closely, and writes that down.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>4</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Marks of real specificity to check in every draft</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Odd numbers, inconvenient details, named sources and time stamps. Each one is evidence that a person was there.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Explainer</div>
          </div>
          </a>

          <h2 style={h2s}>Why illustrative clarity is a warning sign</h2>

          <p style={p}>The clearest mark of a generated example is illustrative clarity: the example fits the point so perfectly that it couldn&apos;t have come from real experience. Real memories don&apos;t behave that way. Real projects are messy. The outcome was more complicated than the lesson, and the detail that sticks is usually the one that doesn&apos;t quite serve the argument.</p>

          <p style={p}>Take two hypothetical versions of the same story. Version one: &quot;A content team implemented an AI review process and saw quality scores improve significantly over the following quarter.&quot; It happened, it worked, it proved the point. Version two: &quot;A B2B SaaS team publishing about 12 articles a month added a human review step for voice and sourcing. Two months later quality was up. Output was down, which started its own argument, and it&apos;s still not clear they&apos;d make the same call again.&quot;</p>

          <p style={p}>The second version is harder to read. The lesson is less clean. There&apos;s tension that never resolves. That&apos;s what writing from memory looks like, and readers notice it even when they can&apos;t say why. Careful editors notice it too, and so do the voice and logic signals in tools like <a href="/" style={a}>Content Trace</a>.</p>

          <h2 style={h2s}>The four marks of authentic specificity</h2>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Four cards compare a generic AI-style phrase with its specific version: an exact number, an inconvenient detail, a named source and a time stamp." caption="Each mark replaces a phrase that could appear in any article with one that could only appear in this one." />

          <h3 style={h3s}>Numbers that are oddly precise</h3>

          <p style={p}>People who ran the report remember the actual number. &quot;Open rates were sitting at 23% when the subject line test started&quot; beats &quot;open rates in a typical range.&quot; Odd precision is a trace of real measurement: somebody looked at a dashboard and the number stuck.</p>

          <p style={p}>AI drafts go one of two ways. Either vague quantities (&quot;significantly improved&quot;, &quot;a substantial share&quot;) or confident figures (&quot;70% of marketers report...&quot;) that nobody can source. Both read differently from a real data point someone actually looked at.</p>

          <h3 style={h3s}>Details that don&apos;t fully serve the argument</h3>

          <p style={p}>This is the mark that shows up most in strong human writing. Some detail is there because it&apos;s true, and the writer couldn&apos;t leave it out. A caveat that complicates the takeaway. A follow-up thought that weakens the previous claim a little. An aside that&apos;s interesting and slightly off topic.</p>

          <p style={p}>AI drafts don&apos;t do this. Every detail earns its place by supporting the point, and the structure is efficient in a way human thinking never is. When every element fits together too neatly, the piece reads as assembled rather than remembered.</p>

          <h3 style={h3s}>Named sources and exact attribution</h3>

          <p style={p}>Real research produces named citations: the study, the authors, the year, a link. &quot;Research suggests&quot; is doing a lot of unpaid work in most AI drafts. Models tend to cite the shape of evidence (&quot;studies show&quot;, &quot;experts agree&quot;) because they reproduce how claims are usually supported, not because they recall a specific source. A named, linkable citation is a strong sign that someone did the research, or at least did the editorial work of checking it.</p>

          <h3 style={h3s}>Time and place stamps</h3>

          <p style={p}>Real events happen on a date, in a tool version, in a specific meeting. &quot;After the March pricing change&quot; or &quot;in the second sprint after launch&quot; anchors a claim in time. Generic drafts float in an eternal present where everything is &quot;today&apos;s landscape&quot; and nothing ever happened on a Tuesday.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Word Choice & Phrasing</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Generic vs Specific Language</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>Examples drawn from memory carry context that doesn&apos;t serve the argument: the complication, the caveat, the part that didn&apos;t work. Constructed examples fit the point exactly. (Both lines below are hypothetical.)</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Generic</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;One marketing team implemented this strategy and saw a 40% improvement in engagement within 60 days.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Specific</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;A four-person fintech content team saw engagement rise about 35% over two months. It sounded great until they noticed most of the gain came from a segment that never converted.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Fake precision is worse than vagueness</h2>

          <p style={p}>One failure mode deserves its own name: content that looks specific and isn&apos;t. Statistics without sources, quotes nobody can verify, and case studies vague enough to describe any company in any industry, all dressed up as evidence.</p>

          <p style={p}>The obvious fix for a generic draft is to tell the model to &quot;add specific examples and data.&quot; It doesn&apos;t work, because the model has no access to your data. It produces numbers that look measured (a 37% lift, a 4.2x return) and case studies with tidy arcs. The draft gets more specific on the surface and less true underneath. That&apos;s the surprising part: the most confident-looking number in a draft is often the one most likely to be invented.</p>

          <p style={p}>Any editor who has chased one of those figures knows the feeling. It&apos;s a particular sinking frustration, twenty minutes into searching for the source of a perfect-looking statistic, when it becomes clear there never was one. Honest vagueness at least doesn&apos;t pretend. Fake precision implies sourcing that doesn&apos;t exist, and readers who catch it stop trusting everything else on the page.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;The most confident-looking number in an AI draft is often the one most likely to be invented.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Content & Logic Signal</cite>
          </div>

          <h2 style={h2s}>Using the specificity test on your own drafts</h2>

          <p style={p}>The useful thing about this test is that it works on your own writing first. Before publishing an AI-assisted draft, read it once with a single question: could this sentence appear, unchanged, in a competitor&apos;s article? Mark every example that&apos;s too clean, every number sourced to &quot;industry data&quot;, every case study that could describe anyone. Those marks are the to-do list.</p>

          <p style={p}>The additions don&apos;t need to be dramatic. A date. A named source you actually opened. A complicating detail from a real project. The admission that an approach didn&apos;t work at first. Small intrusions of real experience are what make content worth reading, and they line up with what search engines ask for. Google&apos;s guidance on helpful content asks whether a page provides &quot;original information, reporting, research, or analysis&quot; and whether it shows first-hand expertise. Specific detail is the visible proof of both.</p>

          <p style={p}>There&apos;s something almost elegant in that overlap. The details that make writing memorable to a reader are the same details that move a <a href="/" style={a}>Content Trace</a> report toward human, section by section. Which suggests the best use of any writing score has little to do with judging other people&apos;s work. It&apos;s a fast way to see what your own draft is still missing.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a: ans }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{ans}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For a full editing workflow built around this idea, <a href="/blog/how-to-humanize-ai-content" style={a}>How to Humanize AI Content</a> puts specificity at pass three of six. <a href="/blog/why-ai-writing-sounds-different" style={a}>Why AI Writing Sounds Different</a> covers the patterns behind generic drafts, and <a href="/blog/ai-detection-and-seo" style={a}>AI Detection and SEO</a> explains how Google treats AI-assisted pages.</p>

          <Sources items={[
            { label: "ERIC: Sadoski, Goetz and Rodriguez (2000), Engaging Texts: Effects of Concreteness on Comprehensibility, Interest, and Recall in Four Text Types", href: "https://eric.ed.gov/?id=EJ619358" },
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>Find the generic passages in your next draft before readers do.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
