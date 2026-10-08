import Nav from "@/components/Nav";
import { ogImage } from "@/lib/og";
import type { Metadata } from "next";
import BlogIndex from "./_blog";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on AI content detection, what makes writing feel human, and how to understand the signals that separate human prose from AI-generated text.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog | Content Trace",
    description: "Articles on AI content detection and what makes writing feel human.",
    url: `${SITE_URL}/blog`,
    siteName: "Content Trace",
    type: "website",
    images: [ogImage("blog", "The Content Trace blog: notes on writing that reads human.")],
  },
  twitter: { card: "summary_large_image", images: [ogImage("blog", "The Content Trace blog: notes on writing that reads human.")] },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return <BlogIndex />;
}
