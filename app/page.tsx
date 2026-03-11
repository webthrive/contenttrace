import type { Metadata } from "next";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: "Content Trace — Free AI Content Detector",
  description: "Free AI text detector. Analyze any content across 8 sections and 32 signals — structure, voice, cognitive fingerprinting, emotional texture, and more. Get a Human Score out of 100. No account required.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Content Trace — Free AI Content Detector",
    description: "Free AI text detector. 8 sections, 32 signals, Human Score out of 100. No account required.",
    url: SITE_URL,
    siteName: "Content Trace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Trace — Free AI Content Detector",
    description: "Free AI text detector. 8 sections, 32 signals, Human Score out of 100.",
  },
};

export { default } from "./_page";
