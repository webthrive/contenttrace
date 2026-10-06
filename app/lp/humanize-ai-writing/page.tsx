import type { Metadata } from "next";
import AnalyzerPage from "../../_page";

// Paid search landing page for "humanize ai writing" searches. Not for organic search.
export const metadata: Metadata = {
  title: { absolute: "Humanize AI Writing Free: Original Content in Your Voice | Content Trace" },
  description: "Turn AI drafts into clear, original content in your own voice. See every change side by side, keep your facts, and add the details only you know. Free to try.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function HumanizeLandingPage() {
  return <AnalyzerPage variant="humanize" />;
}
