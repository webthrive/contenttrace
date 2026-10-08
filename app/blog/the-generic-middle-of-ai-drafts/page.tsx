import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "the-generic-middle-of-ai-drafts";
const TITLE = "The Generic Middle: Why AI Drafts Sag After the Intro";
const DESCRIPTION = "AI drafts usually open well and go flat by section two. Why the middle sags, how readers scan past it, and how to rebuild it so the page earns the scroll.";
const HERO = `/blog/${SLUG}/hero.webp`;
const OG = `/og/blog/${SLUG}.jpg`; // 1200 x 630 social image

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "Where AI drafts lose readers after a strong intro, and four ways to rebuild the middle of the page.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-05-20",
    modifiedTime: "2026-05-20",
    authors: ["Colin H"],
    images: [{ url: OG, width: 1200, height: 630, alt: "A signal line that holds high through an AI draft's intro and flattens across its middle sections", type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "How do you improve AI-written content in the middle of a post?", a: "Give each middle section one claim and make that claim the heading. Move the strongest example out of the intro and into section two or three. Then break the parallel structure, so sections differ in length and form. Most AI middles sag because every section was built from the same template." },
  { q: "Why do AI drafts have a strong intro and a weak middle?", a: "The intro usually inherits the specifics from the prompt: the topic, the angle, sometimes a fact. The middle is where the model has to cover ground, and with no extra material it covers it the way most sources do. The specifics run out after the first screen." },
  { q: "Should you just cut the middle and make posts shorter?", a: "Sometimes, but length is rarely the real problem. A short middle made of the same generic sections still sags. Cut the sections that repeat the heading or restate the intro, then rebuild what's left around claims and evidence." },
  { q: "Do readers even reach the middle of a page?", a: "Fewer of them do. Nielsen Norman Group's 2018 eyetracking analysis found users spent about 57% of their viewing time above the fold and 74% in the first two screenfuls. The readers who keep going are the most interested ones, which is why a weak middle wastes your best audience." },
  { q: "What should a middle section heading look like?", a: "Front-load it with the words that carry the most information, as Nielsen Norman Group recommends for scanners. A heading such as \"Refresh only pages that once earned traffic\" tells a scanning reader the point. \"Benefits of content refresh\" tells them nothing they didn't already guess." },
  { q: "Can Content Trace check just the middle of a draft?", a: "You can paste any section on its own. Content Trace explains its Human Score with 32 signals in 8 sections, so running the middle separately shows whether it's dragging the whole piece down. Short passages give weaker signals, so paste a few paragraphs at least." },
];

