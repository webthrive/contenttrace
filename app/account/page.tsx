import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AccountPanel from "./AccountPanel";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <Nav current="/account" />
      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 16px 80px", fontFamily: "var(--font)" }}>
        <AccountPanel />
      </main>
    </>
  );
}
