import type { Metadata } from "next";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: { absolute: "AI Detector and Humanizer for SEO and AI Answers | Content Trace" },
  description: "Free AI content detector that explains its score with 32 signals. Then humanize your text, optimize it for SEO or for AI answers, and compare every change before and after.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Content Trace: AI Detector, Humanizer and Content Optimizer",
    description: "Check text for AI with 32 explained signals. Then Humanize, SEO or AI answers, with every change shown before and after.",
    url: SITE_URL,
    siteName: "Content Trace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Trace: AI Detector, Humanizer and Content Optimizer",
    description: "Check text for AI with 32 explained signals. Then Humanize, SEO or AI answers, with every change shown before and after.",
  },
};

export { default } from "./_page";
