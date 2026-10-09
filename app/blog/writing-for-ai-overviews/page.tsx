import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "writing-for-ai-overviews";
const TITLE = "Writing for AI Overviews: How Passages Get Quoted";
const DESCRIPTION = "How to rank in AI Overviews: Google asks for no special markup. What gets a passage quoted is the writing: answer first, named entities, self-contained.";
const HERO = `/blog/${SLUG}/hero.webp`;
const OG = `/og/blog/${SLUG}.jpg`; // 1200 x 630 social image
const HERO_ALT = "A magnifying lens over generic AI-style text, with the filler struck out and the plain fact that AI Overviews need no special schema highlighted.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "What Google documents about AI Overviews, and the writing habits that make a passage worth quoting.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-06-19",
    modifiedTime: "2026-06-19",
    authors: ["Colin H"],
    images: [{ url: OG, width: 1200, height: 630, alt: HERO_ALT, type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "How do you rank in AI Overviews?", a: "Google's documentation says there are no extra requirements: the page must be indexed and eligible to show in Search with a snippet. Past that, the usual SEO basics apply. What separates quoted pages from ignored ones is mostly the writing: a direct answer near the top, named entities instead of pronouns, and passages that make sense when lifted out alone." },
  { q: "Do you need special schema or an llms.txt file for AI Overviews?", a: "No. Google's AI features page states that you don't need new machine-readable files, AI text files or markup, and that there's no special schema.org structured data to add. Structured data still helps other search features, as long as it matches the visible text." },
  { q: "Does Google penalize AI content in AI Overviews?", a: "Google's documentation for AI features lists no rule against AI-assisted pages. Its helpful content guidance asks whether a page gives original information and substantial value compared with other results. A well-edited AI-assisted page can meet that bar. A raw AI draft that repeats the consensus usually can't." },
  { q: "Can you stop Google from using a page in AI Overviews?", a: "Yes, with the same preview controls that apply to regular snippets: nosnippet, data-nosnippet, max-snippet or noindex. Be careful with them. A data-nosnippet attribute left on a key paragraph hides exactly the text you'd want quoted." },
  { q: "How long should a quotable passage be?", a: "Google publishes no length. In practice, a passage that answers one question in two to four sentences, with the answer in the first sentence, is easy to lift. Length matters less than whether the passage still makes sense without the paragraph before it." },
  { q: "Can you see AI Overviews traffic in Search Console?", a: "Google says traffic from AI features is counted in the Search Console Performance report under the Web search type. The documentation doesn't describe a separate AI Overviews filter, so track the pages and queries where answer-style passages live and watch them over time." },
];

