"use client";

const POSTS = [
  {
    slug: "how-ai-text-detection-works",
    title: "How AI Text Detection Actually Works",
    date: "March 10, 2026",
    readTime: "6 min read",
    excerpt: "Most AI detectors feel like a black box — you paste text and get a number. Here's what's actually happening under the hood, and why some approaches are more reliable than others.",
    tag: "Explainer",
  },
  {
    slug: "why-ai-writing-sounds-different",
    title: "Why AI Writing Sounds Different (Even When It's Technically Correct)",
    date: "March 10, 2026",
    readTime: "7 min read",
    excerpt: "AI writing is grammatically flawless and factually reasonable. So why does it feel off? The answer has less to do with correctness and more to do with how humans actually think on the page.",
    tag: "Analysis",
  },
  {
    slug: "how-to-humanize-ai-content",
    title: "How to Humanize AI Content: A Practical Guide",
    date: "March 10, 2026",
    readTime: "8 min read",
    excerpt: "AI-generated content can be a useful starting point — but it needs real human editing before it's ready to publish. Here's a practical framework for making AI content read authentically.",
    tag: "Guide",
  },
];

const TAG_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Explainer: { color: "#0a7373", bg: "rgba(10,115,115,0.08)", border: "rgba(10,115,115,0.2)" },
  Analysis:  { color: "#c47a00", bg: "rgba(196,122,0,0.08)", border: "rgba(196,122,0,0.2)" },
  Guide:     { color: "#c43302", bg: "rgba(196,51,2,0.08)", border: "rgba(196,51,2,0.2)" },
};

export default function BlogIndex() {
  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px", fontFamily: "var(--font)" }}>
      <a href="/" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block", marginBottom: "32px" }}>← Back to Telltale Proof</a>

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
  );
}
