// Social share (OpenGraph / X) images. Files are 1200 x 630 JPEG in public/og/,
// made by docs/blog-images/render-og.mjs. JPEG, not WebP: LinkedIn does not show WebP previews.
export function ogImage(name: string, alt: string) {
  return { url: `/og/${name}.jpg`, width: 1200, height: 630, alt, type: "image/jpeg" };
}

