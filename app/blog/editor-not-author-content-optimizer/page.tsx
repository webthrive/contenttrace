import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "editor-not-author-content-optimizer";
const TITLE = "Editor, Not Author: How the Content Optimizer Avoids Inventing Facts";
const DESCRIPTION = "The ContentTrace Content Optimizer rewrites for clarity, SEO or AI answers while keeping every fact, name, number and quote. Here is how the fact guard works.";
const HERO = `/blog/${SLUG}/hero.webp`;
const OG = `/og/blog/${SLUG}.jpg`; // 1200 x 630 social image

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "Three goals, a fact guard, [Add: ...] markers and an honest re-score: how the Content Optimizer edits without inventing.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-10-04",
    modifiedTime: "2026-10-04",
    authors: ["Colin H"],
    images: [{ url: OG, width: 1200, height: 630, alt: "A lens strikes out an invented claim of over 500 clients and leaves a marker asking the writer to add a real example", type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "Does the Content Optimizer add facts or statistics?", a: "No. It keeps facts, names, numbers and quotes word for word and adds no opinions, feelings or stories. Where a real example or source would help, it leaves a marker such as [Add: a real example from your work] for you to fill." },
  { q: "What does the fact guard check?", a: "It compares the rewrite with the original and flags new names, new numbers and changed quotes. If time allows it tries one repair pass. Anything still flagged shows up as a \"Check these before you publish\" warning." },
  { q: "Why did the Human Score only go up a little?", a: "Because nothing was invented. Much of what makes writing read as human is real experience, real opinion and insider detail, and only you can supply those. Readability and Search & AI-answer readiness usually improve the most." },
  { q: "Can an AI content optimizer guarantee rankings or AI citations?", a: "No tool can. Google's own documentation says indexing and serving aren't guaranteed, and there's no special optimization for AI Overviews. The readiness score is a checklist of good practice, not a ranking forecast." },
  { q: "How is the rewrite scored?", a: "The new version is re-scored by the same engine, using the content type of the original. You see both versions side by side with Human Score, reading ease and Search & AI-answer readiness, before and after." },
  { q: "Which goal should a writer pick?", a: "Humanize for clear, original writing in your own voice. SEO when the page needs descriptive headings, the main point early and the target keyword placed naturally. AI answers when you want a direct answer up top, question-style headings and passages that can be quoted on their own." },
];

