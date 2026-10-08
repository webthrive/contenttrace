import { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

// Served at https://www.contenttrace.ai/sitemap.xml (submit this URL in Google Search Console).
// Blog posts are found automatically: every folder in app/blog with a page.tsx is listed,
// with lastModified taken from the post's openGraph modifiedTime (or publishedTime).
// Pages that are noindex (login, account, thank-you, paid landing pages) are left out on purpose.

export const dynamic = "force-static"; // built once at deploy time (reads app/blog from disk)

const SITE_URL = "https://www.contenttrace.ai";

// Date of the last real change to each static page. Update a date when you change that page.
const PAGES: { path: string; lastModified: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "", lastModified: "2026-10-08", changeFrequency: "weekly", priority: 1.0 },
  { path: "/pricing", lastModified: "2026-10-08", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", lastModified: "2026-10-08", changeFrequency: "monthly", priority: 0.8 },
  { path: "/manifesto", lastModified: "2026-10-08", changeFrequency: "yearly", priority: 0.7 },
  { path: "/contact", lastModified: "2026-10-08", changeFrequency: "yearly", priority: 0.6 },
  { path: "/disclaimer", lastModified: "2026-10-08", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", lastModified: "2026-10-08", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", lastModified: "2026-10-08", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", lastModified: "2026-10-08", changeFrequency: "yearly", priority: 0.3 },
];

function blogPosts(): { slug: string; lastModified: string }[] {
  const dir = path.join(process.cwd(), "app", "blog");
  const posts: { slug: string; lastModified: string }[] = [];
  for (const slug of fs.readdirSync(dir)) {
    const file = path.join(dir, slug, "page.tsx");
    if (slug.startsWith("_") || !fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    if (/index:\s*false/.test(src)) continue;
    const date = /modifiedTime:\s*"([\d-]+)"/.exec(src)?.[1] ?? /publishedTime:\s*"([\d-]+)"/.exec(src)?.[1] ?? "2026-10-08";
    posts.push({ slug, lastModified: date });
  }
  return posts.sort((a, b) => b.lastModified.localeCompare(a.lastModified) || a.slug.localeCompare(b.slug));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = blogPosts();
  const newestPost = posts[0]?.lastModified ?? "2026-10-08";
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: new Date(p.lastModified), changeFrequency: p.changeFrequency, priority: p.priority })),
    { url: `${SITE_URL}/blog`, lastModified: new Date(newestPost > "2026-10-08" ? newestPost : "2026-10-08"), changeFrequency: "weekly", priority: 0.9 },
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.lastModified), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
