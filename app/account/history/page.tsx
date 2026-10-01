import type { Metadata } from "next";
import Nav from "@/components/Nav";
import HistoryList from "./HistoryList";

export const metadata: Metadata = {
  title: "Your past analyses",
  robots: { index: false, follow: false },
};

export default function HistoryPage() {
  return (
    <>
      <Nav current="/account" />
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 16px 80px", fontFamily: "var(--font)" }}>
        <HistoryList />
      </main>
    </>
  );
}
