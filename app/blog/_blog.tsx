"use client";
import Nav from "@/components/Nav";
import Image from "next/image";

type Post = { slug: string; title: string; date: string; readTime: string; excerpt: string; tag: string; image?: string; imageAlt?: string };

const POSTS: Post[] = [
  {
    slug: "how-contenttrace-is-calibrated",
    title: "How ContentTrace Is Calibrated: Testing Against Human and AI Writing",
    date: "October 6, 2026",
    readTime: "7 min read",
    excerpt: "ContentTrace's internal Oct 3, 2026 test: 162 samples, leave-one-out, 89% accuracy, AUC up to 94.8%, and the limits that still matter.",
    tag: "Explainer",
    image: "/blog/how-contenttrace-is-calibrated/hero.webp",
    imageAlt: "A lens over boastful detector marketing strikes out 99% accurate and shows the internal results instead: 71 of 75 human texts and 62 of 75 AI texts.",
  },
  {
    slug: "editor-not-author-content-optimizer",
    title: "Editor, Not Author: How the Content Optimizer Avoids Inventing Facts",
    date: "October 4, 2026",
    readTime: "7 min read",
    excerpt: "The ContentTrace Content Optimizer rewrites for clarity, SEO or AI answers while keeping every fact, name, number and quote. Here is how the fact guard works.",
    tag: "Explainer",
    image: "/blog/editor-not-author-content-optimizer/hero.webp",
    imageAlt: "A lens over generic marketing copy strikes out the invented claim over 500 clients and leaves a marker that says Add a real example.",
  },
  {
    slug: "inside-the-32-signals",
    title: "Inside the 32 Signals: How ContentTrace Reads a Draft",
    date: "October 3, 2026",
    readTime: "8 min read",
    excerpt: "How ContentTrace scores a draft: Claude as an editor with a fixed rubric at temperature 0, 8 sections, content types and calibration. The full method.",
    tag: "Explainer",
    image: "/blog/inside-the-32-signals/hero.webp",
    imageAlt: "A lens over dim, generic AI-style text strikes out the phrase several key factors and replaces it with 32 signals, each with two notes.",
  },
  {
    slug: "the-generic-middle-of-ai-drafts",
    title: "The Generic Middle: Why AI Drafts Sag After the Intro",
    date: "May 20, 2026",
    readTime: "8 min read",
    excerpt: "AI drafts usually open well and go flat by section two. Why the middle sags, how readers scan past it, and how to rebuild it so the page earns the scroll.",
    tag: "Analysis",
    image: "/blog/the-generic-middle-of-ai-drafts/hero.webp",
    imageAlt: "A signal line that stays lively through the intro of an AI draft, then flattens across identical middle sections, showing where readers start to drift.",
  },
  {
    slug: "prompting-for-a-better-first-draft",
    title: "Prompting for a Better First Draft: What to Give the Model Before It Writes",
    date: "May 12, 2026",
    readTime: "8 min read",
    excerpt: "AI writing prompts for blog posts work when they carry five inputs: the reader, a position, real material, sources and positive constraints.",
    tag: "Guide",
    image: "/blog/prompting-for-a-better-first-draft/hero.webp",
    imageAlt: "A one-line prompt struck through and replaced by a five-part brief with a reader, a position and real examples, showing that inputs decide how much editing is left.",
  },
  {
    slug: "google-is-fine-with-ai-assisted-content",
    title: "Google Is Fine With AI-Assisted Content. Readers Are the Harder Audience",
    date: "May 4, 2026",
    readTime: "8 min read",
    excerpt: "Is AI content bad for SEO? Google's own guidance says no, if it helps people. Readers are stricter: they trust suspected AI writing far less.",
    tag: "Analysis",
    image: "/blog/google-is-fine-with-ai-assisted-content/hero.webp",
    imageAlt: "A Google checklist marked as passed beside a reader trust meter that drops when the copy reads generic, showing that readers set the stricter test.",
  },
  {
    slug: "how-to-read-a-detection-report",
    title: "How to Read a Detection Report: Treat the Score as an Editing Map",
    date: "April 26, 2026",
    readTime: "8 min read",
    excerpt: "A single score says almost nothing useful. Read the section breakdown instead, and a writing report becomes a precise map of what to edit next.",
    tag: "Guide",
    image: "/blog/how-to-read-a-detection-report/hero.webp",
    imageAlt: "A dark writing report with one overall score above a set of section bars, where the lowest bar is marked in coral as the next edit to make.",
  },
  {
    slug: "ai-content-policies-at-work",
    title: "AI Writing Policies at Work: How Strong Teams Govern AI-Assisted Content",
    date: "April 21, 2026",
    readTime: "8 min read",
    excerpt: "Banning AI fails and disclosure logs turn into theater. The AI content policies that work set a quality bar, a real review step and honest disclosure.",
    tag: "Guide",
    image: "/blog/ai-content-policies-at-work/hero.webp",
    imageAlt: "A dark policy checklist where process rules such as logging tool use are struck out in coral and output standards such as sourced claims and a named editor are checked in violet.",
  },
  {
    slug: "the-specificity-test",
    title: "The Specificity Test: The Detail That Makes Writing Memorable",
    date: "April 14, 2026",
    readTime: "7 min read",
    excerpt: "AI drafts are accurate and generic. The fastest way to improve one is the specificity test: find where specific, inconvenient detail is missing and add it.",
    tag: "Explainer",
    image: "/blog/the-specificity-test/hero.webp",
    imageAlt: "A lens over dim, generic AI text strikes out a vague claim in coral and highlights an exact number and date in violet, showing what specific detail adds.",
  },
  {
    slug: "ai-detection-and-seo",
    title: "Does Google Penalize AI Content? What Search Actually Rewards",
    date: "April 7, 2026",
    readTime: "7 min read",
    excerpt: "Google rewards helpful, people-first pages however they are made. What that means for AI-assisted writers, and how to meet the bar in search.",
    tag: "Analysis",
    image: "/blog/ai-detection-and-seo/hero.webp",
    imageAlt: "A lens over generic, keyword-stuffed SEO copy strikes out a filler phrase and highlights the first-hand detail and named source that search rewards.",
  },
  {
    slug: "how-to-humanize-ai-content",
    title: "How to Humanize AI Content: A Practical Guide",
    date: "March 29, 2026",
    readTime: "10 min read",
    excerpt: "AI drafts are a useful starting point, but they need real editing before they're worth publishing. A six-pass framework for making AI content read like a person wrote it.",
    tag: "Guide",
    image: "/blog/how-to-humanize-ai-content/hero.webp",
    imageAlt: "An AI draft marked up across six editing passes, with filler and hedges cut and real examples added, and a human signal bar rising from low to high.",
  },
  {
    slug: "why-ai-writing-sounds-different",
    title: "Why AI Writing Sounds Different (Even When It's Technically Correct)",
    date: "March 24, 2026",
    readTime: "7 min read",
    excerpt: "AI drafts are grammatically clean and factually reasonable, yet readers feel something is off. The cause is missing evidence of a mind at work, and it can be fixed.",
    tag: "Analysis",
    image: "/blog/why-ai-writing-sounds-different/hero.webp",
    imageAlt: "A lens over smooth, hedged AI-style prose strikes out a reflexive hedge and highlights the kind of specific, real detail readers trust.",
  },
  {
    slug: "how-ai-text-detection-works",
    title: "How AI Text Detection Actually Works",
    date: "March 19, 2026",
    readTime: "8 min read",
    excerpt: "Perplexity, trained classifiers and rubric-based reading: how each AI text detection approach works, where it breaks, and why burstiness got demoted.",
    tag: "Explainer",
    image: "/blog/how-ai-text-detection-works/hero.webp",
    imageAlt: "A lens over dim AI-style text strikes out a one-number verdict and highlights the three ways detectors actually read writing.",
  },
  {
    slug: "why-your-ai-detector-score-keeps-changing",
    title: "Why Your AI Detector Score Keeps Changing (And What to Do About It)",
    date: "March 15, 2026",
    readTime: "7 min read",
    excerpt: "Same text, different tools, different scores. Why AI detector results vary across tools and runs, which variation matters, and how to read scores well.",
    tag: "Explainer",
    image: "/blog/why-your-ai-detector-score-keeps-changing/hero.webp",
    imageAlt: "Score bars from four tools disagree about the same text, next to a section breakdown that points to the one part of the draft worth editing.",
  },
  {
    slug: "behavioral-signals-that-give-ai-writing-away",
    title: "The 8 Signals That Give AI Writing Away (and What Readers Finish)",
    date: "March 11, 2026",
    readTime: "9 min read",
    excerpt: "Eight behavioral signals separate raw AI content from writing people read to the end. What each one looks like, and how to add it to an AI-assisted draft.",
    tag: "Guide",
    image: "/blog/behavioral-signals-that-give-ai-writing-away/hero.webp",
    imageAlt: "A gradient lens over dim AI-style text cuts a reflexive hedge and highlights a remembered detail, showing the signals that keep a reader reading.",
  },
  {
    slug: "ai-detection-in-education",
    title: "AI Detection in Education: What Schools Are Getting Wrong",
    date: "March 7, 2026",
    readTime: "8 min read",
    excerpt: "Schools treat AI detector scores like verdicts. A score is never the only evidence about a student. What fair, workable practice looks like for teachers.",
    tag: "Opinion",
    image: "/blog/ai-detection-in-education/hero.webp",
    imageAlt: "A gradient lens over a dim student essay strikes out a bare detector score and highlights a five-minute conversation, showing that a score is one piece of evidence.",
  },
  {
    slug: "can-ai-detectors-be-fooled",
    title: "Can AI Detectors Be Fooled? What the Research Actually Shows",
    date: "March 3, 2026",
    readTime: "9 min read",
    excerpt: "Yes, paraphrasers can fool AI detectors, and the research proves it. Why beating the score is the wrong goal for AI content, and what to aim for instead.",
    tag: "Analysis",
    image: "/blog/can-ai-detectors-be-fooled/hero.webp",
    imageAlt: "A gradient lens over dim AI-style text strikes out a synonym-swap trick and highlights a real example, showing that real detail beats disguise.",
  },
];

