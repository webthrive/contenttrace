import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

const SITE_URL = "https://www.contenttrace.ai";
const IMG = ogImage("contact", "Contact Content Trace: questions? Talk to a human.");

// The contact page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Content Trace with questions about the AI checker, the Content Optimizer, plans or billing.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact Content Trace",
    description: "Questions about Content Trace, plans or billing? Get in touch.",
    url: `${SITE_URL}/contact`,
    siteName: "Content Trace",
    type: "website",
    images: [IMG],
  },
  twitter: { card: "summary_large_image", images: [IMG] },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
