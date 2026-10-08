import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "prompting-for-a-better-first-draft";
const TITLE = "Prompting for a Better First Draft: What to Give the Model Before It Writes";
const DESCRIPTION = "AI writing prompts for blog posts work when they carry five inputs: the reader, a position, real material, sources and positive constraints.";
const HERO = `/blog/${SLUG}/hero.webp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "The inputs that decide how much editing an AI draft needs: audience, a position to defend, real examples, sources and constraints.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-05-12",
    modifiedTime: "2026-05-12",
    authors: ["Colin H"],
    images: [{ url: HERO, width: 1600, height: 900, alt: "A one-line prompt beside a five-part writing brief, showing that inputs decide the quality of an AI first draft" }],
  },
  twitter: { card: "summary_large_image", images: [HERO] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "What should a prompt for a blog post include?", a: "Five things: a specific reader and what they already know, the position the post must defend, real material such as notes, data or an anecdote, the sources the draft may use, and constraints written as instructions to do something. Topic and word count are the least important parts." },
  { q: "How long should a writing prompt be?", a: "Longer than most people expect. A good brief often runs several hundred words once notes and sources are pasted in. The length is fine as long as it's organized. Put the material in clearly labeled sections so the model can tell your instructions from your reference text." },
  { q: "Should you paste in examples of your past writing?", a: "Yes, with care. Anthropic's prompting guide says a few well-crafted examples improve accuracy and consistency, and suggests three to five. Pick examples that resemble the piece you want and differ from each other, or the model copies one example's quirks instead of your voice." },
  { q: "Can a better prompt replace editing?", a: "No. It changes what the edit is about. A thin prompt leaves you rewriting the argument. A full brief leaves you checking facts, tightening sentences and adding the one detail you forgot to give the model. The second job is shorter and much less depressing." },
  { q: "Does the model really ignore material in the middle of a long prompt?", a: "It can. Researchers led by Nelson Liu found that model performance drops when the relevant information sits in the middle of a long context. Put your key facts and the position near the start or the end of the brief, and keep the brief well labeled." },
  { q: "How do you know whether the brief worked?", a: "Read the draft for the parts only you could have supplied. If your position, your example and your numbers show up intact, the brief did its job. A diagnostic such as Content Trace, which explains its Human Score with 32 signals in 8 sections, can show which areas still read generic." },
];

export default function PromptingForABetterFirstDraft() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const a = { color: "var(--accent)", textDecoration: "underline" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-05-12" dateModified="2026-05-12" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Guide</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="May 12, 2026" readTime="8 min read" />

        <BlogHero src={HERO} alt="A one-line prompt struck through and replaced by a five-part brief with a reader, a position and real examples, showing that inputs decide how much editing is left." />

        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "The quality of an AI first draft is mostly decided before the model writes a word, by what the prompt gives it.",
              "A one-line prompt makes the model fill every gap with the average of its training data, and averages are what editors spend hours removing.",
              "The position the post must defend is the most valuable input. A tone instruction such as \"be opinionated\" is no substitute for an actual claim.",
              "Real material (your notes, numbers, an anecdote) has to come from you. The model can arrange experience. It can't supply it.",
              "Constraints work better as instructions to do something, with a reason attached, than as lists of banned words.",
              "A full brief moves the edit from rebuilding the argument to checking and tightening.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>Anthropic&apos;s own prompting guide opens its advice on clarity with an image worth taping above every content desk: &quot;Think of Claude as a brilliant but new employee who lacks context on your norms and workflows.&quot; Then it adds the part people skip. &quot;The more precisely you explain what you want, the better the result.&quot;</p>

          <p style={p}>Now picture how most blog drafts actually get requested. Take a hypothetical but very typical prompt: &quot;Write a 1,500-word blog post about content refresh strategy for B2B SaaS.&quot; That&apos;s a topic and a length. No reader, no argument, no material. A brilliant new hire handed that note on day one would produce exactly what the model produces: a competent summary of what everybody already says.</p>

          <p style={p}>The edit that follows takes an hour, and most of it is spent putting back the things the prompt never contained. That hour is optional. Most of it can be moved to the five minutes before the model starts writing.</p>

          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>5</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Inputs to give the model before it writes a single word</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Reader, position, real material, sources, constraints. Each one removes a category of editing.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Guide</div>
          </div>
          </a>

          <h2 style={h2s}>Why the one-line prompt costs you an hour later</h2>

          <p style={p}>A model asked to write about a topic with no further input has one safe move: describe the topic the way most of its sources describe it. Every unanswered question in the prompt gets answered with the most common answer. Who is the reader? Someone generic. What does the post argue? Nothing in particular, with balance. Which examples? Hypothetical ones, since there are no real ones to hand.</p>

          <p style={p}>That&apos;s why raw AI drafts feel the same across companies and industries. The model is doing exactly what an underspecified request asks for, and the result is the gray middle of the internet in tidy paragraphs.</p>

          <p style={p}>Anthropic&apos;s guide offers a test for this that works just as well on human briefs: &quot;Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they&apos;d be confused, Claude will be too.&quot; Try it on your last blog prompt. Most of them would confuse a colleague within a sentence.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="A five-part writing brief with labeled slots for the reader, the position to defend, real material, allowed sources and constraints, each tied to the editing problem it prevents." caption="Each slot in the brief removes one kind of editing. An empty slot gets filled with an average." />

          <h2 style={h2s}>Input 1: the reader, described like a person</h2>

          <p style={p}>&quot;Marketers&quot; is a market segment. A reader is narrower: who they are, what they already know, what&apos;s annoying them this week and what they&apos;ll do after reading. &quot;Content leads at 50-person SaaS companies who already run quarterly refreshes and want to know which old posts to stop updating&quot; gives the model a level to write at. It also tells the model what to skip, which matters more. A reader who already runs refreshes doesn&apos;t need three paragraphs explaining what a refresh is.</p>

          <p style={p}>Add the reader&apos;s next step as well. A post meant to help someone pick between two tools ends differently from one meant to change how a team plans its quarter. When the model knows what the reader will do after the last paragraph, it stops writing a conclusion that summarizes and starts writing one that points somewhere. That single line often fixes the limp final section that editors usually rewrite from scratch.</p>

          <p style={p}>The quickest way to write the reader line is to name a real person you&apos;ve written for and describe them without the name. If you can&apos;t, the post may not have a reader yet.</p>

          <h2 style={h2s}>Input 2: a position the draft has to defend</h2>

          <p style={p}>This is the input with the biggest payoff, and the one most often replaced by something that looks similar. The obvious fix for a bland draft is to add a tone instruction: &quot;be bold,&quot; &quot;be opinionated,&quot; &quot;take a strong stance.&quot; It doesn&apos;t work, because tone without a claim produces confident sentences about nothing. You get &quot;Let&apos;s be honest: content refresh matters more than ever,&quot; which is a strong voice attached to an empty position.</p>

          <p style={p}>Give the model the claim itself. &quot;Most refresh programs waste effort on posts that never ranked. Refresh only pages that once earned traffic, and delete or merge the rest.&quot; Now the draft has something to argue, and every section has a job: support the claim, handle the objection, show the evidence.</p>

          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Voice & Perspective · Signal</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Opinion Strength</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>A draft can only commit to a position it was given. Hedged conclusions are the default when the prompt has no claim in it.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Prompt</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Write about content refresh. Be opinionated.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Brief</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Argue that teams should refresh only pages that once earned traffic, and merge the rest.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Input 3: real material the model can&apos;t invent</h2>

          <p style={p}>Here&apos;s the hard limit. A model can arrange your experience beautifully. It can&apos;t have it. If the post needs a client result, a mistake your team made or a number from your own analytics, it has to be in the prompt, or the draft will either skip it or invent a stand-in. The invented stand-in is worse, because it reads fine and isn&apos;t true.</p>

          <p style={p}>Paste in raw notes. Bullet fragments are fine, even messy ones: a call summary, a Slack thread, three numbers from a dashboard export. OpenAI&apos;s prompt engineering guide makes the same point in plainer words, telling developers to give the model &quot;any additional information it might need to generate a response, like private/proprietary data outside its training data.&quot;</p>

          <p style={p}>Style examples are a separate input. Anthropic&apos;s guide says &quot;a few well-crafted examples&quot; improve accuracy and consistency, recommends three to five, and asks for examples that are relevant and varied enough that the model &quot;doesn&apos;t pick up unintended patterns.&quot; That last warning is the insider detail. Give it one past post and you&apos;ll get that post&apos;s quirks back, including the opening it overused. There&apos;s a small, specific dread in seeing your own worst habit returned to you at scale.</p>

          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they&apos;d be confused, Claude will be too.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Anthropic · Prompting best practices</cite>
          </div>

          <h2 style={h2s}>Input 4: sources, and where they sit in the prompt</h2>

          <p style={p}>If the post will cite anything, give the model the sources, and tell it to use only those. OpenAI&apos;s guide describes this as a way to &quot;constrain the model&apos;s response to a specific set of resources that you have determined will be most beneficial.&quot; It&apos;s also the cheapest fact-check you&apos;ll ever run, because a claim with no matching source in the brief stands out at once.</p>

          <p style={p}>Placement matters more than people expect. A 2023 paper by Nelson Liu and colleagues, &quot;Lost in the Middle,&quot; found that model performance &quot;significantly degrades when models must access relevant information in the middle of long contexts.&quot; The surprising part is that this held even for models built for long inputs. For a writing brief, the practical rule is simple: put the position and the must-use facts near the top or the bottom, and let the long pasted sources sit in a clearly labeled block between them.</p>

          <h2 style={h2s}>Input 5: constraints that say what to do</h2>

          <p style={p}>Most style constraints arrive as a blacklist. Don&apos;t use &quot;delve.&quot; Don&apos;t use bullet points. Don&apos;t open with a question. Anthropic&apos;s guide suggests the opposite habit: &quot;Tell Claude what to do instead of what not to do.&quot; Its example swaps &quot;Do not use markdown&quot; for &quot;Your response should be composed of smoothly flowing prose paragraphs.&quot;</p>

          <p style={p}>The same guide recommends giving the reason behind a rule. Its example is a response that will be read aloud by a text-to-speech engine, so ellipses should never appear, because the engine can&apos;t pronounce them. A writing brief can do the same: &quot;Keep sentences under 25 words on average, because most readers will be on a phone.&quot; The reason lets the model apply the rule to cases you didn&apos;t list.</p>

          <p style={p}>Format constraints belong here too: the heading style, whether the intro may open with a definition (it shouldn&apos;t), the length of each section and where the call to action goes. Anything you&apos;d correct in the edit is cheaper to state in the brief.</p>

          <h2 style={h2s}>What the edit looks like after a good brief</h2>

          <p style={p}>A full brief changes what the edit is about. After a one-line prompt, the editor rebuilds the argument, hunts for real examples and rewrites the intro. After a five-part brief, the editor checks facts against the pasted sources, tightens sentences and adds the one detail nobody remembered to include. The first job is rewriting. The second is editing, and it&apos;s the job editors actually like.</p>

          <p style={p}>A diagnostic helps confirm which job is left. Run the draft through <a href="/" style={a}>Content Trace</a> and look at the section breakdown. Weak Content & Logic usually means the real material never made it into the prompt. Weak Voice & Perspective usually means the position didn&apos;t. The fix for both happens upstream, in the next brief.</p>

          <p style={p}>Nothing here counts as advanced prompt engineering. A good editor gives a freelancer the same briefing. The model just makes the cost of a bad brief visible sooner.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>For why a better draft still matters when Google already accepts AI-assisted pages, read <a href="/blog/google-is-fine-with-ai-assisted-content" style={a}>Google Is Fine With AI-Assisted Content. Readers Are the Harder Audience</a>. <a href="/blog/the-specificity-test" style={a}>The Specificity Test</a> shows what counts as real material. And <a href="/blog/how-to-humanize-ai-content" style={a}>How to Humanize AI Content</a> covers the editing passes that come after the draft.</p>

          <Sources items={[
            { label: "Anthropic (Claude Docs): Prompting best practices", href: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
            { label: "OpenAI API docs: Prompt engineering", href: "https://developers.openai.com/api/docs/guides/prompt-engineering" },
            { label: "Liu et al. (2023): Lost in the Middle: How Language Models Use Long Contexts", href: "https://arxiv.org/abs/2307.03172" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See which parts of your next draft still read generic.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
