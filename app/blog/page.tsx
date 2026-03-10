import type { Metadata } from "next";
import BlogIndex from "./_blog";

const SITE_URL = "https://www.telltaleproof.com";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on AI content detection, what makes writing feel human, and how to understand the signals that separate human prose from AI-generated text.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog | TelltaleProof",
    description: "Articles on AI content detection and what makes writing feel human.",
    url: `${SITE_URL}/blog`,
    siteName: "TelltaleProof",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return <BlogIndex />;
}