export default function EditorNotAuthorContentOptimizer() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-10-04" dateModified="2026-10-04" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Explainer</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="October 4, 2026" readTime="7 min read" />

        <BlogHero src={HERO} alt="A lens over generic marketing copy strikes out the invented claim over 500 clients and leaves a marker that says Add a real example." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "A rewriting tool that invents facts is a liability, however good the prose sounds. The Content Optimizer is built to edit, never to author.",
              "It keeps facts, names, numbers and quotes word for word and adds no opinions, feelings or stories of its own.",
              "A fact guard compares the rewrite with the original and flags new names, new numbers and changed quotes before you publish.",
              "Where a real example would help, the optimizer leaves an [Add: ...] marker instead of making one up.",
              "Every rewrite is re-scored by the same engine, and Human Score gains are often modest. Readability and readiness usually move most.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>Take a hypothetical case study draft with one hard number in it: support tickets fell 14% after a product change. Paste it into a general chatbot and ask it to make the story more compelling. A common result is a sharper paragraph where the 14% has become &quot;nearly 20%,&quot; the customer has acquired a job title nobody gave them, and a quote appears from a head of support who never said anything.</p>

          <p style={p}>None of that is malice. It&apos;s what language models do when asked to make text more specific and more persuasive at once. The ContentTrace Content Optimizer, launched on October 3, 2026, was designed around the opposite instinct. It edits like a careful editor and refuses to write like an author.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>3</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Optimizer goals, one rule: keep every fact as written</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Humanize, SEO and AI answers. Each rewrite is re-scored by the same engine.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Explainer</div>
          </div>
          </a>

          <h2 style={h2s}>Why rewriting tools make things up</h2>

          <p style={p}>Hallucination has a well-documented cause. In its 2025 research on the problem, OpenAI argued that &quot;standard training and evaluation procedures reward guessing over acknowledging uncertainty.&quot; A model that confidently fills a gap scores better on most benchmarks than one that leaves the gap empty. The habit carries straight into rewriting. Ask for vivid, and the model supplies vividness, including the parts that weren&apos;t in the source.</p>

          <p style={p}>The academic literature has been tracking this for years. The survey of hallucination in language generation by Ziwei Ji and colleagues describes models as &quot;prone to hallucinate unintended text,&quot; a phrase that sounds clinical until it&apos;s your client&apos;s revenue figure being rounded up.</p>

          <p style={p}>For AI-assisted writers this matters more than style ever will. A clunky sentence costs a reader a second. An invented statistic costs the publisher credibility, and on regulated topics it can cost a lot more. So the optimizer starts from a hard position: a better-sounding draft that says something false is a worse draft.</p>

          <h2 style={h2s}>Three goals, one rule</h2>

          <p style={p}>The optimizer offers three goals, and each builds on the first.</p>

          <p style={p}>Humanize aims for clear, original writing in the writer&apos;s own voice. SEO adds descriptive headings, the main point early and the target keyword placed where it reads naturally. AI answers, the AEO goal, adds a direct answer up top, question-style headings and self-contained passages that make sense when quoted alone.</p>

          <p style={p}>Under all three, the same rule holds. Facts, names, numbers and quotes stay word for word. The optimizer adds no opinions, no feelings and no stories. It uses the same Claude model as the scoring engine, at a temperature of 0.2, a touch looser than the scorer&apos;s 0 because rewriting needs a little room to phrase things and scoring needs none.</p>

          <p style={p}>That rule sounds obvious. It turns out to be the hard part.</p>

          <h2 style={h2s}>The fact guard</h2>

          <p style={p}>The obvious fix is to tell the model, firmly, not to invent anything. Instructions do help. They don&apos;t close the gap, because the same request that asks for more specific writing quietly invites specifics, and a model under that pressure will sometimes produce one. Trusting the instruction alone is like trusting a toddler&apos;s promise about the cookie jar.</p>

          <p style={p}>So the optimizer checks its own work. After the rewrite, a fact guard compares the new version with the original and flags three kinds of change: new names, new numbers and changed quotes. If time allows, it runs one repair pass to put the original facts back. If anything is still flagged after that, the result arrives with a &quot;Check these before you publish&quot; warning listing what changed.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Four steps of the Content Optimizer: rewrite for one goal, fact guard compares both versions, one repair pass or a warning, then re-score with the same engine; readiness is 65% model rubric and 35% code checks." caption="The fact guard sits between the rewrite and the re-score, so nothing new reaches you unflagged." />

          <p style={p}>The warning is the honest part of the design. A tool could hide its slips and hope nobody notices. Showing them puts the final call where it belongs, with the person whose name goes on the page.</p>

          <h2 style={h2s}>[Add: ...] markers instead of invented examples</h2>

          <p style={p}>Some drafts genuinely need an example the writer never gave. A generic optimizer fills that hole with something plausible. ContentTrace leaves a marker in the text, such as [Add: a real example from your work], and moves on.</p>

          <p style={p}>That bracket is a small, slightly awkward thing to find in an otherwise polished rewrite. It&apos;s supposed to be. Google&apos;s guidance on helpful content asks whether a page shows &quot;first-hand expertise and a depth of knowledge,&quot; including expertise from having actually used a product or visited a place. No model can supply that for you. A marker is a reminder that the most valuable sentence in the piece still has to come from you.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Content & Logic · 13% default weight</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Insider/Niche Knowledge</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>The signal an optimizer can&apos;t fake honestly. It rewards details only someone close to the work would know.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Invented</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Teams across industries have seen dramatic results, with many reporting faster onboarding.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Marked</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Onboarding got faster. [Add: a real example from your work]&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Reviewing a rewrite before it goes live</h2>

          <p style={p}>The optimizer hands back a draft, not a finished page. A sensible review takes a few minutes and follows the order of risk.</p>

          <p style={p}>Start with the warnings. If the result carries a &quot;Check these before you publish&quot; list, read every item against your source notes before you look at anything else. A flagged name might be harmless, such as a product the original mentioned two paragraphs earlier. It might also be the one error that would have embarrassed you, and the list doesn&apos;t know which.</p>

          <p style={p}>Next, search for the markers. Each [Add: ...] bracket is a spot where the piece got thinner when the optimizer refused to invent. Fill it with something real or cut the sentence around it. Publishing a page with a bracket still in it happens more often than anyone admits, usually at 6 p.m. on a Friday.</p>

          <p style={p}>Then read the rewrite once, aloud if you can, for voice. The Humanize goal aims for your voice, yet any rewrite can drift toward a smoother, more neutral tone than you&apos;d choose. Put back a phrase or two that sounded like you. Last, compare the before and after numbers, and treat a falling score in any section as a reason to check that section, never as a reason to undo the whole edit.</p>

          <h2 style={h2s}>Re-scored by the same engine, with honest results</h2>

          <p style={p}>After the rewrite, the new version goes back through the same scoring engine, using the content type of the original so the comparison is fair. You see both versions side by side with three numbers before and after: Human Score, reading ease, and Search & AI-answer readiness.</p>

          <p style={p}>Readiness is 65% a model rubric of 6 criteria and 35% code checks. Treat it as a checklist of good practice for search and AI answers. It doesn&apos;t forecast rankings, and nothing could. Google&apos;s documentation on AI features says there are no additional requirements or special optimizations for AI Overviews or AI Mode, and that indexing and serving aren&apos;t guaranteed.</p>

          <p style={p}>Here&apos;s the part some people find disappointing. In launch testing, Human Score gains were often modest. Readability and readiness usually improved the most. That&apos;s a direct consequence of the rule: much of what makes writing read as human is real experience, real opinion and insider detail, and an editor that refuses to invent those can only tidy around them.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--accent)", background: "var(--accent-light)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;A big jump in score from a tool that adds stories you never lived would be a lie with good formatting.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Voice & Perspective Signal</cite>
          </div>

          <p style={p}>A small score bump after pressing optimize can feel flat, a bit like paying for a car wash and finding the dent still there. The relief comes later, when you reread the rewrite and every number in it is one you can defend in front of a client. The remaining distance to a strong Human Score is the work only the writer can do: fill the markers, take a side, add the detail from the meeting nobody else attended.</p>

          <p style={p}>That&apos;s the position the optimizer is built on, and it isn&apos;t a hedge. AI-assisted writing is good writing when a person supplies the substance and the tools handle the polish. A tool that blurs that line makes your content worse, even when its score goes up.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For how the re-score works, <a href="/blog/inside-the-32-signals" style={{ color: "var(--accent)", textDecoration: "underline" }}>Inside the 32 Signals</a> explains the engine. <a href="/blog/the-specificity-test" style={{ color: "var(--accent)", textDecoration: "underline" }}>The Specificity Test</a> covers the kind of detail that belongs in those [Add: ...] markers. And <a href="/blog/how-to-humanize-ai-content" style={{ color: "var(--accent)", textDecoration: "underline" }}>How to Humanize AI Content</a> walks through the editing passes by hand.</p>

          <Sources items={[
            { label: "OpenAI: Why language models hallucinate (2025)", href: "https://openai.com/index/why-language-models-hallucinate/" },
            { label: "Ji et al., Survey of Hallucination in Natural Language Generation (arXiv)", href: "https://arxiv.org/abs/2202.03629" },
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
            { label: "Google Search Central: AI features and your website", href: "https://developers.google.com/search/docs/appearance/ai-features" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>Score a draft, then optimize it without losing a single fact.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Try Content Trace free →
          </a>
        </div>
      </main>
    </>
  );
}
