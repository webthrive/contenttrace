import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "ai-detection-and-seo";
const TITLE = "Does Google Penalize AI Content? What Search Actually Rewards";
const DESCRIPTION = "Google rewards helpful, people-first pages however they are made. What that means for AI-assisted writers, and how to meet the bar in search.";
const HERO = `/blog/${SLUG}/hero.webp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "Google's policies target unhelpful pages made at scale, not the tools behind them. How AI-assisted writers meet the people-first bar.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-04-07",
    modifiedTime: "2026-10-07",
    authors: ["Colin H"],
    images: [{ url: HERO, width: 1600, height: 900, alt: "A lens over generic SEO filler strikes out a keyword phrase and highlights first-hand detail and a named source" }],
  },
  twitter: { card: "summary_large_image", images: [HERO] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "Does Google penalize AI content?", a: "Not for being AI-assisted. Google's guidance says generative AI can be useful for research and for adding structure to original content. What its spam policies target is scaled content abuse: many pages made mainly to manipulate rankings without adding value, whether automation, people or both produced them." },
  { q: "Does Google use AI detectors to rank pages?", a: "Google hasn't said it does, and its published policies judge helpfulness and intent, not authorship. A detector score never appears in Search Console. The useful overlap is indirect: the passages a detector flags as generic are often the same passages a reader finds thin." },
  { q: "Should AI-assisted content be disclosed?", a: "Google's people-first guidance says AI or automation disclosures are useful where a reader might reasonably wonder how content was made. For most articles, a clear byline and an honest about page matter more. Google Merchant Center has stricter rules for AI-generated product data and images." },
  { q: "What is scaled content abuse?", a: "Google defines it as generating many pages for the primary purpose of manipulating search rankings and not helping users. One listed example is using generative AI tools to generate many pages without adding value for users. The method is not the offense. The missing value is." },
  { q: "What should an editor add to an AI draft before publishing?", a: "A position the writer will defend, at least one detail from first-hand experience, named and linked sources for specific claims, and a fact-check of every statement. Google also asks site owners to review AI-written metadata such as titles, meta descriptions, structured data and alt text." },
  { q: "Can a high Human Score guarantee rankings?", a: "No. No tool can guarantee rankings or AI citations. A Content Trace score is a diagnostic that shows where a draft reads as generic, which is useful for editing, not a forecast of where a page will rank." },
];

export default function AiDetectionAndSeo() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-04-07" dateModified="2026-10-07" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "#a35f00", background: "rgba(196,122,0,0.08)", border: "1px solid rgba(196,122,0,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Analysis</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="April 7, 2026" readTime="7 min read" updated="October 7, 2026" />

        <BlogHero src={HERO} alt="A lens over generic, keyword-stuffed SEO copy strikes out a filler phrase and highlights the first-hand detail and named source that search rewards." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Google doesn't penalize writing for being AI-assisted. It rewards helpful, people-first pages, and its spam policy targets scaled pages made to manipulate rankings, whoever or whatever made them.",
              "The correlation between AI drafts and lost rankings is real. The cause is thin, generic pages published at volume, which AI makes cheap to produce.",
              "E-E-A-T rewards things a raw AI draft can't supply on its own: first-hand experience, named sources and an accountable person behind the claims.",
              "Google's own advice for AI-assisted pages is practical: fact-check everything, review AI-written metadata, and explain how content was made where readers would want to know.",
              "Running drafts through a detector to \"pass\" misses the point. Use a signal breakdown to find generic passages, then add what only a person can add.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>When Google finished rolling out its March 2024 core update, it reported that low-quality, unoriginal content in search results had dropped by 45%. In the same announcement, it rewrote its spam policy on mass-produced pages. The old rule talked about automation. The new one covers producing content at scale to boost rankings, &quot;whether automation, humans or a combination are involved.&quot;</p>

          <p style={p}>That one clause answers most of the panic about AI and SEO. Google stopped caring how a page was produced, at least as a rule, because, as the announcement admits, it had become harder to tell. What it cares about is whether the page was made to help someone or to catch a query.</p>

          <p style={p}>The official answer is clean, then: helpful, reliable, people-first content is rewarded however it was made. It&apos;s also honest. The nuance sits in what &quot;helpful&quot; demands, and that&apos;s where a lot of content teams are still making expensive mistakes.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
              <div style={{ fontSize: "42px", fontWeight: 700, color: "#a35f00", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>45%</div>
              <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
              <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Less low-quality, unoriginal content in Google results after the March 2024 core update</strong>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Google&apos;s own figure. The target was unoriginal pages, not AI-assisted ones.</p>
              </div>
              <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "#a35f00", background: "rgba(196,122,0,0.08)", border: "1px solid rgba(196,122,0,0.25)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Analysis</div>
            </div>
          </a>

          <h2 style={h2s}>What Google actually penalizes, and what it doesn&apos;t</h2>

          <p style={p}>Google&apos;s spam policies define scaled content abuse as many pages &quot;generated for the primary purpose of manipulating search rankings&quot; rather than helping users. The first example on the list is &quot;using generative AI tools or other similar tools to generate many pages without adding value for users.&quot; Read that sentence slowly. The offense is the missing value. The tool is incidental.</p>

          <p style={p}>Google&apos;s page on generative AI says it outright: AI &quot;can be particularly useful when researching a topic, and to add structure to original content.&quot; Since March 2024, the old helpful content system has been part of Google&apos;s core ranking systems, so the question of helpfulness now runs through every core update instead of arriving as a separate event.</p>

          <p style={p}>So where does the correlation come from? The qualities that make a page rank well (depth, specificity, demonstrated experience, an original angle) are the same qualities a raw AI draft tends to lack. Unedited output published at volume hits the policy on both counts. A piece that started as an AI draft but was rewritten by someone with real experience, who added first-hand knowledge, named sources and an actual point of view, sits in a completely different category.</p>

          <p style={p}>The obvious fix is to run every draft through an AI detector and publish only the ones that &quot;pass.&quot; It doesn&apos;t work, because Google isn&apos;t grading the detector&apos;s question. A detector score never shows up in Search Console. A fully human page can be thin, and an AI-assisted page can be the best answer on the web. A signal breakdown is useful for a different reason: it points at the passages that read as generic, which tend to be the same passages a reader finds empty.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="A flow showing that Google's scaled content policy applies whether pages are made by automation, people or both, and the deciding test is whether each page adds value for users." caption="Google's scaled content rule is method-neutral. The value test is the one that decides." />

          <h2 style={h2s}>The E-E-A-T gap an AI draft can&apos;t close on its own</h2>

          <p style={p}>Google describes its quality framework as E-E-A-T: experience, expertise, authoritativeness and trustworthiness. Its people-first guidance adds a line that many SEO summaries skip: &quot;Of these aspects, trust is most important.&quot; Each letter maps to something a raw AI draft struggles to provide without help.</p>

          <h3 style={h3s}>Experience: the signal AI can&apos;t have</h3>

          <p style={p}>Experience means first-hand contact with the subject. You used the product, visited the place, tried the approach and watched it fail. Google&apos;s self-assessment asks whether content &quot;clearly demonstrate[s] first-hand expertise and a depth of knowledge.&quot; A model hasn&apos;t done any of those things.</p>

          <p style={p}>Pages that show real experience tend to contain specific, slightly imperfect details: the thing that didn&apos;t work as expected, the workaround, the date and context. Those are the same details rubric-based tools read as signs of a person thinking. Their absence registers as weak experience and as generic writing at the same time.</p>

          <h3 style={h3s}>Expertise: present in the draft, but unaccountable</h3>

          <p style={p}>An AI draft can sound expert on almost any topic. It synthesizes well and usually gets the facts roughly right. What it can&apos;t do is stand behind them. There&apos;s no credential, no professional history, nobody who could be wrong and would care. Google&apos;s &quot;Who&quot; question, whether readers can tell who created the content, exists for exactly this gap. A byline that links to a real author page is the cheapest fix.</p>

          <h3 style={h3s}>Trustworthiness: the sourcing problem</h3>

          <p style={p}>AI drafts make claims with confident authority and support them with vague gestures: &quot;studies show,&quot; with no study linked; &quot;experts agree,&quot; with no expert named. That isn&apos;t deliberate vagueness. The model works from patterns, not from a library card.</p>

          <p style={p}>Trust requires that specific claims be backed by named, linkable sources, and Google&apos;s generative AI page says it is &quot;critical to manually factcheck and review all AI-generated content.&quot; Here&apos;s a detail most teams miss: the same page asks for the same review of AI-written metadata, including title elements, meta descriptions, structured data and image alt text. Plenty of carefully edited articles still ship with a meta description nobody read.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid #a35f00", background: "rgba(196,122,0,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;Of these aspects, trust is most important.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Google Search Central · Creating helpful, reliable, people-first content</cite>
          </div>

          <h2 style={h2s}>What the sites hit hardest had in common</h2>

          <p style={p}>In Web Thrive audits of sites that lost organic visibility after recent core updates, the same patterns kept showing up. The content covered topics broadly without going deep, the shape you get when a model is asked for &quot;a comprehensive guide to X&quot; with no angle and no real knowledge behind the prompt. Sourcing was missing. The language hedged to avoid committing to anything. Call it constructed comprehensiveness: lots of headings, lots of coverage, nothing specific underneath.</p>

          <p style={p}>Watching a traffic graph fall off a ledge the week a core update lands is a particular kind of dread, and it&apos;s worse when the pages in question took almost no effort to make. Sites that used AI surgically, for first drafts that went through real editing or for narrow jobs like outlines and formatting, came through far better. What separated the two groups was human judgment applied on top of the draft.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#a35f00", fontFamily: "var(--font-mono)" }}>Voice &amp; Perspective · 14% weight</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Opinion Strength</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>AI drafts keep a hedged, broadly agreeable position from start to finish. A real viewpoint, even one that might be wrong, gives readers something to trust or argue with.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>AI draft</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;AI-generated material can be effective when used strategically alongside quality human oversight and editorial processes.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Edited</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Most raw AI drafts shouldn&apos;t be published as is. They&apos;re usually accurate. They&apos;re also hollow in a way that&apos;s hard to define and easy to feel.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>How AI-assisted writers meet the bar</h2>

          <p style={p}>None of this argues for avoiding AI. It argues for using it the way Google&apos;s own guidance describes: as a research and structure tool, with a person responsible for what ships. In practice that comes down to a short editing routine.</p>

          <p style={p}>Start with the &quot;Why.&quot; Google calls it &quot;perhaps the most important question to answer about your content.&quot; If the honest answer is &quot;to rank for this keyword,&quot; no amount of editing will save the page. If the answer is a reader with a real problem, keep going.</p>

          <p style={p}>Then add what the draft can&apos;t: one detail from first-hand experience, a position the writer will defend, and a named source for every specific claim. Fact-check every sentence and every piece of metadata. Put the main answer near the top, which helps readers skim and helps AI answer engines quote the page cleanly. Where readers would reasonably wonder how a page was made, say so. Google&apos;s people-first page notes that AI or automation disclosures are useful in exactly those cases.</p>

          <Figure src={`/blog/${SLUG}/inline-2.webp`} alt="A checklist mapping what Google rewards to the edit that delivers it: experience to a first-hand detail, expertise to a real byline, trust to named sources and a fact-check, people-first to a clear reader and answer up top." caption="Each part of E-E-A-T maps to one concrete edit an AI-assisted writer can make." />

          <p style={p}>A tool like <a href="/" style={{ color: "var(--accent)", textDecoration: "underline" }}>Content Trace</a> fits at the end of that routine. Its report explains results with 32 signals in 8 sections, so a low Content &amp; Logic or Voice &amp; Perspective section shows where the draft is still generic. Fix those passages and the page gets better for readers first. Search tends to follow.</p>

          <h2 style={h2s}>The question nobody is asking enough</h2>

          <p style={p}>&quot;Does Google penalize AI?&quot; is an understandable question, and slightly backwards. The better one is this: does the page show that a knowledgeable person engaged with the topic? If yes, the tools used to produce it matter very little. If no, AI was never the real problem. Nobody&apos;s judgment is visible in the text, and judgment is what search rewards.</p>

          <p style={p}>No score guarantees rankings, and no tool can promise an AI citation. But a draft with a real position, at least one sourced claim and a detail only an insider would know is a better page by every measure Google publishes. That&apos;s the bar. AI-assisted writers clear it every day.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For the editing routine in full, <a href="/blog/how-to-humanize-ai-content" style={{ color: "var(--accent)", textDecoration: "underline" }}>How to Humanize AI Content</a> walks through six passes from draft to publishable page. <a href="/blog/why-ai-writing-sounds-different" style={{ color: "var(--accent)", textDecoration: "underline" }}>Why AI Writing Sounds Different</a> explains why readers tune out unedited drafts. And <a href="/blog/how-ai-text-detection-works" style={{ color: "var(--accent)", textDecoration: "underline" }}>How AI Text Detection Actually Works</a> covers what a score can and can&apos;t tell you.</p>

          <Sources items={[
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
            { label: "Google Search Central: Spam policies for Google web search (scaled content abuse)", href: "https://developers.google.com/search/docs/essentials/spam-policies" },
            { label: "Google Search Central: Guidance on using generative AI content on your website", href: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" },
            { label: "Google Search blog (March 2024): Tackling spammy, low-quality content on Search", href: "https://blog.google/products/search/google-search-update-march-2024/" },
            { label: "Google Search Central: A guide to Google Search ranking systems", href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>Find the generic passages in your next draft before you publish.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
