import localFont from "next/font/local";
import "./blog.css";

// Blog-only type: Bricolage Grotesque (text, headings) + JetBrains Mono (labels, meta).
const bricolage = localFont({
  src: [
    { path: "./fonts/bricolage-grotesque-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/bricolage-grotesque-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/bricolage-grotesque-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-blog",
  display: "swap",
});
const jetbrains = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-blog-mono",
  display: "swap",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className={`blog-theme ${bricolage.variable} ${jetbrains.variable}`}>{children}</div>;
}
