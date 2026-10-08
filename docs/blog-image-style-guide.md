# ContentTrace Blog: Image Style Guide

All blog images are built as HTML/SVG and rendered to WebP. No stock photos. No AI photo art. No people's faces.

## 1. Look

- **Style name:** "Editorial signal diagram."
- Flat shapes, thin lines (1.5 to 2 px), lots of empty space.
- Motifs that come from the product: lines of text with highlights, score bars, signal meters, gauges, before/after panels, marked-up paragraphs.
- Every image explains one idea from the post. If an image does not explain something, cut it.

## 2. Color (same tokens as `app/globals.css`)

| Role | Token | Hex |
|---|---|---|
| Background | `--bg` | `#fdfcfa` |
| Panel | `--bg-elevated` | `#f8f6f2` |
| Lines, borders | `--border` | `#e0d9cc` |
| Ink (headings, strong shapes) | `--text-primary` | `#010221` |
| Human / good / primary accent | `--accent` | `#0a7373` |
| AI / problem | `--red` | `#c43302` |
| Mixed / warning | `--amber` | `#c47a00` |

- Teal always means "human" or "good". Red always means "AI-like" or "problem". Do not swap.
- One accent color leads each image. A second accent appears only for a contrast (before/after).

## 3. Type

- Labels: **DM Mono**, uppercase, letter-spacing 0.08em, 14 to 18 px at 1x.
- Headlines in images (hero only): **Rubik** 700, max 6 words.
- No body paragraphs in images. Max 12 words of text per inline image.

## 4. Sizes and files

| Type | Size (1x) | Rendered at | File |
|---|---|---|---|
| Hero | 1200 × 675 (16:9) | 2x, saved 1600 × 900 | `public/blog/{slug}/hero.webp` |
| Inline | 1000 × 560 | 2x, saved 1400 × 784 | `public/blog/{slug}/inline-{n}.webp` |
| OG / social | Uses hero | — | set in `metadata.openGraph.images` |

- WebP, quality 85. Target under 120 KB each.
- Source HTML kept in `docs/blog-images/{slug}/` so images can be edited and re-rendered.

## 5. Hero rules

- Left: tag (mono, accent color) + 3 to 6 word headline (Rubik).
- Right: one product motif that shows the post's core idea.
- Frame: 1 px `--border`, 24 px corner radius on inner panel.
- Same layout on every post, so the blog index looks like a set.

## 6. Inline rules

- 1 or 2 per post. Place after the H2 it explains.
- Types: process flow, before/after, score breakdown, annotated text sample, simple chart.
- Charts use real numbers only (from the post or ContentTrace data).
- Caption under each image (14 px, `--text-muted`), one sentence.

## 7. Alt text

- Describe what the image shows and the point it makes, in one sentence.
- Example: "Six editing passes in order, from filler-phrase cuts to a final ContentTrace score check."
- Do not start with "Image of".

## 8. Render steps

1. Copy `docs/blog-images/_template-hero.html` to `docs/blog-images/{slug}/hero.html`. Edit the text and motif.
2. Run `node docs/blog-images/render.mjs {slug}` (Playwright, Chromium). It writes WebP files to `public/blog/{slug}/`.
3. Check each file in light and dark page themes (images keep their own cream background).