const TAG_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Explainer: { color: "#570d9e", bg: "rgba(87,13,158,0.07)", border: "rgba(87,13,158,0.22)" },
  Analysis:  { color: "#a35f00", bg: "rgba(196,122,0,0.08)", border: "rgba(196,122,0,0.24)" },
  Guide:     { color: "#c42e4a", bg: "rgba(236,72,96,0.08)", border: "rgba(236,72,96,0.26)" },
  Opinion:   { color: "#140a24", bg: "rgba(20,10,36,0.06)", border: "rgba(20,10,36,0.2)" },
};

export default function BlogIndex() {
  return (
    <><Nav current="/blog" />
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>
      

      <h1 style={{ fontSize: "42px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>Content<span className="grad-text">Trace</span> Blog</h1>
      <p style={{ fontSize: "17px", color: "var(--text-secondary)", marginBottom: "48px", lineHeight: "1.65" }}>
        Articles on AI content detection, what makes writing feel human, and how to understand the signals that separate authentic prose from generated text.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {POSTS.map((post) => {
          const tag = TAG_COLORS[post.tag];
          return (
            <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", border: "1px solid var(--border)", borderRadius: "14px", padding: "28px 32px", background: "var(--bg-card)", boxShadow: "0 1px 6px rgba(1,2,33,0.05)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(1,2,33,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 6px rgba(1,2,33,0.05)")}>
              {post.image && (
                <div style={{ margin: "-28px -32px 20px", borderBottom: "1px solid var(--border)", overflow: "hidden", borderRadius: "14px 14px 0 0" }}>
                  <Image src={post.image} alt={post.imageAlt ?? ""} width={1600} height={900} sizes="(max-width: 808px) 100vw, 760px" style={{ width: "100%", height: "auto", aspectRatio: "2.4 / 1", objectFit: "cover", objectPosition: "50% 45%", display: "block" }} />
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: tag.color, background: tag.bg, border: `1px solid ${tag.border}`, padding: "3px 10px", borderRadius: "8px" }}>{post.tag}</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{post.date} · {post.readTime}</span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{post.title}</h2>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.65", marginBottom: "16px" }}>{post.excerpt}</p>
              <span style={{ fontSize: "14px", color: "var(--accent)", fontWeight: 600 }}>Read article →</span>
            </a>
          );
        })}
      </div>
    </main>
    </>
  );
}
