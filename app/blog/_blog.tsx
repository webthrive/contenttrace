"use client";
import Nav from "@/components/Nav";
import Image from "next/image";

type Post = { slug: string; title: string; date: string; readTime: string; excerpt: string; tag: string; image?: string; imageAlt?: string };

const POSTS: Post[] = [
  {
    slug: "how-to-read-a-detection-report",
    title: "How to Read a Detection Report: Making Sense of Your Score",
    date: "April 26, 2026",
    readTime: "8 min read",
    excerpt: "A single percentage tells you almost nothing useful. Here\'s how to read AI detection results across categories — and use them as an editing tool rather than a verdict.",
    tag: "Guide",
  },
  {
    slug: "ai-content-policies-at-work",
    title: "AI Content Policies at Work: What Teams Are Actually Doing in 2026",
    date: "April 21, 2026",
    readTime: "9 min read",
    excerpt: "The debate over whether to allow AI content has given way to a messier, more practical question: how do you govern it? Here\'s what\'s working and what\'s not.",
    tag: "Guide",
  },
  {
    slug: "the-specificity-test",
    title: "The Specificity Test: One Signal That Separates Human Writing From AI",
    date: "April 14, 2026",
    readTime: "8 min read",
    excerpt: "AI writing is comprehensive, accurate, and almost entirely generic. The single most reliable tell isn\'t perplexity or sentence rhythm — it\'s the absence of specific, inconvenient detail.",
    tag: "Explainer",
  },
  {
    slug: "ai-detection-and-seo",
    title: "AI Detection and SEO: Does Google Actually Penalize AI Content?",
    date: "April 7, 2026",
    readTime: "9 min read",
    excerpt: "Google says it rewards helpful content regardless of how it was made. The reality is more complicated — and the E-E-A-T gap that AI content can\'t close on its own explains why.",
    tag: "Analysis",
  },
  {
    slug: "how-to-humanize-ai-content",
    title: "How to Humanize AI Content: A Practical Guide",
    date: "March 29, 2026",
    readTime: "10 min read",
    excerpt: "AI drafts are a useful starting point, but they need real editing before they're worth publishing. Here's the practical framework for making AI content read like it was actually written by a person.",
    tag: "Guide",
    image: "/blog/how-to-humanize-ai-content/hero.webp",
    imageAlt: "Six editing passes that turn an AI draft into human writing",
  },
  {
    slug: "why-ai-writing-sounds-different",
    title: "Why AI Writing Sounds Different (Even When It's Technically Correct)",
    date: "March 24, 2026",
    readTime: "10 min read",
    excerpt: "AI writing is grammatically flawless and factually reasonable. So why does it feel off? The answer has less to do with correctness and more to do with how humans actually think on the page.",
    tag: "Analysis",
  },
  {
    slug: "how-ai-text-detection-works",
    title: "How AI Text Detection Actually Works",
    date: "March 19, 2026",
    readTime: "9 min read",
    excerpt: "Most AI detectors feel like a black box. Here's what's actually happening under the hood, and why some approaches are far more reliable than others.",
    tag: "Explainer",
  },
  {
    slug: "why-your-ai-detector-score-keeps-changing",
    title: "Why Your AI Detector Score Keeps Changing (And What to Do About It)",
    date: "March 15, 2026",
    readTime: "9 min read",
    excerpt: "Run the same text through three AI detectors and get three different scores. Here's why that happens, which variation is signal vs. noise, and how to get more reliable results.",
    tag: "Explainer",
  },
  {
    slug: "behavioral-signals-that-give-ai-writing-away",
    title: "The 8 Behavioral Signals That Give AI Writing Away",
    date: "March 11, 2026",
    readTime: "10 min read",
    excerpt: "Statistical signals like perplexity are easy to game. Behavioral signals aren't. Here are the 8 patterns that reveal AI-generated text even after editing — and why they're so hard to fake.",
    tag: "Guide",
  },
  {
    slug: "ai-detection-in-education",
    title: "AI Detection in Education: What Schools Are Getting Wrong",
    date: "March 7, 2026",
    readTime: "10 min read",
    excerpt: "Schools are deploying AI detectors with the confidence of lie detectors. The tools aren't built for that, and students are paying the price. Here's what actually works.",
    tag: "Opinion",
  },
  {
    slug: "can-ai-detectors-be-fooled",
    title: "Can AI Detectors Be Fooled? What the Research Actually Shows",
    date: "March 3, 2026",
    readTime: "10 min read",
    excerpt: "There's a whole industry built around bypassing AI detectors. Some techniques genuinely work. Here's what actually fools them, what doesn't, and what that tells you about how to read a score.",
    tag: "Analysis",
  },
];

const TAG_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Explainer: { color: "#0a7373", bg: "rgba(10,115,115,0.08)", border: "rgba(10,115,115,0.2)" },
  Analysis:  { color: "#c47a00", bg: "rgba(196,122,0,0.08)", border: "rgba(196,122,0,0.2)" },
  Guide:     { color: "#c43302", bg: "rgba(196,51,2,0.08)", border: "rgba(196,51,2,0.2)" },
  Opinion:   { color: "#6b3fa0", bg: "rgba(107,63,160,0.08)", border: "rgba(107,63,160,0.2)" },
};

export default function BlogIndex() {
  return (
    <><Nav current="/blog" />
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>
      

      <h1 style={{ fontSize: "42px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>Blog</h1>
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
                  <Image src={post.image} alt={post.imageAlt ?? ""} width={1600} height={900} sizes="(max-width: 808px) 100vw, 760px" style={{ width: "100%", height: "auto", display: "block" }} />
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
