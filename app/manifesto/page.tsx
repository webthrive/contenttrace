import Nav from "@/components/Nav";
import type { Metadata } from "next";
import Image from "next/image";

const SITE_URL = "https://www.contenttrace.ai";
const HERO = "/blog/manifesto/hero.webp";

export const metadata: Metadata = {
  title: "Manifesto",
  description: "What ContentTrace believes about AI-assisted writing: use AI, then do the work. Eight principles for content that readers, search engines and AI answers actually value.",
  alternates: { canonical: `${SITE_URL}/manifesto` },
  openGraph: {
    title: "The ContentTrace Manifesto",
    description: "Use AI. Then do the work. Eight principles for AI-assisted writing that is worth reading.",
    url: `${SITE_URL}/manifesto`,
    siteName: "Content Trace",
    type: "article",
    images: [{ url: HERO, width: 1600, height: 900, alt: "The ContentTrace manifesto: Use AI. Then do the work." }],
  },
  twitter: { card: "summary_large_image", images: [HERO] },
  robots: { index: true, follow: true },
};

const PRINCIPLES: { title: string; body: string[] }[] = [
  {
    title: "Use AI. Then do the work.",
    body: [
      "We are not here to talk anyone out of AI. A model that produces a decent first draft in forty seconds is a gift, and pretending otherwise is nostalgia. Google says it rewards helpful content however it gets made, and we agree with that standard.",
      "But a draft is not a post. The forty seconds saved you from the blank page. The edit is still yours, and the edit is where the value lives.",
    ],
  },
  {
    title: "The reader decides.",
    body: [
      "Not a detector, not an algorithm, not us. A person either finishes the piece or leaves after two paragraphs. Rankings and AI citations follow that behavior more than any trick ever has.",
      "So every signal we measure points back to one question: would a busy, smart reader feel their time was well spent?",
    ],
  },
  {
    title: "Specific beats polished.",
    body: [
      "AI drafts are fluent, balanced and complete. That is exactly why they are forgettable. What readers remember is the inconvenient detail: the number that was looked up, the client that didn't fit the pattern, the thing that went wrong.",
      "Polish is cheap now. Specifics still cost something, which is why they are worth so much.",
    ],
  },
  {
    title: "Edit. Never invent.",
    body: [
      "Our optimizer works like an editor, not a ghostwriter. It keeps your facts, names, numbers and quotes. It does not add opinions you never held or stories that never happened. When a real example would make a passage stronger, it leaves a marker asking you for one.",
      "Fabricated experience can raise a score. It also destroys trust the first time a reader checks. We would rather show a smaller gain that is true.",
    ],
  },
  {
    title: "A score is a diagnostic, not a verdict.",
    body: [
      "The Human Score is useful the way a blood pressure reading is useful: it tells you where to look. It is not a judgment of a writer, a student or an employee, and it should never be the only evidence in any decision about a person.",
      "The interesting part is never the total. It is which section is pulling it down, and what that says about the edit that still needs doing.",
    ],
  },
  {
    title: "Write for people.",
    body: [
      "Take a position. Admit what you don't know. Vary the rhythm. Cut the filler that signals care without being careful. None of this is about sounding human for its own sake. It is about writing like someone who has thought about the topic, because readers can tell.",
    ],
  },
  {
    title: "Format for machines.",
    body: [
      "Good writing still has to be found. Search engines and AI answer engines reward clear structure: the main point early, headings that match real questions, passages that make sense when quoted on their own.",
      "We treat that as formatting, not as a substitute for substance. Structure gets a strong piece seen. It cannot rescue a weak one.",
    ],
  },
  {
    title: "Say where we fall short.",
    body: [
      "No tool reads writing perfectly, ours included. Heavily rewritten AI text can score as human. Very short texts give weak signals. Some signals we once trusted turned out, on testing, to say less than we thought, and we changed the engine when the data said so.",
      "We will keep publishing what works, what doesn't and what we changed. A tool that asks writers to be honest should be honest about itself.",
    ],
  },
];

export default function ManifestoPage() {
  return (
    <><Nav current="/manifesto" />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--red)", fontFamily: "var(--font-mono)", marginBottom: "14px" }}>Manifesto</div>
        <h1 style={{ fontSize: "46px", color: "var(--text-primary)", marginBottom: "18px" }}>Use AI. Then do the <span className="grad-text">work.</span></h1>
        <p style={{ fontSize: "19px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "32px" }}>
          ContentTrace exists for people who write with AI and want the finished piece to be better than the draft. These are the principles behind the product, and behind everything we publish.
        </p>

        <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #2a1846", marginBottom: "48px" }}>
          <Image src={HERO} alt="The eight ContentTrace principles listed beside the line: Use AI. Then do the work." width={1600} height={900} priority sizes="(max-width: 768px) 100vw, 720px" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>

        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PRINCIPLES.map((pr, i) => (
            <li key={pr.title} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: "0 8px", padding: "28px 0", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "22px", fontWeight: 500, color: i < 2 ? "var(--red)" : "var(--accent)", lineHeight: 1.3 }}>{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h2 style={{ fontSize: "26px", color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.2 }}>{pr.title}</h2>
                {pr.body.map((para, k) => (
                  <p key={k} style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: k < pr.body.length - 1 ? "14px" : 0 }}>{para}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", marginTop: "8px" }}>
          <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "6px" }}>
            Written by <a href="https://www.webthrive.io/home" target="_blank" rel="noopener" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "underline" }}>Colin H</a>, who builds ContentTrace at Web Thrive.
          </p>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "28px" }}>
            More on how the product works on the <a href="/about" style={{ color: "var(--accent)", textDecoration: "underline" }}>About page</a>, and practical guides on <a href="/blog" style={{ color: "var(--accent)", textDecoration: "underline" }}>the blog</a>.
          </p>
          <a href="/" className="cta-dark" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: 600 }}>
            Check your next draft →
          </a>
        </div>
      </main>
    </>
  );
}
