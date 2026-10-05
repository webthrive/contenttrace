import type { Metadata } from "next";
import AnalyzerPage from "../../_page";

// Paid search landing page for "humanize ai writing" searches. Not for organic search.
export const metadata: Metadata = {
  title: { absolute: "Humanize AI Writing Free: Make AI Text Sound Human | Content Trace" },
  description: "Paste your AI draft and get a version that reads like a person wrote it. Every change shown side by side. Your facts stay. Free to try, no account needed.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function HumanizeLandingPage() {
  return <AnalyzerPage variant="humanize" />;
}
