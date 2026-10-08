# Writer Brief: ContentTrace Blog Batch (Oct 7, 2026)

Repo: `/tmp/ct` (Next.js). You write blog posts and their image sources. Work only on the slugs assigned to you.

## Read first (in this order)

1. `docs/blog-editorial-guide.md` (section 0 Positioning is mandatory)
2. `docs/blog-facts.md` (the ONLY allowed source for product facts)
3. `docs/blog-image-style-guide.md`
4. Reference post, copy its structure and styles exactly: `app/blog/how-to-humanize-ai-content/page.tsx`
5. Shared components: `app/blog/_parts.tsx` (ArticleSchema, Byline, BlogHero, Figure, Sources, AuthorBio, SITE_URL)
6. Reference images: `docs/blog-images/how-to-humanize-ai-content/hero.html`, `inline-1.html`, `inline-2.html`, and `docs/blog-images/_template-hero.html`

## Positioning in one line

ContentTrace is not an AI detector. It helps AI-assisted writers publish content that is better than run-of-the-mill AI output, for readers, SEO and AEO. It is pro-AI (Google accepts helpful AI-assisted content).

## Hard rules (a post that breaks one is rejected)

- No first person in body, TL;DR, FAQ, captions, alt text or pull quotes: no I, I'm, I've, I'd, me, my, mine, we, we're, we've, our, ours, us. "You" is fine. Quotes from named outside sources are fine.
- Keep opinions strong. Every post takes a clear position.
- No em dashes (—) anywhere, including meta and image HTML. No en dash as a sentence break either. Use " - " at most twice per post.
- No "It's not X, it's Y" / "not just X, but Y" formulas. Avoid repeated groups of three. No bold inside paragraphs. No closing offers.
- Never invent experience, clients, tests, quotes or numbers. Attributed evidence must be real: outside sources you verified, or facts in `docs/blog-facts.md`. You MAY use generic, clearly hypothetical examples only if labeled as such ("Take a hypothetical product page...").
- Wording rule: "AI-assisted" by default; "AI draft"/"AI-generated" for raw output; "AI content" only as the search phrase in one FAQ question, one H2 or the meta description.
- Product facts only from `docs/blog-facts.md`, and respect its timeline (no engine internals in posts dated before Sept 30, 2026; no optimizer details before Oct 3, 2026).
- Humanization (editorial guide section 3): varied sentence and paragraph length, contractions, one self-correction ("The obvious fix is X. It doesn't work, because..."), one specific feeling with a cause, one dry or ironic line, one insider detail, one surprising observation.
- JSX text: escape apostrophes and quotes (`&apos;`, `&quot;`) or keep text inside JS string arrays/objects (as the reference does for TL;DR and FAQ).
- Colors: only `var(--accent)`, `var(--accent-light)`, `var(--red)`, `var(--red-bg)`, `var(--text-*)`, `var(--border)`, `var(--bg-*)`, `rgba(87,13,158,x)` (violet), `rgba(236,72,96,x)` (coral). No teal (#0a7373 / rgba(10,115,115)) and no #c43302.

## Research

- For every new post, find 2 to 4 real, relevant outside sources with WebSearch / WebFetch (Google Search Central docs, studies, reputable industry research, official product docs). Open each URL to confirm it exists and says what you cite. Put them in `<Sources items=[...] />`. Never cite a URL you did not open.
- Statistics in the post must come from a source you opened (name the source in the sentence) or from `docs/blog-facts.md`.

## Page file: `app/blog/{slug}/page.tsx`

Follow the reference post. Required, in order:
- `metadata`: title, description (max ~155 chars), canonical, openGraph (type article, publishedTime, modifiedTime, authors ["Colin H"], images [hero 1600x900 + alt]), twitter summary_large_image, robots.
- `FAQ` const (5 or 6 Q&A), passed to `<ArticleSchema ... faq={FAQ} />`.
- Tag pill (colors: Guide coral `var(--red)` / `var(--red-bg)`, Explainer violet `var(--accent)` / `var(--accent-light)`, Analysis `#a35f00` / `rgba(196,122,0,0.08)`, Opinion `#140a24` / `rgba(20,10,36,0.06)`), H1, `<Byline date readTime updated?>`, `<BlogHero>`.
- TL;DR box with `className="tldr"` (4 to 6 bullets, full claims).
- Opening: a specific fact or scene, never a definition.
- Stat banner linked to `/` (as in the reference). The number must be true: a count from the post itself (e.g. "5 checks") or a sourced figure.
- 4 to 6 H2 sections. Include: 1 signal callout (use a real section/signal name from blog-facts.md), 1 pull quote (cite "Content Trace · {Section} Signal" or the outside source), optional before/after comparison (no fake scores; omit the score bars unless you label them as illustrative), 1 or 2 `<Figure>` inline images placed after the H2 they explain.
- FAQ block, related-posts paragraph linking 2 or more other posts (slugs below), `<Sources>`, `<AuthorBio />`, CTA link `className="cta-dark"` to `/` ("Try Content Trace free →" or "Check your next draft →").
- Length: new posts 1,400 to 2,000 words of body text. Read time = words / 220, rounded.
- Default export name: unique PascalCase from the slug.

## Images: `docs/blog-images/{slug}/`

- `hero.html`: copy `_template-hero.html`. Change the kicker (`TAG · detail`), headline (max 6 words, one payoff word wrapped in `<span class="grad-text">`), `data-seed` = slug, background text (dim AI-style sentences on the topic) and the lens text (max ~12 words: one `<span class="cut">` filler phrase struck out, one or two `<span class="add">` real details). You may swap the lens for another product motif on the right side if it fits the topic better (score bars, before/after, checklist), using base.css tokens. Keep the key content in the middle 75% of the height (index cards crop to 2.4:1).
- `inline-1.html` (and optional `inline-2.html`): `<div id="canvas" class="inline light">`, a diagram that explains one idea of the post (process cards, table, before/after, annotated text, checklist). Max ~12 words per text block. Real numbers only.
- Render and LOOK at every image:
  ```
  cd /tmp/ct && ln -sfn /opt/npm-tools/node_modules docs/node_modules; CHROMIUM_PATH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1) node docs/blog-images/render.mjs {slug}
  python3 -c "from PIL import Image;Image.open('public/blog/{slug}/hero.webp').save('/tmp/{slug}-hero.png')"
  ```
  Then Read the PNG. Fix overlaps, clipped text and empty areas, re-render.

## Rewrites of old posts (keep slug)

- Keep the original publish date (Byline `date`, `datePublished`); set `updated="October 7, 2026"` and `dateModified="2026-10-07"`.
- Convert to third person, keep every opinion, keep the good existing material and length (do not shorten much). Remove all em dashes. Apply the angle change in your assignment. Fix any fact that conflicts with blog-facts.md (e.g. burstiness is weak and now reference-only).
- Replace old components/styles with the reference structure (`_parts` components, theme colors, tldr class, cta-dark). Add hero + 1 or 2 inline images, sources (verify existing links; replace dead ones), FAQ schema, bio.
- `app/blog/how-ai-text-detection-works/` also has `how-ai-text-detection-works.tsx`; read it, keep whatever the page imports, or fold it into page.tsx and delete the extra file if it is not needed.

## Do NOT touch

`app/blog/_blog.tsx`, `app/sitemap.ts`, `app/blog/_parts.tsx`, `app/blog/layout.tsx`, `app/blog/blog.css`, `docs/blog-images/base.css`, `render.mjs`, `trace.js`, or any slug not assigned to you. The lead editor updates the index and sitemap.

## Self-check before you finish (per post)

```
cd /tmp/ct && python3 - <<'PY'
import re,sys
for slug in ["{slug}"]:
    s=open(f"app/blog/{slug}/page.tsx").read().replace("&apos;","'").replace("&quot;",'"')
    fp=re.findall(r"\b(I|I'm|I've|I'd|me|my|mine|we|we're|we've|our|ours|us)\b",s)
    print(slug,"first-person:",fp,"emdash:",s.count("—"),"endash:",s.count("–"),"notX:",len(re.findall(r"(?i)it'?s not [^.]{1,40}, it'?s",s)))
PY
npx tsc --noEmit -p . 2>&1 | grep "app/blog/{slug}" | head
```
(Product names like "Content Trace" are fine; "US" in a URL is fine.)

## Return (final message)

One JSON array, one object per post:
`{"slug","title","date":"Month D, 2026","readTime":"N min read","excerpt":"1-2 sentences, no first person, no em dash","tag","imageAlt","sources":[urls],"inlineCount":N,"notes":"anything the editor must check"}`

## Slugs and dates (for internal links)

Existing (being updated): can-ai-detectors-be-fooled (Mar 3), ai-detection-in-education (Mar 7), behavioral-signals-that-give-ai-writing-away (Mar 11), why-your-ai-detector-score-keeps-changing (Mar 15), how-ai-text-detection-works (Mar 19), why-ai-writing-sounds-different (Mar 24), how-to-humanize-ai-content (Mar 29, done), ai-detection-and-seo (Apr 7), the-specificity-test (Apr 14), ai-content-policies-at-work (Apr 21), how-to-read-a-detection-report (Apr 26).

New (2026): google-is-fine-with-ai-assisted-content (May 4), prompting-for-a-better-first-draft (May 12), the-generic-middle-of-ai-drafts (May 20), brand-voice-guides-ai-can-follow (May 28), information-gain-seo-ai-drafts (Jun 3), add-real-expertise-to-ai-drafts (Jun 11), writing-for-ai-overviews (Jun 19), ai-writing-tics-field-guide (Jun 27), question-headings-seo-aeo (Jul 6), should-you-disclose-ai-use (Jul 14), the-edit-budget-for-ai-drafts (Jul 22), engagement-metrics-for-content (Jul 30), intros-that-earn-the-second-paragraph (Aug 5), refreshing-old-content-with-ai (Aug 13), ai-writing-in-regulated-industries (Aug 21), undetectable-ai-is-the-wrong-goal (Aug 29), readability-scores-explained (Sep 4), topical-authority-for-small-sites (Sep 12), editing-checklist-for-ai-assisted-writers (Sep 20), short-form-ai-writing-email-linkedin (Sep 28), inside-the-32-signals (Oct 1), editor-not-author-content-optimizer (Oct 4), how-contenttrace-is-calibrated (Oct 6).

Link only to posts dated on or before your post's date (a May post must not link to a June post). Rewrites (Mar/Apr dates) may link only to other Mar/Apr posts.

Topic details: `docs/blog-topic-plan.md`.