export default function WritingForAiOverviews() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const link = { color: "var(--accent)", textDecoration: "underline" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-06-19" dateModified="2026-06-19" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="June 19, 2026" readTime="8 min read" />

        <BlogHero src={HERO} alt={HERO_ALT} />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Google's own documentation says AI Overviews need no special markup, schema or AI text file. A page must be indexed and eligible for a snippet. That's the whole official list.",
              "Everything beyond that list is practice, not documented fact. Treat any vendor who promises a guaranteed AI Overview placement with suspicion.",
              "The passages that get quoted tend to answer one question in the first sentence and still make sense when lifted out of the page.",
              "Named entities beat pronouns. A paragraph that starts with \"This\" or \"As mentioned above\" can't stand alone, so it's hard to quote.",
              "AI drafts already produce answer-shaped structure. What they can't supply is the specific detail that makes one answer worth citing over fifty similar ones.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>Google&apos;s page on AI features in Search, last updated in December 2025, contains one sentence that a whole cottage industry would prefer you skip: &quot;There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary.&quot; A few lines later it adds that you don&apos;t need new machine-readable files, AI text files or markup, and that there&apos;s no special schema.org structured data to add.</p>

          <p style={p}>That&apos;s awkward for anyone selling an &quot;AI Overview schema package.&quot;</p>

          <p style={p}>It&apos;s good news for writers, though. If no technical trick gets a page quoted, the lever left is the one writers actually control: the passage itself. This post covers what Google officially says, then the writing habits that tend to separate the paragraphs AI answers lift from the ones they skip. The second part is practice, and it&apos;s labeled that way.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>0</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Special files, markup or schema Google requires for AI Overviews</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Per Google Search Central. The page has to be indexed and snippet-eligible. The rest is the writing.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Explainer</div>
          </div>
          </a>

          <h2 style={h2s}>What does Google officially say about ranking in AI Overviews?</h2>

          <p style={p}>Less than most people expect, and all of it is short. According to Google Search Central, a page needs to be indexed and eligible to be shown in Google Search with a snippet. There are no additional technical requirements, and indexing and serving aren&apos;t guaranteed. The best practices Google lists are ordinary SEO: allow crawling, use internal links, give a good page experience, keep important content in text form, and make structured data match the visible text.</p>

          <p style={p}>Two mechanics in that documentation matter for writers. First, AI Overviews and AI Mode may use a technique Google calls query fan-out, issuing multiple related searches across subtopics to build one response. A single answer can draw on many pages, each covering one slice of the question. Second, AI Overviews appear only when Google&apos;s systems decide they add something to classic Search. Plenty of queries never trigger one.</p>

          <p style={p}>Google has also made a traffic claim since launch. In the May 2024 announcement, Elizabeth Reid, VP of Search, wrote that links included in AI Overviews get more clicks than if the page had appeared as a traditional web listing for that query. The current AI features page says clicks from AI Overviews are higher quality, with people spending more time on the site. Those are Google&apos;s statements about Google&apos;s product. Read them as such.</p>

          <p style={p}>One insider detail worth knowing: AI features use the same preview controls as regular snippets. A <code>data-nosnippet</code> attribute, a low <code>max-snippet</code> value or a <code>nosnippet</code> rule limits what can appear. Teams sometimes add <code>data-nosnippet</code> to a pricing block or a disclaimer for legal reasons and forget it&apos;s there. If that block holds the clearest answer on the page, it&apos;s off the table.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="A two-column table: what Google documents about AI Overviews (indexed, snippet-eligible, no special schema, normal SEO) next to what is only practice (answer first, named entities, self-contained passages)." caption="The left column is documented by Google. The right column is editorial practice, which is where writers have room to work." />

          <h2 style={h2s}>Why do some passages get quoted and others don&apos;t?</h2>

          <p style={p}>Google doesn&apos;t publish a passage-selection rubric, so nobody outside Google can give a full answer. What follows is practice: patterns that line up with how Google describes the system and with how featured snippets have always behaved. Google&apos;s featured snippets documentation makes the same point bluntly. Asked how to mark a page as a featured snippet, the answer is: &quot;You can&apos;t.&quot; Automated systems decide.</p>

          <p style={p}>If fan-out searches subtopics, each subtopic needs a passage that answers it cleanly. Picture the system holding one paragraph from your page and nothing else. Does that paragraph say what it&apos;s about? Does it contain the answer, or only point toward it? Does it lean on a sentence two paragraphs up?</p>

          <p style={p}>The obvious fix is to make every paragraph shorter. It doesn&apos;t work, because short isn&apos;t the same as self-contained. A 30-word paragraph that opens with &quot;This is why&quot; is just as stuck to its neighbors as a 200-word one. The real fix is to make each paragraph carry its own subject and its own answer, at whatever length the idea needs.</p>

          <p style={p}>Three habits do most of the work. Put the answer in the first sentence, then the detail. Name the subject instead of pointing to it. Keep the qualifier inside the same passage as the claim, so a lifted quote doesn&apos;t become a wrong one. That last habit is the one people skip, and it&apos;s the one that protects you when your words show up somewhere you didn&apos;t write them.</p>

          {/* Before/After */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", background: "var(--bg-card)", margin: "32px 0" }}>
            <div style={{ padding: "10px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Hypothetical help article · Same question, two passages
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "14px 18px", background: "rgba(236,72,96,0.03)", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>Hard to quote</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>&quot;This is one of the most common questions users ask. While there are several approaches, it depends on your setup. As mentioned above, the import tool can help in many cases.&quot;</p>
              </div>
              <div style={{ padding: "14px 18px", background: "rgba(87,13,158,0.03)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>Easy to quote</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>&quot;Yes. The (hypothetical) BakeryOS importer reads recipes from a CSV file with one ingredient per row. Files over 500 rows must be split before upload.&quot;</p>
              </div>
            </div>
          </div>

          <p style={p}>The left passage isn&apos;t wrong. It just never answers the question, and it never says which product it means. The right one could be pasted into any AI answer and still be true and complete, including the limit that keeps a reader out of trouble.</p>

          <h2 style={h2s}>How do you write an answer-first passage?</h2>

          <p style={p}>Start with the heading. Google&apos;s helpful content guidance asks whether the main heading or page title gives a descriptive, helpful summary of the content. Question-shaped H2s do that well, because they match how people type and speak queries. &quot;Pricing&quot; tells a reader very little. &quot;How much does the Pro plan cost per seat?&quot; tells them, and the system, exactly which question the next paragraph answers.</p>

          <p style={p}>Then answer it in the first sentence under the heading. Yes, no, a number, a name, a date. The context comes second. Writers trained on essays find this physically uncomfortable, because it feels like giving away the ending in the first line. It is. That&apos;s the job.</p>

          <p style={p}>After the answer, add the one detail that makes the passage yours: the threshold, the exception, the version number, the case where the answer flips. Then stop. A passage that answers, qualifies and stops is easier to lift than one that wanders into the next subtopic.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--accent)", background: "var(--accent-light)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;A passage that answers, qualifies and stops is easier to lift than one that wanders into the next subtopic.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Content &amp; Logic Signal</cite>
          </div>

          <h2 style={h2s}>Why do named entities matter more than keywords?</h2>

          <p style={p}>A keyword tells a system what a page is about. An entity tells it what a sentence is about. Pronouns erase entities. &quot;It updates daily&quot; is meaningless out of context. &quot;The Search Console Performance report updates daily&quot; can stand anywhere. That&apos;s the reason to repeat the name of the thing more often than a style guide from 2005 would like.</p>

          <Figure src={`/blog/${SLUG}/inline-2.webp`} alt="An annotated passage showing four parts of a quotable answer: a question heading, a direct answer sentence, a named entity in place of a pronoun, and a qualifier kept in the same passage." caption="Four parts of a passage that still makes sense when lifted out of the page." />

          <p style={p}>The same goes for numbers and sources. A statistic that floats free (&quot;studies show 70% of users...&quot;) is weak on a page and weaker in an answer, where it arrives with no context at all. Put the source in the sentence. Name the year. If the number comes from internal data, say so in the same breath.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>Word Choice &amp; Phrasing · Signal</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Generic vs Specific Language</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>Generic nouns (&quot;the tool&quot;, &quot;your platform&quot;, &quot;many businesses&quot;) are the quickest way to make a passage unquotable. Specific nouns carry their own context.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Before</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;The tool can help you see how this traffic is performing.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>After</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Google counts AI Overviews traffic in the Search Console Performance report, under the Web search type.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Where do AI drafts help, and where do they fall short?</h2>

          <p style={p}>Here&apos;s the surprising part. The format AI-assisted writers worry about most is the part a model handles best. Ask any capable model for a question heading and a direct answer and you&apos;ll get one in seconds, neatly structured. Answer-first structure is cheap now.</p>

          <p style={p}>That&apos;s exactly why it stopped being enough. When fan-out pulls passages for a subtopic, it finds many pages that answer the same question in nearly the same words, because many of them came from similar prompts. Fifty versions of the consensus give a system no reason to prefer yours. The passage that wins usually has something the others lack: a real threshold, a named exception, a number from actual work, an opinion with a reason attached. Google&apos;s helpful content guidance asks for this directly, with questions about original information and &quot;substantial value when compared to other pages in search results.&quot;</p>

          <p style={p}>There&apos;s a particular irritation in finding an AI answer that quotes a competitor saying exactly what your page says, only plainer and three paragraphs higher. That&apos;s usually a structure problem, and it&apos;s fixable. Losing to a page that simply knows more is a content problem, and no amount of formatting closes that gap.</p>

          <p style={p}>So use the draft for what it&apos;s good at. Let it propose the question headings and the first-pass answers. Then do the human part: check every answer for accuracy, add the detail only your team knows, name the entities, and keep the caveat next to the claim. Content Trace explains its score with 32 signals in 8 sections, and the specificity and insider-knowledge signals are a fair proxy for whether a passage has anything worth quoting. Pretty formatting won&apos;t move them. Real information will.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For Google&apos;s wider stance on AI-assisted pages, read <a href="/blog/google-is-fine-with-ai-assisted-content" style={link}>Google Is Fine With AI-Assisted Content. Readers Are the Harder Audience</a>. <a href="/blog/the-specificity-test" style={link}>The Specificity Test</a> covers how to find the detail that makes a passage worth quoting. And <a href="/blog/the-generic-middle-of-ai-drafts" style={link}>The Generic Middle</a> explains why AI drafts lose their specifics right after the intro, which is where most answer passages live. A passage only gets quoted if it says something new, which is the point of <a href="/blog/information-gain-seo-ai-drafts" style={link}>Information Gain</a>, and <a href="/blog/add-real-expertise-to-ai-drafts" style={link}>How to Add Real Expertise to an AI Draft</a> shows how to supply that material honestly.</p>

          <Sources items={[
            { label: "Google Search Central: AI features and your website", href: "https://developers.google.com/search/docs/appearance/ai-features" },
            { label: "Google Search Central: Featured snippets and your website", href: "https://developers.google.com/search/docs/appearance/featured-snippets" },
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
            { label: "Google, The Keyword: Generative AI in Search: Let Google do the searching for you (May 14, 2024)", href: "https://blog.google/products/search/generative-ai-google-search-may-2024/" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See which passages in your draft still lean on generic language.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