export default function TheGenericMiddleOfAiDrafts() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const a = { color: "var(--accent)", textDecoration: "underline" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-05-20" dateModified="2026-05-20" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "#a35f00", background: "rgba(196,122,0,0.08)", border: "1px solid rgba(196,122,0,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Analysis</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="May 20, 2026" readTime="8 min read" />

        <BlogHero src={HERO} alt="A signal line that stays lively through the intro of an AI draft, then flattens across identical middle sections, showing where readers start to drift." />

        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "The intro is often the best part of a raw AI draft, because it inherits whatever specifics the prompt contained. The middle gets none.",
              "AI middles sag in recognizable ways: parallel sections of equal length, headings that name a category, openers that restate the heading.",
              "Readers scan the middle. Nielsen Norman Group found 74% of viewing time goes to the first two screenfuls, so the middle has to earn each scroll.",
              "Generic headings give scanners nothing to grab. Front-loaded headings that state a claim give them the point even if they never read the paragraph.",
              "Cutting length rarely fixes the sag. Moving the best evidence into the middle and breaking the template does.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>In 2018, Nielsen Norman Group repeated an eyetracking analysis it had first run in 2010. Users spent about 57% of their page-viewing time above the fold, and 74% of it in the first two screenfuls. Attention still fell off sharply below the fold, eight years and a lot of redesigns later.</p>

          <p style={p}>That number usually gets used to argue for putting the important stuff at the top. Fair enough. It also says something less comfortable about the middle of a page: the people who get there chose to. They read the intro and decided it was worth scrolling. They&apos;re the most interested readers you have.</p>

          <p style={p}>And the middle is exactly where raw AI drafts go flat. The intro is fine, sometimes good. Then section two starts with &quot;Understanding the basics,&quot; and the page settles into a steady, even, forgettable hum until the conclusion arrives to summarize it all again.</p>

          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>74%</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Of page-viewing time spent in the first two screenfuls</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Nielsen Norman Group eyetracking, 2018. Everything below has to earn its scroll.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "#a35f00", background: "rgba(196,122,0,0.08)", border: "1px solid rgba(196,122,0,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Analysis</div>
          </div>
          </a>

          <h2 style={h2s}>What the sag looks like on the page</h2>

          <p style={p}>Once you&apos;ve seen the pattern, it&apos;s hard to miss. Take a hypothetical AI draft on content refresh. The intro names the problem well enough. Then come the H2s: &quot;What Is Content Refresh?&quot;, &quot;Benefits of Content Refresh&quot;, &quot;Key Strategies for Content Refresh&quot;, &quot;Common Challenges&quot;, &quot;Best Practices&quot;, &quot;Conclusion.&quot;</p>

          <p style={p}>Every section is about the same length. Each opens by restating its own heading (&quot;Content refresh offers several important benefits&quot;). Most contain a bulleted list, and most of those lists have three items. Transitions do the connecting work that an argument should be doing: &quot;Additionally,&quot; &quot;Furthermore,&quot; &quot;Another key consideration.&quot; Section five, &quot;Best Practices,&quot; lists the practices of no one in particular.</p>

          <p style={p}>None of these is a mistake on its own. Together they produce a page with no shape, and the boredom it creates is oddly specific: the feeling of hitting the third &quot;Additionally&quot; and realizing you could have stopped reading at the second heading and lost nothing.</p>

          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Structure & Flow · Signal</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Predictable List Structures</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>Middles built from one template show up here first: the same list shape, the same section length, the same opener, repeated down the page.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Before</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Content refresh offers several important benefits. Additionally, it can improve rankings, engagement and conversions.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>After</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Refreshing a page that never ranked is redecorating an empty room. Start with pages that lost traffic.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Why AI middles come out this way</h2>

          <p style={p}>Here&apos;s the surprising part: the intro of a raw AI draft is often its strongest section. That runs against the usual advice, which treats intros as the weak spot. The reason is mechanical. Whatever specifics the prompt contained (the topic, the angle, maybe a statistic) get spent in the first few paragraphs, because that&apos;s where a model sets up the piece. By section two, the prompt has nothing left to give, and the model covers the remaining ground the way most of its sources cover it.</p>

          <p style={p}>The outline makes it worse. Ask for an outline first and you&apos;ll usually get a coverage plan, a list of subtopics any article on the subject would include. Coverage plans produce parallel sections, and parallel sections invite parallel writing. Each one gets the same treatment because nothing in the plan says one matters more than another.</p>

          <p style={p}>There&apos;s an insider version of this problem too. Many SEO content briefs build the outline from the H2s that top-ranking competitors use. Feed that outline to a model and you&apos;ve asked it, very precisely, to write the same middle as everyone already on page one. Google&apos;s helpful-content guidance warns against content that is &quot;mainly summarizing what others have to say without adding much value.&quot; A competitor-heading outline is a machine for producing exactly that.</p>

          <h2 style={h2s}>Readers scan the middle, so the middle needs handholds</h2>

          <p style={p}>Nielsen Norman Group&apos;s work on the F-shaped reading pattern explains what happens next. People read across the top, read across again a bit lower, then scan down the left edge. They call it &quot;the default pattern when there are no strong cues to attract the eyes towards meaningful information.&quot; A generic middle is a page with no strong cues.</p>

          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;Make no mistake, the F-shaped scanning pattern is bad for users and businesses.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Nielsen Norman Group · F-Shaped Pattern of Reading on the Web</cite>
          </div>

          <p style={p}>The same article lists the fixes, and they&apos;re worth taking literally. Put the most important points in the first two paragraphs. Make headings visibly more important than body text. &quot;Start headings and subheadings with the words carrying most information.&quot; Cut unnecessary content.</p>

          <p style={p}>Run those rules against the hypothetical outline above and almost every heading fails. &quot;Benefits of Content Refresh&quot; starts with the least informative word on the page. A scanner who reads only the left edge of that heading learns that benefits exist. Compare &quot;Refresh only pages that once earned traffic.&quot; The scanner who never reads the paragraph still leaves with the point.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Generic AI draft headings such as Benefits of Content Refresh shown beside rebuilt headings that state a claim up front, such as Refresh only pages that once earned traffic." caption="Same sections, rebuilt headings. A scanner reading only the left edge gets the argument." />

          <h2 style={h2s}>How to rebuild a sagging middle</h2>

          <p style={p}>The obvious fix is to make the middle shorter. Cut two sections, trim the rest, publish. It doesn&apos;t work, because length was never the problem. A short middle made of the same templated sections still sags, just for fewer paragraphs. The problem is sameness, and the cure is giving each section a different job.</p>

          <p style={p}>Start with one claim per section, written as the heading. If a section can&apos;t be summarized as a claim, it&apos;s probably a coverage section, and it can merge with a neighbor or go. &quot;What Is Content Refresh?&quot; rarely survives this test, because the reader who clicked already knows.</p>

          <p style={p}>Next, move the best evidence into the middle. Writers instinctively spend their strongest example in the intro to hook the reader. In an AI-assisted draft, put the hook there, then save the real case or the number from your own data for section two or three. The intro makes a promise. The middle is where it gets paid.</p>

          <p style={p}>Then break the template on purpose. Let one section run five paragraphs and the next run two. Swap a bulleted list for a short table, or for a single sharp paragraph. Open one section with the evidence and the next with the objection. Variety here does a job: it tells the reader which parts matter most.</p>

          <p style={p}>Last, delete the transitions and see what breaks. If &quot;Additionally&quot; was the only thing connecting two sections, the order has no logic. Reorder them until each section answers the question the previous one raised. That&apos;s the difference between a list of topics and an argument, and readers feel it even when they can&apos;t name it.</p>

          <p style={p}>Here&apos;s how the hypothetical content refresh draft looks after that treatment. The definition section is gone, folded into one sentence of the intro. Section two now reads &quot;Refresh only pages that once earned traffic&quot; and carries the strongest evidence in the piece, such as a traffic chart from the site&apos;s own analytics. Section three, &quot;Merge the posts that compete with each other,&quot; is short and practical, with a two-column table of which page keeps the URL. Section four takes the objection head on: &quot;Deleting old posts feels risky. Usually it isn&apos;t.&quot; It runs long, because that&apos;s where readers push back hardest.</p>

          <p style={p}>The &quot;Best Practices&quot; section disappeared entirely. Its useful lines moved into the sections where they actually applied, and the rest turned out to be the generic advice that every competing article already contained. A reader wouldn&apos;t miss it. The conclusion got shorter too, since there was no longer a pile of parallel sections to summarize. The rebuilt draft also comes out shorter, a side effect worth noticing: once each section had a job, the filler had nowhere to sit.</p>

          <h2 style={h2s}>Check the middle on its own</h2>

          <p style={p}>A whole-page read hides a sagging middle, because a good intro sets the mood and the reader&apos;s goodwill lasts a while. Read the middle cold instead. Start at the second H2 and read to the conclusion, as if you&apos;d landed there from a search result. Mark every paragraph that could appear, unchanged, in a competitor&apos;s article on the same topic. Those paragraphs are the sag, and the count tells you how much rebuilding is left.</p>

          <p style={p}>A diagnostic makes this faster. Paste the middle sections into <a href="/" style={a}>Content Trace</a> on their own and compare them with the full piece. It explains the Human Score with 32 signals in 8 sections, so a weak middle shows up as specific problems: predictable list structures, or generic language where a specific detail should be. Treat the result as a pointer to which section to rebuild first.</p>

          <p style={p}>Rebuilding a middle takes longer than writing a better intro. It&apos;s also where the readers who stayed are deciding whether you were worth it.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>A weak middle often starts with a thin brief, which is the subject of <a href="/blog/prompting-for-a-better-first-draft" style={a}>Prompting for a Better First Draft</a>. <a href="/blog/the-specificity-test" style={a}>The Specificity Test</a> helps find the evidence the middle needs. And <a href="/blog/google-is-fine-with-ai-assisted-content" style={a}>Google Is Fine With AI-Assisted Content</a> explains why readers, more than search engines, punish generic pages.</p>

          <Sources items={[
            { label: "Nielsen Norman Group: Scrolling and Attention (2018)", href: "https://www.nngroup.com/articles/scrolling-and-attention/" },
            { label: "Nielsen Norman Group: F-Shaped Pattern of Reading on the Web", href: "https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/" },
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>Paste your middle sections and see where they flatten.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
