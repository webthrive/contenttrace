# ContentTrace Blog: Editorial Guide

Rules for every post on `/blog`. Use this guide for rewrites of old posts and for all new posts.

## 0. Positioning (read first)

- ContentTrace is **not an AI detection tool**. It helps writers produce superior, valuable, engaging content that is not run-of-the-mill AI output.
- ContentTrace **supports the use of AI**. Google accepts AI-assisted content that helps people. The product formats writing for the best outcomes in **reader engagement, SEO and AEO**.
- Never frame a post, CTA or meta description as "detect AI", "catch AI" or "beat detectors". Frame it as better writing, engagement and visibility.
- Never tell readers to avoid AI. Show how to use it well.
- Detection topics are allowed (old posts keep them), but treat the score as a diagnostic for editing, never as a verdict on a person.
- **Topic mix:**
  - Product: purpose, technical (how scoring and calibration work), tuning, features. Technical posts build validation, so include real method details.
  - Craft: useful information that helps AI-assisted writers produce better work (editing, structure, SEO, AEO, voice, policy).
- **Dates and truth:** a backdated post must not describe a feature before it existed. Product posts about the current engine go on or after Sept 30, 2026; posts about the optimizer go on or after Oct 3, 2026.
- **Claims:** no accuracy percentages unless they come from a documented eval, with sample size and limits stated. No "proprietary deep learning model" or "learns" claims.

## 1. Voice

- **No first person.** Do not use "I", "me", "my", "we", "our", "us" in body copy, TL;DR, FAQ, or pull quotes.
- **Keep every opinion.** A voice change is not a stance change. If the old post took a side, the new post takes the same side, as strongly.
- **Second person ("you") is allowed.** It addresses the reader. It is not first person.
- **Experience stays, as attributed evidence.** Convert first-hand claims to a named source:

| Old (first person) | New (third person, same evidence) |
|---|---|
| "I watched a content team publish forty posts..." | "One content team in a Web Thrive client account published forty posts..." |
| "I've never lost a good idea by deleting a filler phrase." | "A good idea rarely dies in a filler-phrase cut. Weak ones just become obvious." |
| "In my testing..." | "In ContentTrace testing..." (only if the test is real) |
| "I don't fully understand why this is." | "Nobody has a clean explanation for this yet." |

- **Never invent evidence.** No made-up tests, clients, numbers, or quotes. If a claim has no source, cut it or make it a clear opinion.
- **Uncertainty stays.** Old posts admit limits ("I'm not sure"). Keep the admission in third person ("The data here is thin." / "This part is still unclear.").

## 2. EEAT checklist (every post)

- [ ] Byline: **Colin H** (links to `/about`), with the bio box at the end of the post. In the bio box, the name links to https://www.webthrive.io/home.
- [ ] Visible dates: published date. On rewrites, add "Updated {date}".
- [ ] Article JSON-LD: `headline`, `image`, `datePublished`, `dateModified`, `author` (Person, Colin H), `publisher` (ContentTrace).
- [ ] FAQPage JSON-LD that matches the visible FAQ.
- [ ] At least 1 named, real example (client type, test, or observed case).
- [ ] At least 2 outside sources, linked in a "Sources" list at the end.
- [ ] Internal links: 2 or more other blog posts, plus the homepage tool.
- [ ] One clear position the post defends.

## 3. Humanization rules (scored by the ContentTrace analyzer)

The analyzer scores 8 sections. Each draft must pass all of these:

- **Structure & Flow:** mix very short sentences with long ones. Vary paragraph length (1 line to 5 lines).
- **Word choice:** contractions on. No filler ("it's worth noting", "in today's landscape"). Specific nouns over general ones.
- **Voice & Perspective:** take a side. Use attributed anecdotes (see section 1).
- **Content & Logic:** include one detail only an insider knows. Include one surprising observation.
- **Cognitive Fingerprinting:** show the thinking change once ("The obvious fix is X. It does not work, because..."). Self-correct once.
- **Emotional Texture:** name a specific feeling with a specific cause (frustration at a false positive, relief at a clean edit). No generic empathy.
- **Pragmatics & Subtext:** one line of dry humor or irony. Shift register once (formal to plain).
- **Banned patterns:**
  - Em dashes (—). Use a period, comma, colon, or " - " sparingly.
  - "It's not X, it's Y" and "not just X, but Y" contrast formulas.
  - Groups of three, again and again (three bullets, three adjectives, three short sentences).
  - Bold phrases inside paragraphs.
  - Closing offers ("Let me know if...").
  - Balanced "both sides" endings that do not commit.

## 4. Post template (keep the existing structure)

1. Tag pill (Explainer, Analysis, Guide, Opinion)
2. H1
3. Meta line: date · read time · By Colin H (· Updated date)
4. **Hero image** (16:9, Trace Lab style, see image guide)
5. **TL;DR box** (4 to 6 bullets, each a full claim)
6. Opening: a specific scene or fact, not a definition
7. Stat banner (must link to `/`)
8. H2 sections (4 to 6), with 1 or 2 inline images, 1 signal callout, 1 pull quote, optional before/after
9. FAQ (5 to 6 questions)
10. Related posts paragraph (internal links)
11. Sources list
12. Author bio box
13. CTA button to `/`

## 5. Dates

- New backdated posts: spread evenly in each month (about every 7 to 8 days). Do not cluster.
- Old posts: keep the original `datePublished`. Set `dateModified` to the rewrite date.
- Sitemap `lastModified` must match `dateModified`.

## 6. Final QA (run before every patch)

- `grep -nwiE "I|I'm|I've|I'd|me|my|we|we're|we've|our|us"` on the post body returns only quotes from other people or product names.
- `grep -n "—"` returns nothing.
- Paste the body text into ContentTrace. Target: Human Score 80+ (Article type). Fix the lowest section first.
