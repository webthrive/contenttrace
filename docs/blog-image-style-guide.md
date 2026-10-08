# ContentTrace Blog: Image Style Guide ("Trace Lab")

All blog images are built as HTML/SVG and rendered to WebP. No stock photos. No AI photo art. No faces.

## 1. Look

- **Style name:** "Trace Lab." ContentTrace looks at writing the way a forensic tool looks at evidence.
- Dark violet-black background with a soft violet/coral glow.
- Signature motifs (use at least one per hero):
  - **The lens:** a gradient magnifier over background text. Inside the lens: the "after" version, with filler struck out in coral and real details highlighted in violet.
  - **The signal trace:** a thin gradient line with spikes, like an ECG. Drawn by `trace.js`, unique per post (seeded by slug).
  - **Background text:** dim monospace AI-style copy that the lens "inspects."
- **Heroes are dark. Inline images are light.** Inline images use the light variant (`<div id="canvas" class="inline light">`): white cards on `#fbfaff`, same fonts, numerals and color meaning. This keeps the article easy to read.
- Every image explains one idea from the post. If it does not, cut it.

## 2. Color (from the logo gradient)

| Role | Hex |
|---|---|
| Background | `#140a24` |
| Panels, lens fill | `#1d1033` |
| Borders on dark | `#2a1846` |
| Violet (logo start) | `#570d9e` |
| Violet on dark | `#9b4dff` |
| Coral (logo end) | `#ec4860` |
| Main text | `#f4eefb` |
| Secondary text | `#d9cdea` |
| Background text | `#5d4f78` |
| Labels | `#a593c2` |
| Gradient | `#9b4dff → #ec4860` |

- Coral always means "AI-like" or "problem." The violet gradient always means "human" or "fixed." Do not swap.
- Use the gradient on one word of the hero headline (the payoff word).

## 3. Type

- Headlines and body: **Bricolage Grotesque** (800 for headlines, 600 for card titles).
- Labels, numerals, background text: **JetBrains Mono**, uppercase labels with 0.12em letter-spacing.
- Hero headline: max 6 words, 72 px at 1x. No body paragraphs in images. Max 12 words per inline image.
- Font files: `docs/blog-images/fonts/` (SIL Open Font License).

## 4. Sizes and files

| Type | Size (1x) | Saved size | File |
|---|---|---|---|
| Hero | 1200 × 675 (16:9) | 1600 × 900 | `public/blog/{slug}/hero.webp` |
| Inline | 1000 × 560 | 1400 × 784 | `public/blog/{slug}/inline-{n}.webp` |
| OG / social | 1200 × 630 JPEG | 1200 × 630 | `public/og/blog/{slug}.jpg` (crop of the hero) |

- WebP, quality 85, target under 120 KB.
- Source HTML stays in `docs/blog-images/{slug}/` so any image can be edited and re-rendered.

## 5. Hero layout (same on every post)

- Left: coral mono kicker (`TAG · detail`), headline, logo + "/ blog".
- Right: the lens over background text, or another product motif for the post topic (gauge, score bars, before/after).
- Bottom: the signal trace (`<svg class="trace" data-seed="{slug}">`).

## 6. Inline rules

- Always use the light variant (`class="inline light"`).

- 1 or 2 per post, placed after the H2 they explain.
- Types: process cards, low-score-to-fix table, before/after, annotated text, simple chart.
- Charts use real numbers only.
- Caption under each image: one sentence.

## 7. Alt text

- One sentence: what the image shows and the point it makes. Do not start with "Image of."

## 8. Render steps

1. Copy `docs/blog-images/_template-hero.html` to `docs/blog-images/{slug}/hero.html`. Change the kicker, headline, lens text and `data-seed`.
2. Run `node docs/blog-images/render.mjs {slug}` (needs `playwright` and `sharp`).
3. Output goes to `public/blog/{slug}/`.
4. Run `node docs/blog-images/render-og.mjs` to make the social image (`public/og/blog/{slug}.jpg`, 1200 × 630 JPEG). Set `openGraph.images` and `twitter.images` to it (see any post's `const OG`). Site page cards live in `docs/blog-images/og/` and render to `public/og/`. JPEG, not WebP: LinkedIn does not show WebP previews.
5. New posts are added to `/sitemap.xml` automatically (`app/sitemap.ts` reads `app/blog`).

## 9. Blog page styling (`app/blog/layout.tsx`, `app/blog/blog.css`)

- Applies to `/blog` content only. Nav, footer and the analyzer keep the site style.
- Same fonts as the images (loaded locally with `next/font/local`).
- Accent: violet `#570d9e`. Problem color: coral `#c42e4a` (darker coral for text contrast).
- TL;DR box has a gradient top rule. Bottom CTA is the dark night button.
- No grid background on blog pages.
- Blog index cards crop the hero to 2.4:1 (`objectFit: cover`), so a long list of dark cards does not get heavy. Keep key hero content inside the middle 75% of the height.
