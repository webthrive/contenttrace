import Image from "next/image";

export const SITE_URL = "https://www.contenttrace.ai";

export const AUTHOR = {
  name: "Colin H",
  url: "https://www.webthrive.io/home",
  bio: "He has spent 20+ years in B2B SaaS marketing, running content, SEO and AEO programs, and now builds them around AI-assisted content production.",
};

type ArticleSchemaProps = {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // ISO date, e.g. 2026-03-29
  dateModified?: string;
  image: string; // path under /public, e.g. /blog/slug/hero.webp
  faq?: { q: string; a: string }[];
};

/** Article (+ optional FAQPage) JSON-LD for a blog post. */
export function ArticleSchema({ slug, title, description, datePublished, dateModified, image, faq }: ArticleSchemaProps) {
  const url = `${SITE_URL}/blog/${slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      headline: title,
      description,
      image: `${SITE_URL}${image}`,
      datePublished,
      dateModified: dateModified ?? datePublished,
      mainEntityOfPage: url,
      author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
      publisher: { "@type": "Organization", name: "ContentTrace", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` } },
    },
  ];
  if (faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    });
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
  );
}

/** Byline row under the H1. */
export function Byline({ date, readTime, updated }: { date: string; readTime: string; updated?: string }) {
  return (
    <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "28px" }}>
      {date} · {readTime} · By <a href="/about" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>{AUTHOR.name}</a>
      {updated ? <> · Updated {updated}</> : null}
    </div>
  );
}

/** 16:9 hero image. */
export function BlogHero({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #2a1846", marginBottom: "32px" }}>
      <Image src={src} alt={alt} width={1600} height={900} priority sizes="(max-width: 748px) 100vw, 700px" style={{ width: "100%", height: "auto", display: "block" }} />
    </div>
  );
}

/** Inline figure with caption. */
export function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure style={{ margin: "32px 0" }}>
      <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
        <Image src={src} alt={alt} width={1400} height={784} sizes="(max-width: 748px) 100vw, 700px" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
      <figcaption style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "10px", lineHeight: 1.5 }}>{caption}</figcaption>
    </figure>
  );
}

/** Sources list. */
export function Sources({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div style={{ marginTop: "40px" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "10px" }}>Sources</div>
      <ol style={{ paddingLeft: "20px", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
        {items.map((s) => (
          <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>{s.label}</a></li>
        ))}
      </ol>
    </div>
  );
}

/** Author bio box at the end of a post. */
export function AuthorBio() {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", padding: "18px 20px", marginTop: "40px" }}>
      <div aria-hidden style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontFamily: "var(--font-mono)", flexShrink: 0 }}>CH</div>
      <div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>About the author</div>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          <a href={AUTHOR.url} target="_blank" rel="noopener" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "underline" }}>{AUTHOR.name}</a> builds ContentTrace at Web Thrive. {AUTHOR.bio}{" "}
          <a href="/manifesto" style={{ color: "var(--accent)", textDecoration: "underline" }}>Read the ContentTrace manifesto</a>
        </p>
      </div>
    </div>
  );
}
