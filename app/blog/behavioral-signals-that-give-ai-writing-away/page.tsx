import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "behavioral-signals-that-give-ai-writing-away";
const TITLE = "The 8 Signals That Give AI Writing Away (and What Readers Finish)";
const H1 = "The 8 Signals That Give AI Writing Away, and the Writing Readers Finish Instead";
const DESCRIPTION = "Eight behavioral signals separate raw AI content from writing people read to the end. What each one looks like, and how to add it to an AI-assisted draft.";
const HERO = `/blog/${SLUG}/hero.webp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "The patterns that make raw AI writing easy to abandon, and the signals that keep readers going to the last paragraph.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-03-11",
    modifiedTime: "2026-10-07",
    authors: ["Colin H"],
    images: [{ url: HERO, width: 1600, height: 900, alt: "A lens over dim AI-style text cuts a reflexive hedge and highlights a remembered detail" }],
  },
  twitter: { card: "summary_large_image", images: [HERO] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "What are the signs of AI writing?", a: "The behavioral ones matter most: a position that never moves, hedges in front of obvious claims, examples that fit too neatly, no visible self-correction, a structure that only delivers, one flat tone, no real perspective, and counterarguments balanced with suspicious care. Each one is also a reason readers drift away." },
  { q: "Can these signals be faked with the right prompt?", a: "Partly. A model will add a self-correction or a change of mind if asked, but prompted versions tend to be formulaic and show up in the same place with the same move. More to the point, a faked signal doesn't give readers anything. A real example or a real opinion does." },
  { q: "Do academics and technical writers show these patterns too?", a: "Some do, on some signals, especially structure and tone. Formal genres call for delivery structure and an even register. That's why no single signal settles anything, and why the writing should be judged against its genre." },
  { q: "Which signal is hardest to add after the fact?", a: "Remembered specifics. A real example carries a small amount of friction, a detail that doesn't quite serve the argument or a complication that has to be acknowledged. That friction needs an actual memory behind it, which a model can't supply." },
  { q: "Is AI content bad for engagement by default?", a: "No. AI-assisted writing can hold readers fine once a person adds what the model can't: a position, real examples and some voice. Raw AI output tends to lose readers for a simpler reason: it offers nothing they couldn't predict." },
  { q: "How do these signals relate to the 32 in a Content Trace report?", a: "They map mostly to the Voice & Perspective, Content & Logic, Cognitive Fingerprinting, Emotional Texture and Pragmatics & Subtext sections. Content Trace explains its results with 32 signals in 8 sections, so a report shows which of these patterns a draft still has." },
];

export default function PostBehavioralSignals() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const h3s = { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: "28px 0 10px" };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-03-11" dateModified="2026-10-07" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Guide</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{H1}</h1>
        <Byline date="March 11, 2026" readTime="9 min read" updated="October 7, 2026" />

        <BlogHero src={HERO} alt="A gradient lens over dim AI-style text cuts a reflexive hedge and highlights a remembered detail, showing the signals that keep a reader reading." />

        {/* TL;DR */}
        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "The signals that give AI writing away are the same ones that make readers stop. Fixing them is about holding attention.",
              "A position that never moves is the most reliable tell. Writing people finish takes a side, then shows where it bends.",
              "Raw AI examples are too clean. Remembered specifics have friction, and readers trust friction.",
              "Reflexive hedging (\"it's worth noting\" before an obvious point) is a model default. Writers who keep readers hedge only where the doubt is real.",
              "Paraphrasers and \"sound human\" prompts don't add these signals. A writer with something to say does.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>In 2008, Jakob Nielsen took browsing data from 25 people and 45,237 page views and worked out how much of a page people actually read. The answer: at most 28% of the words on an average visit, and 20% is more likely. Six years later, Chartbeat CEO Tony Haile reported that 55% of visitors spent fewer than 15 seconds actively on a page.</p>

          <p style={p}>That&apos;s the real test every piece of writing faces. Most readers decide early whether to keep going, and they leave quietly. Raw AI output loses that test more often than it should, and the reasons are specific. They&apos;re the same patterns people mean when they talk about the signs of AI writing.</p>

          <p style={p}>A lot of attention goes to the statistical tells, such as how predictable the word choices are. Those are real, and they&apos;re also the easiest to shuffle with a paraphrasing tool. The eight signals below sit deeper. They&apos;re about whether a mind made decisions on the page, and they explain why one article gets finished while another gets a two-paragraph skim. This guide treats them as a checklist for AI-assisted writers: what readers finish, and how to put it in.</p>

          {/* Stat banner */}
          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>28%</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>The most of a page people read on an average visit</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Nielsen Norman Group&apos;s estimate, with 20% more likely. Every signal below is about earning the rest.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Guide</div>
          </div>
          </a>

          <h2 style={h2s}>Why the signs of AI writing are reader problems</h2>

          <p style={p}>Haile&apos;s data held a surprise that still holds up. Chartbeat found no relationship between how much an article was shared and how much attention readers actually gave it. People share headlines. They finish writing. Those are different jobs, and raw AI output is often good at the first and bad at the second.</p>

          <p style={p}>The reason is predictability. A reader who can guess the next paragraph has no reason to read it. Every signal below is a form of that problem: a stance you saw coming, an example that could have been invented by anyone, a tone that never changes. Google&apos;s guidance on helpful content asks a similar question in its own terms: whether a page offers &quot;original information, reporting, research, or analysis,&quot; and whether a reader will leave &quot;feeling they&apos;ve learned enough about a topic to help achieve their goal.&quot;</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Eight cards pair each AI default with the signal readers finish: fixed position to a position that moves, reflexive hedges to real doubt, built examples to remembered ones, and five more." caption="Each AI default on the left is a reason to stop reading. The signal on the right is the edit." />

          <h2 style={h2s}>Signals of a mind making decisions</h2>

          <h3 style={h3s}>1. A position that moves (instead of opinion uniformity)</h3>

          <p style={p}>People don&apos;t hold perfectly stable positions from the first sentence to the last. They make a claim, then soften it. They meet a counterargument halfway through and adjust. Sometimes they end up somewhere different from where they started. That drift is what thinking looks like on the page.</p>

          <p style={p}>Raw AI output picks a position in response to the prompt and holds it evenly across the whole piece. The introduction, body and conclusion pull in exactly the same direction with the same conviction. For a reader, that means the conclusion is visible from paragraph one, so there&apos;s no reason to reach it. This is the most reliable of the eight, and the one most worth fixing.</p>

          <h3 style={h3s}>2. Hedges only where the doubt is real (instead of reflexive hedging)</h3>

          <p style={p}>There&apos;s a hedging pattern that is almost entirely a model habit: the qualifier dropped in front of claims nobody disputes. &quot;It&apos;s worth noting that.&quot; &quot;It&apos;s important to consider.&quot; Models picked up that professional writing softens claims, and they apply it everywhere.</p>

          <p style={p}>Good writers hedge on purpose. They qualify when they&apos;re unsure, or when a serious competing view exists, or right before saying something that might start an argument. Nobody needs a hedge before announcing that consistency matters in branding. Readers feel the difference as confidence, and they reward it.</p>

          {/* Signal callout */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Word Choice & Phrasing</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Hedging Language Overuse</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>Reflexive hedges cluster before uncontroversial claims. Cutting them makes the real doubts easier to see.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Before</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;It&apos;s worth noting that customer retention can potentially be an important factor for many businesses.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>After</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Retention matters more than acquisition for most subscription businesses. The exception is the first year, when there&apos;s barely anyone to retain.&quot;</span>
              </div>
            </div>
          </div>

          <h3 style={h3s}>3. Uneven counterarguments (instead of perfect balance)</h3>

          <p style={p}>Raw AI output treats counterarguments with suspicious fairness. Every point gets a counterpoint, and every counterpoint is resolved with matching weight. It reads as balanced because the model spreads probability evenly across positions. Nobody actually weighed them.</p>

          <p style={p}>People who hold real positions don&apos;t write that way. They take the objections they find convincing seriously and wave off the ones they don&apos;t. Their concessions are real concessions. That lopsidedness tells the reader what the writer actually thinks, which is the thing the reader came for.</p>

          <h2 style={h2s}>Signals of something that happened</h2>

          <h3 style={h3s}>4. Remembered specifics (instead of built examples)</h3>

          <p style={p}>AI examples are too well chosen. When a model needs to illustrate a point, it reaches for a scenario that fits perfectly, with no rough edges and nothing that runs past the point. It&apos;s tidy, and it&apos;s forgettable.</p>

          <p style={p}>Real examples are messier. Pulled from memory, they&apos;re a slightly imperfect fit, with a wrinkle that has to be acknowledged: &quot;roughly this, though the situation was more complicated because...&quot; That wrinkle is evidence of a real event. Readers can&apos;t always say why a real example feels different. They just stay for it.</p>

          {/* Before/After */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", background: "var(--bg-card)", margin: "32px 0" }}>
            <div style={{ padding: "10px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Content & Logic · Built vs. remembered (hypothetical examples)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "14px 18px", background: "rgba(236,72,96,0.03)", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>Built</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>&quot;For example, a marketing team might use this approach to improve ROI by identifying the most effective channels for their target audience.&quot;</p>
              </div>
              <div style={{ padding: "14px 18px", background: "rgba(87,13,158,0.03)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>Remembered</div>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>&quot;A home services account in Phoenix had local campaigns eating 40% of budget for maybe 8% of conversions. It took three months and two reports before anyone moved the money.&quot;</p>
              </div>
            </div>
          </div>

          <h3 style={h3s}>5. A real perspective (instead of coverage)</h3>

          <p style={p}>This one is harder to name, and it may be the deepest. Real writing carries a perspective: specific knowledge, specific experience and specific stakes that shape what gets said. Someone writing about detection tools who has actually used them knows the irritation of a false positive on a paragraph they wrote themselves, and has opinions about which vendors oversell. That grounding shows even when it isn&apos;t stated.</p>

          <p style={p}>Raw AI output on the same topic covers the ground correctly and holds no view of it. It knows the positions that exist. It doesn&apos;t occupy one. The result is comprehensive and balanced in a way real expertise rarely is, since real expertise comes with preferences and the odd blind spot.</p>

          {/* Pull quote */}
          <div style={{ borderLeft: "4px solid var(--red)", background: "rgba(236,72,96,0.06)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;AI text knows the positions that exist. It doesn&apos;t hold one. Readers come for the one somebody holds.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Content Trace · Voice & Perspective Signal</cite>
          </div>

          <h2 style={h2s}>Signals of a draft that was worked</h2>

          <h3 style={h3s}>6. Visible self-correction (instead of instant polish)</h3>

          <p style={p}>Writers catch themselves mid-thought. &quot;Actually, that&apos;s not quite right.&quot; &quot;That needs walking back a little.&quot; Those corrections appear because people often find out what they think while writing, and the first version of an idea is frequently a bit wrong.</p>

          <p style={p}>Raw AI output doesn&apos;t self-correct, because nothing was discovered. The text arrives polished and final-sounding because it was never drafted. It was predicted. One honest correction tells a reader that the writer is working something out alongside them, and that&apos;s an oddly strong reason to keep reading.</p>

          <h3 style={h3s}>7. Discovery structure (instead of delivery only)</h3>

          <p style={p}>There are two ways to build an argument. Delivery: you know the point and the evidence, and you lay them out in order. Discovery: you start with a question, work through it, and the structure comes from finding the answer.</p>

          <p style={p}>Raw AI output almost always delivers. The intro says what&apos;s coming, labeled sections deliver it, and the conclusion repeats it. Plenty of good writing uses delivery structure, so on its own this proves nothing. But a piece with a little discovery in it, one question the reader doesn&apos;t know the answer to yet, gives them a reason to get to the end.</p>

          <Figure src={`/blog/${SLUG}/inline-2.webp`} alt="Two outlines compared: a delivery outline announces three factors and repeats them, while a discovery outline starts from a question, finds a surprise and changes the conclusion." caption="Delivery tells readers the ending up front. Discovery gives them a reason to get there." />

          <h2 style={h2s}>Signals of a voice</h2>

          <h3 style={h3s}>8. Tonal range (instead of one flat register)</h3>

          <p style={p}>Raw AI output is tonally even in a way that feels slightly off. The formality holds from the first paragraph to the last. Nothing ever steps outside the mode to say something more bluntly, or more warmly, than the context calls for.</p>

          <p style={p}>Human writing moves. A professional post drops into a personal register for a paragraph, or hits harder on a point the writer cares about, or picks up a trace of sarcasm when something seems absurd. That variation is a real person reacting, and readers respond to people.</p>

          <h2 style={h2s}>How the signals work together</h2>

          <p style={p}>None of these is decisive alone. A careful academic, lawyer or technical writer might show delivery structure, an even tone and plenty of hedging while writing entirely original work. Genre matters, and the value is in the combination.</p>

          <p style={p}>The obvious fix is to prompt the model for the signals directly: &quot;add a personal story, change your mind once, vary the tone.&quot; It doesn&apos;t work, because the model will invent a story and stage a change of mind in the same spot every time. That gives a reader a performance, and readers notice performances. The signals have to come from the writer: a real example, a held position and a sentence that says what the writer actually thinks. That&apos;s also the only version that makes AI-assisted writing worth finishing.</p>

          <p style={p}><a href="/" style={{ color: "var(--accent)", textDecoration: "underline" }}>Content Trace</a> explains its results with 32 signals in 8 sections, so a report shows which of these patterns a draft still carries. Use it as a map for the next edit. The score matters less than the section dragging it down.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>To put these signals into a draft, <a href="/blog/how-to-humanize-ai-content" style={{ color: "var(--accent)", textDecoration: "underline" }}>How to Humanize AI Content</a> walks through six editing passes. <a href="/blog/why-ai-writing-sounds-different" style={{ color: "var(--accent)", textDecoration: "underline" }}>Why AI Writing Sounds Different</a> covers the reasons models write this way. And <a href="/blog/the-specificity-test" style={{ color: "var(--accent)", textDecoration: "underline" }}>The Specificity Test</a> goes deeper on remembered specifics.</p>

          <Sources items={[
            { label: "Nielsen Norman Group: How Little Do Users Read? (Jakob Nielsen, 2008)", href: "https://www.nngroup.com/articles/how-little-do-users-read/" },
            { label: "TIME: What You Think You Know About the Web Is Wrong (Tony Haile, Chartbeat, 2014)", href: "https://time.com/12933/what-you-think-you-know-about-the-web-is-wrong/" },
            { label: "Google Search Central: Creating helpful, reliable, people-first content", href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See which of these signals your draft still carries.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
