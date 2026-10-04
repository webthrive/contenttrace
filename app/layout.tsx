import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/Footer";
import "./globals.css";

const SITE_URL = "https://www.contenttrace.ai";
const GTM_ID = "GTM-MGW6ZLP9";
// Load tracking only on the production deployment, not on Vercel preview URLs or local builds.
const LOAD_TRACKING = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Content Trace: AI Detector, Humanizer and Content Optimizer",
    template: "%s | Content Trace",
  },
  description: "Free AI content detector that explains its score with 32 signals. Then humanize your text, optimize it for SEO or for AI answers, and compare every change before and after.",
  keywords: ["free AI content detector","AI humanizer","humanize AI text","AI content optimizer","SEO content optimizer","answer engine optimization","AI text detector","AI writing detector","detect AI generated text","GPT detector","ChatGPT detector","human vs AI text","AI content checker","content authenticity tool","Content Trace"],
  authors: [{ name: "Web Thrive, LLC" }],
  creator: "Web Thrive, LLC",
  publisher: "Web Thrive, LLC",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website", url: SITE_URL, siteName: "Content Trace",
    title: "Content Trace: AI Detector, Humanizer and Content Optimizer",
    description: "Check text for AI with 32 explained signals. Then Humanize, SEO or AI answers, with every change shown before and after.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Trace: AI Detector, Humanizer and Content Optimizer",
    description: "Check text for AI with 32 explained signals. Then Humanize, SEO or AI answers, with every change shown before and after.",
    creator: "@contenttrace",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {LOAD_TRACKING && <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />}
        <meta name="google-adsense-account" content="ca-pub-4649542076367353" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4649542076367353"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {LOAD_TRACKING && <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
        </noscript>}
        {children}
        <Footer />
      </body>
    </html>
  );
}
