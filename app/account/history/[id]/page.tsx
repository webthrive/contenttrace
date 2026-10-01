import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SavedAnalysis from "./SavedAnalysis";

export const metadata: Metadata = {
  title: "Saved analysis",
  robots: { index: false, follow: false },
};

export default async function SavedAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Nav current="/account" />
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 16px 80px", fontFamily: "var(--font)" }}>
        <SavedAnalysis id={id} />
      </main>
    </>
  );
}
