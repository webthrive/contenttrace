import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

const SITE_URL = "https://www.contenttrace.ai";

export const metadata: Metadata = {
  title: { absolute: "Humanize AI Writing for SEO and AI Answers | Content Trace" },
  description: "Turn AI drafts into content that reads human and ranks. Humanize, optimize for SEO or for AI answers, and see every change before and after. Free AI check included.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Content Trace: Humanize AI Writing, Then Optimize It",
    description: "Check text for AI with 32 explained signals. Then Humanize, SEO or AI answers, with every change shown before and after.",
    url: SITE_URL,
    siteName: "Content Trace",
    type: "website",
    images: [ogImage("home", "Content Trace: AI drafts that read human. Check, humanize and optimize your writing.")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Trace: Humanize AI Writing, Then Optimize It",
    description: "Check text for AI with 32 explained signals. Then Humanize, SEO or AI answers, with every change shown before and after.",
    images: [ogImage("home", "Content Trace: AI drafts that read human. Check, humanize and optimize your writing.")],
  },
};

export { default } from "./_page";
