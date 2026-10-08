import localFont from "next/font/local";
import "../blog/blog.css";

// The manifesto uses the blog "Trace Lab" theme (same fonts and tokens).
const bricolage = localFont({
  src: [
    { path: "../blog/fonts/bricolage-grotesque-latin-400-normal.woff2", weight: "400" },
    { path: "../blog/fonts/bricolage-grotesque-latin-600-normal.woff2", weight: "600" },
    { path: "../blog/fonts/bricolage-grotesque-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-blog",
  display: "swap",
});
const jetbrains = localFont({
  src: [
    { path: "../blog/fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../blog/fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-blog-mono",
  display: "swap",
});

export default function ManifestoLayout({ children }: { children: React.ReactNode }) {
  return <div className={`blog-theme ${bricolage.variable} ${jetbrains.variable}`}>{children}</div>;
}
