import Nav from "@/components/Nav";
import type { Metadata } from "next";
import { ArticleSchema, AuthorBio, BlogHero, Byline, Figure, SITE_URL, Sources } from "../_parts";

const SLUG = "brand-voice-guides-ai-can-follow";
const TITLE = "Brand Voice Guides That AI Can Actually Follow";
const DESCRIPTION = "Most voice guides list adjectives a model can't act on. How to turn a vague AI brand voice guide into dials, rules and examples a model obeys.";
const HERO = `/blog/${SLUG}/hero.webp`;
const OG = `/og/blog/${SLUG}.jpg`; // 1200 x 630 social image

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/${SLUG}` },
  openGraph: {
    title: `${TITLE} | Content Trace`,
    description: "Turn a vague brand voice document into concrete rules, tone dials and paired examples that an AI model can follow.",
    url: `${SITE_URL}/blog/${SLUG}`,
    siteName: "Content Trace",
    type: "article",
    publishedTime: "2026-05-28",
    modifiedTime: "2026-05-28",
    authors: ["Colin H"],
    images: [{ url: OG, width: 1200, height: 630, alt: "Vague voice adjectives struck out and replaced by concrete writing rules a model can follow", type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image", images: [OG] },
  robots: { index: true, follow: true },
};

const FAQ = [
  { q: "What goes into an AI brand voice guide?", a: "Four parts: a position on each tone dimension (formal or casual, serious or funny, respectful or irreverent, matter-of-fact or enthusiastic), concrete rules a reader could check, paired examples of on-voice and off-voice writing, and a short table of how tone shifts by situation. Adjectives alone are the part to drop." },
  { q: "Why does the model ignore the voice guide?", a: "Usually it doesn't ignore it. It follows the adjectives the only way it can, by mapping words like \"friendly\" and \"confident\" onto its default style. If the guide gives nothing more concrete, the default is what comes back." },
  { q: "How many examples should a voice guide include?", a: "Anthropic's prompting guide suggests three to five well-crafted examples, relevant to the task and varied enough that the model doesn't copy one example's quirks. For voice, pairs work best: the same message written on-voice and off-voice, so the difference is the lesson." },
  { q: "Should the same voice guide work for humans and AI?", a: "Yes, with one version. The concrete rules and paired examples that help a model also help a new writer, who has the same problem: no context on your norms. Keep the inspirational part for people if you like, but put the checkable rules first." },
  { q: "How do you test whether a model follows the guide?", a: "Give it three different jobs, such as a launch post, an apology email and a help article, and read the outputs against the rules line by line. Log every miss and either rewrite the rule or add an example that shows it. A guide that has never been tested is a draft." },
  { q: "Can Content Trace check brand voice?", a: "It doesn't know your brand rules. It does show where writing reads generic. Content Trace explains its Human Score with 32 signals in 8 sections, so weak Voice & Perspective or Word Choice results point at the places a voice guide failed to take hold." },
];

export default function BrandVoiceGuidesAiCanFollow() {
  const p = { marginBottom: "20px" };
  const h2s = { fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 14px", letterSpacing: "-0.01em", lineHeight: 1.3 };
  const a = { color: "var(--accent)", textDecoration: "underline" };
  const th = { padding: "10px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, fontFamily: "var(--font-mono)", textAlign: "left" as const, borderBottom: "1px solid var(--border)" };
  const td = { padding: "12px 14px", fontSize: "14px", lineHeight: 1.55, color: "var(--text-secondary)", borderBottom: "1px solid var(--border)", verticalAlign: "top" as const };

  return (
    <><Nav current="/blog" />
      <ArticleSchema slug={SLUG} title={TITLE} description={DESCRIPTION} datePublished="2026-05-28" dateModified="2026-05-28" image={HERO} faq={FAQ} />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>

        <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", padding: "3px 10px", borderRadius: "8px", marginBottom: "16px" }}>Guide</div>
        <h1 style={{ fontSize: "38px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{TITLE}</h1>
        <Byline date="May 28, 2026" readTime="8 min read" />

        <BlogHero src={HERO} alt="Voice adjectives such as friendly and confident struck out under a lens and replaced with concrete rules a model can follow, such as short sentences and naming the product." />

        <div className="tldr" style={{ background: "var(--accent-light)", border: "1px solid rgba(87,13,158,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>TL;DR</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Most brand voice guides are lists of adjectives, and a model can only map adjectives onto its own default style.",
              "Nielsen Norman Group's four tone dimensions give a guide something a model can act on: a set position on each dial.",
              "Every trait in the guide should become a rule a reader could check, such as a sentence length target or a banned category of phrase.",
              "Paired examples teach voice faster than descriptions. Show the same message on-voice and off-voice.",
              "Voice stays fixed and tone shifts with the situation. A guide that doesn't separate the two produces a cheerful apology email.",
              "A voice guide is finished only after it has been tested on the model and its misses have been fixed.",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, flexShrink: 0 }}>→</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.8" }}>

          <p style={p}>Mailchimp's content style guide describes its voice in four short lines. "We are plainspoken. We are genuine. We are translators. Our humor is dry." It's one of the best-known voice guides on the web, and for human writers it works, because the rest of the guide is full of examples, explanations and pages of specific rules.</p>

          <p style={p}>Now picture what happens when a team copies only the summary into a prompt. Take a hypothetical brand whose guide says "friendly, clear, confident, human." The model reads four adjectives and does its best, which means producing its own default idea of friendly and confident. That default is the voice every other brand gets too.</p>

          <p style={p}>Every voice guide in the industry seems to describe the same company: friendly, clear, confident and human. Rarely has one personality been licensed so widely. A model can't tell those brands apart, because their guides don't.</p>

          <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--bg-card)", cursor: "pointer", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", margin: "32px 0" }}>
            <div style={{ fontSize: "42px", fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-mono)", lineHeight: 1, flexShrink: 0 }}>4</div>
            <div style={{ width: "1px", background: "var(--border)", height: "48px", flexShrink: 0 }}></div>
            <div style={{ flex: "1 1 180px", minWidth: 0 }}>
              <strong style={{ fontSize: "15px", fontWeight: 600, display: "block", marginBottom: "3px" }}>Tone dimensions a voice guide can set, from Nielsen Norman Group</strong>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>Formal or casual, serious or funny, respectful or irreverent, matter-of-fact or enthusiastic.</p>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", color: "var(--red)", background: "var(--red-bg)", border: "1px solid rgba(236,72,96,0.2)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Guide</div>
          </div>
          </a>

          <h2 style={h2s}>Why adjective lists fail with models</h2>

          <p style={p}>An adjective is a summary of many decisions. "Plainspoken" means short sentences, everyday words, no jargon without a translation, and a preference for naming the thing over naming its category. A human writer who reads the full guide learns those decisions from the examples. A model given only the word has to guess them, and its guess is the average.</p>

          <p style={p}>The obvious fix is to add more adjectives, or stronger ones. "Very casual. Witty. Bold." It doesn't work, because stronger adjectives just push the model further into its own idea of those words. Ask for "witty" and you tend to get puns and exclamation marks. Ask for "bold" and you get "Let's be honest" at the top of every second paragraph. The result is louder and still generic.</p>

          <p style={p}>Anthropic's prompting guide has a useful line on this: "Providing context or motivation behind your instructions ... can help Claude better understand your goals." Its example replaces "NEVER use ellipses" with an explanation that the text will be read aloud by a text-to-speech engine. The reason does the work. A voice guide that explains why the brand writes the way it does gives the model something to generalize from.</p>

          <h2 style={h2s}>Set the dials before writing any rules</h2>

          <p style={p}>Nielsen Norman Group offers the cleanest starting point. Kate Moran's article on the four dimensions of tone of voice breaks tone into formal versus casual, serious versus funny, respectful versus irreverent and matter-of-fact versus enthusiastic. In NN/g's study, changes along those dimensions produced measurable differences in how users saw a brand. A funny, casual insurance sample came across as friendlier and less formal than a serious one.</p>

          <p style={p}>The surprising part is how small the gaps were. Rating differences ran about half a point to a point on a five-point scale, in a survey of 50 people. Small shifts in tone still moved impressions in a measurable way. That's a good argument for setting the dials precisely, since a model drifting one notch toward enthusiastic will change how the brand reads.</p>

          <Figure src={`/blog/${SLUG}/inline-1.webp`} alt="Four tone sliders for a hypothetical B2B software brand, set between formal and casual, serious and funny, respectful and irreverent, and matter-of-fact and enthusiastic." caption="A position on each dial gives the model a target. These settings are for a hypothetical brand." />

          <p style={p}>Write the position as a sentence the model can use. For a hypothetical B2B analytics brand: "Casual but never sloppy. Serious about the data, light about everything else. Respectful of the reader's time. Matter-of-fact: let the numbers carry the excitement." Four sentences, and each one rules out a whole family of bad drafts.</p>

          <h2 style={h2s}>Turn every trait into a rule someone could check</h2>

          <p style={p}>Here's the test for each line of the guide: could two editors disagree about whether a paragraph follows it? If yes, it's still an adjective. Rewrite it until a reader, or a model, could check it on the page.</p>

          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", background: "var(--bg-card)", margin: "28px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  <th style={{ ...th, color: "var(--red)" }}>Vague trait</th>
                  <th style={{ ...th, color: "var(--accent)" }}>Rule a model can follow</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={td}>Plainspoken</td><td style={td}>Average sentence under 20 words. Explain any acronym the first time it appears.</td></tr>
                <tr><td style={td}>Confident</td><td style={td}>State the recommendation in the first paragraph. One caveat per section, at most.</td></tr>
                <tr><td style={td}>Friendly</td><td style={td}>Use contractions and &quot;you.&quot; Never open with a greeting or a compliment.</td></tr>
                <tr><td style={{ ...td, borderBottom: 0 }}>Specific</td><td style={{ ...td, borderBottom: 0 }}>Name the product, the metric or the job title. Replace &quot;businesses&quot; with who exactly.</td></tr>
              </tbody>
            </table>
          </div>

          <p style={p}>Phrase each rule as something to do. Anthropic's guide says it directly: "Tell Claude what to do instead of what not to do." Banned-word lists still have a place, but keep them short and attach a replacement to each item. "Instead of 'leverage,' name the action: use, connect, cut."</p>

          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", margin: "28px 0" }}>
            <div style={{ padding: "12px 18px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)" }}>Word Choice & Phrasing · Signal</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>Generic vs Specific Language</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>The rule most voice guides need and few contain. Generic nouns are where a brand voice dissolves into the default one.</p>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(236,72,96,0.1)", color: "var(--red)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>Before</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Our solution empowers businesses to unlock valuable insights from their data.&quot;</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: "4px", background: "rgba(87,13,158,0.1)", color: "var(--accent)", flexShrink: 0, marginTop: "1px", fontFamily: "var(--font-mono)" }}>After</span>
                <span style={{ color: "var(--text-secondary)" }}>&quot;Finance teams see which customers will churn this quarter, a month before renewal.&quot;</span>
              </div>
            </div>
          </div>

          <h2 style={h2s}>Show the voice in pairs</h2>

          <p style={p}>Descriptions tell the model where to aim. Examples show it what a hit looks like. Anthropic's guide says "a few well-crafted examples" improve accuracy and consistency, recommends three to five, and asks for examples that are relevant and varied enough that the model "doesn't pick up unintended patterns."</p>

          <p style={p}>For voice, the most useful format is a pair: the same message written on-voice and off-voice, with one line explaining the difference. A pair isolates the voice from the content, so the model learns the voice instead of the topic. Mailchimp's guide contains the human version of this in a single sentence: "We're weird but not inappropriate, smart but not snobbish." That line is the most model-friendly sentence in the whole guide, because each half names both the target and the miss.</p>

          <p style={p}>Pick examples from different formats. If all three come from blog posts, the model learns blog-post habits and carries them into email. There's a particular embarrassment in watching a carefully tuned launch-post voice turn up, exclamation marks intact, in a billing-error notice to a customer who is already annoyed.</p>

          <h2 style={h2s}>Separate voice from tone</h2>

          <p style={p}>That billing email is a tone failure, and Mailchimp's guide explains the distinction better than most.</p>

          <div style={{ borderLeft: "4px solid var(--accent)", background: "var(--accent-light)", borderRadius: "0 12px 12px 0", padding: "18px 24px", margin: "32px 0" }}>
            <blockquote style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 6px" }}>
              &quot;Our voice doesn&apos;t change much from day to day, but our tone changes all the time.&quot;
            </blockquote>
            <cite style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "normal", fontFamily: "var(--font-mono)" }}>Mailchimp Content Style Guide · Voice and tone</cite>
          </div>

          <p style={p}>For a model, that means two layers. The voice layer holds the dials and rules that never move. The tone layer is a short table of situations, each with its own adjustment: product launch (more enthusiastic, still matter-of-fact about numbers), error or outage (serious, no jokes, lead with what happened and what to do), help article (plain, no personality beyond clarity). Paste the voice layer into every prompt and the matching tone row for the job at hand.</p>

          <h2 style={h2s}>Test the guide on the model and keep a miss log</h2>

          <p style={p}>A voice guide written for people is usually approved in a meeting and never tested. A guide written for a model can be tested in ten minutes, so test it. Give the model three different jobs with the guide attached and read each output against the rules, line by line.</p>

          <p style={p}>Log every miss. Each one means a rule was vague, an example was missing or two rules conflicted. Fix the guide and run the same jobs again. After a few rounds, the misses get rarer and more interesting, which is how you know the guide is converging on something real.</p>

          <p style={p}>A diagnostic helps with the misses that are hard to name. <a href="/" style={a}>Content Trace</a> explains its Human Score with 32 signals in 8 sections. It doesn't know your brand rules, but a weak Voice & Perspective or Word Choice result usually marks the passages where the model slid back into its default voice. Those passages show which rule to tighten next.</p>

          <p style={p}>The payoff goes beyond the model. A guide built from dials, checkable rules and paired examples is also the guide a new freelancer needed all along.</p>

          <h2 style={h2s}>Frequently asked questions</h2>

          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>{q}</div>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}

          <p style={{ ...p, marginTop: "32px" }}>A voice guide is one part of a good brief, and <a href="/blog/prompting-for-a-better-first-draft" style={a}>Prompting for a Better First Draft</a> covers the rest. <a href="/blog/the-generic-middle-of-ai-drafts" style={a}>The Generic Middle</a> shows where voice usually fades in a long draft. And <a href="/blog/why-ai-writing-sounds-different" style={a}>Why AI Writing Sounds Different</a> explains the default voice that every vague guide falls back to.</p>

          <Sources items={[
            { label: "Mailchimp Content Style Guide: Voice and tone", href: "https://styleguide.mailchimp.com/voice-and-tone/" },
            { label: "Nielsen Norman Group: The Four Dimensions of Tone of Voice (Kate Moran)", href: "https://www.nngroup.com/articles/tone-of-voice-dimensions/" },
            { label: "Anthropic (Claude Docs): Prompting best practices", href: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
          ]} />

          <AuthorBio />

        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "48px" }}>
          <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "20px" }}>See where your draft slides back into the default voice.</div>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600, boxShadow: "0 2px 8px rgba(87,13,158,0.25)" }}>
            Try Content Trace free →
          </a>
        </div>
      </main>
    </>
  );
}
