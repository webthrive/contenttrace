import type { Metadata } from "next";
import Nav from "@/components/Nav";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Content Trace to use Pro or your Word Pack.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <Nav current="/login" />
      <main style={{ maxWidth: "440px", margin: "0 auto", padding: "64px 16px 80px", fontFamily: "var(--font)" }}>
        <LoginForm />
      </main>
    </>
  );
}
