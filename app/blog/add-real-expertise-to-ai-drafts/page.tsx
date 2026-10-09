import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "add-real-expertise-to-ai-drafts";
const TITLE = "How to Add Real Expertise to an AI Draft (Without Inventing Any)";
const DESCRIPTION = "E-E-A-T AI content done honestly: five ways to put real experience into an AI-assisted draft, from expert interviews to your own data.";
const HERO = `/blog/${SLUG}/hero.webp`;
const OG = `/og/blog/${SLUG}.jpg`; // 1200 x 630 social image

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "Five honest sources of first-hand experience for AI-assisted drafts, and a provenance check that keeps every claim real.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-06-11",
    modifiedTime: "2026-06-11",
    authors: ["Colin H"],
    images: [{ url: OG, width: 1200, height: 630, alt: "A lens over generic AI copy strikes out a fake expert claim and highlights interview notes and real data", type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "Can AI-assisted content meet Google's E-E-A-T standards?", a: "Yes. Google's guidance on generative AI says the tool is useful for research and for adding structure to original content. What the model can't supply is the first E. Experience has to come from a person who did the work, and the draft has to show it with details only that person would know." },
  { q: "Is it OK to ask an AI model to write in the first person about experience?", a: "Only when the experience is real and you hand it to the model. Paste the interview transcript, the project notes or the data, and tell the model to use nothing else. Asking it to \"write as an expert with 15 years of experience\" produces a believable memory that belongs to nobody." },
  { q: "How do you interview a subject expert without wasting their time?", a: "Book 20 minutes, record it, and ask about specifics: what they got wrong the first time, what customers ask that the docs don't answer, and what they'd tell a friend. Send any quote you plan to publish back to them for approval." },
  { q: "What if nobody on the team has first-hand experience with the topic?", a: "Then say so through the structure of the piece. Interview a customer or partner who does, attribute it to them by name, or write an openly research-based summary with cited sources. If none of that is possible, the topic probably belongs to someone else's site." },
  { q: "Should you disclose that AI helped write a post with expert input?", a: "Google's helpful content guidance suggests explaining how content was made when readers would reasonably expect it. A short note that names the expert who supplied the examples and says AI helped with structure is honest and costs nothing." },
  { q: "Does adding real experience guarantee better rankings?", a: "No. Google says E-E-A-T itself isn't a specific ranking factor, though its systems give more weight to content that aligns with strong E-E-A-T, especially on health, money and safety topics. Real experience makes a page more useful and more trustworthy. Nothing guarantees a ranking." },
];

