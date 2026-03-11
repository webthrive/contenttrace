import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/Footer";
import "./globals.css";

const SITE_URL = "https://www.telltaleproof.com";
const GTM_ID = "GTM-MGW6ZLP9";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Telltale Proof — Free AI Content Detector",
    template: "%s | Telltale Proof",
  },
  description: "Free AI text detector. Analyze any content across 8 sections and 32 signals — structure, voice, cognitive fingerprinting, emotional texture, and more. Get a Human Score out of 100.",
  keywords: ["free AI content detector","AI text detector","AI writing detector","detect AI generated text","GPT detector","ChatGPT detector","human vs AI text","AI content checker","content authenticity tool","Telltale Proof"],
  authors: [{ name: "Web Thrive, LLC" }],
  creator: "Web Thrive, LLC",
  publisher: "Web Thrive, LLC",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website", url: SITE_URL, siteName: "Telltale Proof",
    title: "Telltale Proof — Free AI Content Detector",
    description: "Free AI text detector. 8 sections, 32 signals, Human Score out of 100. No account required.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telltale Proof — Free AI Content Detector",
    description: "Free AI text detector. 8 sections, 32 signals, Human Score out of 100. No account required.",
    creator: "@telltaleproof",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
        </noscript>
        {children}
        <Footer />
      </body>
    </html>
  );
}