export default function AddRealExpertiseToAiDrafts() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };
  const a = { color: "var(--accent)", textDecoration: "underline" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-06-11" dateModified="2026-06-11" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Guide</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="June 11, 2026" readTime="8 min read" />

        <BlogHero src={HERO} alt="A lens over generic AI copy strikes out a fake expert claim and highlights interview notes and real data, the two things that add experience honestly." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "A model can give an AI draft structure, but it can't give it the first E in E-E-A-T. Experience has to come from a person who did the work.",
              "Prompting a model to \"write from experience\" doesn't add experience. It produces a convincing memory that belongs to nobody.",
              "Five honest sources cover almost every post: an expert interview, your own data, real artifacts, the decisions you made and the things that broke.",
              "Have the draft leave bracketed gaps where experience belongs, then fill each gap from a real source or delete the sentence.",
              "Google's rater guidelines put Trust at the center of E-E-A-T, so one invented anecdote costs more than it could ever earn.",
              "Before publishing, every experience claim should point to proof on file: a recording, an export, a screenshot or a ticket.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>Google&apos;s search quality rater guidelines contain a test anyone can run in their head. Which would you trust: a product review from someone who has personally used the product, or one from someone who hasn&apos;t? Nobody hesitates. What&apos;s less obvious is what happens when an AI draft is asked to supply the first kind of review.</p>

          <p style={p}>It supplies it. Cheerfully. Ask a model to &quot;add personal experience&quot; to a post about switching CRMs and it will describe the migration weekend, the import that failed at row 4,000 and the sales lead who finally came around. None of it happened. The prose is good. That&apos;s the problem.</p>

          <p style={p}>This guide covers the other route: putting real expertise into AI-assisted drafts, from people who have it, with proof on file. It&apos;s slower than asking the model. It&apos;s also the only version of E-E-A-T that survives a reader asking, &quot;Which project was that?&quot;</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>5</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Sources of real expertise in this guide, from a 20-minute call to your own failures</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>None of them asks the model to invent a single detail.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Guide</div>
          </div>
          </a>

          <h2 style={h2s}>Why a model can&apos;t supply the first E</h2>

          <p style={p}>The rater guidelines define Experience in one plain sentence: &quot;the extent to which the content creator has the necessary first-hand or life experience for the topic.&quot; Read it twice. The sentence is about the creator, not the text. A model has read about thousands of CRM migrations and run none of them.</p>

          <p style={p}>Google&apos;s helpful content guidance says the same thing from the publisher&apos;s side. It asks whether content shows &quot;expertise that comes from having actually used a product or service, or visiting a place.&quot; A model can&apos;t visit anywhere. It&apos;s generous with anecdotes anyway, and judging by its drafts, it has attended every industry conference ever held.</p>

          <p style={p}>None of this makes AI the wrong tool. Google&apos;s guidance on generative AI says it &quot;can be particularly useful when researching a topic, and to add structure to original content.&quot; Notice the last two words. The structure can come from the model. The original part has to come from somewhere else, and that somewhere is a person.</p>

          <p style={p}>The obvious fix is a better prompt: &quot;Write as a senior engineer with 15 years of experience.&quot; It doesn&apos;t work, because the model takes the role seriously and delivers exactly what was asked for, a believable memory with no owner. The prompt didn&apos;t add experience. It added a costume.</p>

          <h2 style={h2s}>Five sources of real expertise, from cheapest to richest</h2>

          <p style={p}>Almost every post can draw on at least two of these. None needs a research budget. Each one needs a person to go and get something the model doesn&apos;t have.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Five cards list honest sources of experience for an AI-assisted draft: expert interview, your own data, real artifacts, decisions and trade-offs, and failures, next to a struck-out card for invented anecdotes." caption="Each source leaves a trail you can point to later. An invented anecdote leaves nothing." />

          <h3 style={h3s}>1. Interview someone who did the work</h3>

          <p style={p}>Most companies already employ the experience their drafts are missing. It sits with support leads, implementation engineers, sales engineers and the account manager who hears the same objection every week. A recorded 20-minute call usually holds more usable material than a week of prompting.</p>

          <p style={p}>Skip &quot;What are the best practices?&quot; That question gets the website back, read aloud. Ask &quot;What did you get wrong the first time?&quot; and &quot;What do customers ask that the docs don&apos;t answer?&quot; The best material tends to arrive after the official answer, once the expert relaxes and starts talking the way they&apos;d talk to a friend. Keep recording through the small talk at the end. That&apos;s where the good line usually is.</p>

          <p style={p}>Then give the transcript to the model as source material and tell it to quote only what&apos;s in the transcript. Send every quote back to the expert for approval before it goes live. That one email prevents a very awkward conversation later.</p>

          <h3 style={h3s}>2. Use your own data</h3>

          <p style={p}>Exports, ticket counts, analytics, sales notes. Small numbers are fine. Take a hypothetical help desk: &quot;Of the last 30 tickets tagged billing, 11 were about proration&quot; is a sentence no competitor can copy, and no model can produce, because the number lives in one system. That&apos;s the core of <a href="/blog/information-gain-seo-ai-drafts" style={a}>information gain</a>. Keep the export, with its date, in the same folder as the draft.</p>

          <h3 style={h3s}>3. Show the artifact</h3>

          <p style={p}>A screenshot of the real settings screen. A config snippet. A redacted brief. A before and after of a page that was actually changed. Artifacts do two jobs. Readers trust what they can see, and the writer gets a quiet reminder that the thing happened. It&apos;s hard to accidentally fabricate a screenshot.</p>

          <h3 style={h3s}>4. Name the decision and what it cost</h3>

          <p style={p}>AI drafts list options. People who have done the work pick one and say what it cost them. That trade-off is the clearest mark of experience a post can carry, and it&apos;s exactly what a model leaves out, because it has never had to live with a choice.</p>

          {/* Before/After */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", background: "var(--bg-card)", margin: "32px 0" }}>
            <div style={{ padding: "10px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Hypothetical example · Decision and trade-off
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "14px 18px", background: "rgba(236,72,96,0.03)", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>AI draft (options)</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>&quot;There are several approaches to migrating CRM data, each with its own advantages and disadvantages. Teams should evaluate their options based on their unique needs.&quot;</p>
              </div>
              <div style={{ padding: "14px 18px", background: "rgba(87,13,158,0.03)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>Edited (choice made)</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>&quot;The ops lead moved contacts first and left deal history for a second pass. Reps had to check the old system for two weeks. She&apos;d make the same call again, because the full import kept failing on duplicates.&quot;</p>
              </div>
            </div>
          </div>

          <p style={p}>The edited version only works if an ops lead really said it. The example above is hypothetical and labeled that way. On a live page, that sentence needs a name and a recording behind it.</p>

          <h3 style={h3s}>5. Admit what broke</h3>

          <p style={p}>Failures are the most credible material a post can hold, and a model never offers them unprompted. Anyone who has watched a launch email go out with a broken merge tag knows the particular heat in the face that follows the first reply. That memory is expertise. It also tells readers what to check, which is more useful than another list of tips.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Content & Logic · Signal</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Insider/Niche Knowledge</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>Content Trace explains its score with 32 signals in 8 sections. This one asks whether a piece holds details only someone close to the work would know. Generic coverage of a topic doesn&apos;t count.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Before</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Email campaigns should be tested thoroughly before launch to avoid errors.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>After</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Send the test to a contact with an empty first-name field. That&apos;s the record that breaks the merge tag.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Mark the gaps before you fill them</h2>

          <p style={p}>The cleanest workflow starts at the prompt. Tell the model to leave a bracketed placeholder wherever experience belongs, something like [EXPERIENCE: a real example of a failed import], instead of making one up. <a href="/blog/prompting-for-a-better-first-draft" style={a}>Prompting for a better first draft</a> covers how to set that up. The draft comes back with its weak spots labeled.</p>

          <p style={p}>Then a person fills each placeholder from one of the five sources, or deletes the sentence. Both outcomes are fine. A placeholder nobody can fill is useful information: the team may not own this topic yet.</p>

          <p style={p}>One pattern shows up fast. The placeholders bunch together in the middle of the draft, where the model&apos;s examples go soft and its advice turns into lists. That&apos;s the same stretch described in <a href="/blog/the-generic-middle-of-ai-drafts" style={a}>the generic middle of AI drafts</a>, and it&apos;s where an hour of interview material does the most good.</p>

          <h2 style={h2s}>Where trust breaks in AI-assisted drafts</h2>

          <p style={p}>Here&apos;s the part that should change how teams think about this. The rater guidelines say &quot;the most important member at the center of the E-E-A-T family is Trust,&quot; and that &quot;untrustworthy pages have low E-E-A-T no matter how Experienced, Expert, or Authoritative they may seem.&quot;</p>

          <p style={p}>Google&apos;s helpful content page adds a detail that surprises people: content &quot;doesn&apos;t necessarily have to demonstrate all of&quot; the E-E-A-T aspects. So an invented anecdote trades away the one quality Google calls essential to fake one it calls optional. Few trades in content marketing are that bad, and that&apos;s a field with a lot of competition for the title.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;An invented anecdote spends the one thing E-E-A-T can&apos;t do without to buy something it can.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Voice & Perspective Signal</cite>
          </div>

          <p style={p}>Put bluntly: if nobody on the team did the thing, don&apos;t write as if somebody did. Attribute the experience to the person who has it, by name, or write the piece as an honest research summary with its sources showing.</p>

          <p style={p}>Real expertise also makes disclosure easy. Google&apos;s guidance asks whether &quot;the use of automation, including AI-generation&quot; is &quot;self-evident to visitors through disclosures or in other ways,&quot; and suggests adding that context when readers would reasonably expect it. A line saying AI helped structure the post and a named support lead supplied the examples is honest. It also reads well. As <a href="/blog/google-is-fine-with-ai-assisted-content" style={a}>Google is fine with AI-assisted content</a> argues, the tool was never the issue.</p>

          <h2 style={h2s}>Run a provenance check before you publish</h2>

          <p style={p}>The last pass is short and a little tedious. Go through the draft and find every sentence that claims experience: a quote, a number, a &quot;the team tried,&quot; a screenshot. Each one should point to something on file.</p>

          <Figure src={`/blog/${SLUG}/inline-2.webp`} alt="A provenance table pairs each type of experience claim with the proof to keep: a recording and approval for quotes, an export for numbers, a ticket or doc for stories, the original file for screenshots, and a cut for claims with no proof." caption="If a claim has nothing in the right-hand column, it gets cut or rewritten before the post goes live." />

          <p style={p}>The dread this prevents is very specific. It&apos;s the moment a client&apos;s product lead reads the post, replies to the thread and asks which test a number came from, and the only honest answer is a chat window. Nobody forgets that afternoon. A provenance check takes far less time than the apology.</p>

          <p style={p}>After the check, a <a href="/" style={a}>Content Trace</a> report is a useful second read. If Insider/Niche Knowledge or Personal Anecdotes Present still comes back low, the draft has gaps that the edit missed. Treat the score as a pointer to the paragraph that needs a real detail, then go and get one from a person. The model already did its part.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a: ans }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{ans}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For the search side of this argument, <a href="/blog/information-gain-seo-ai-drafts" style={a}>Information Gain: The SEO Edge an AI Draft Cannot Copy</a> explains why original material matters for rankings. <a href="/blog/the-specificity-test" style={a}>The Specificity Test</a> shows how to spot the generic sentences that need a real detail. And <a href="/blog/brand-voice-guides-ai-can-follow" style={a}>Brand Voice Guides That AI Can Actually Follow</a> covers the other half of making a draft sound like the people behind it.</p>

          <Sources items={[
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
            { label: "Google Search Central: Google Search's guidance on using generative AI content on your website", href: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" },
            { label: "Google: Search Quality Rater Guidelines (September 11, 2025 version, PDF)", href: "https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See where your draft still needs a real detail.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
