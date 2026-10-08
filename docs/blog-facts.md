# ContentTrace: Verified Product Facts for Blog Posts

Use ONLY these facts when a post describes the product. Do not add features, numbers or claims that are not here. Source: the code in this repo (`lib/analyzer.ts`, `lib/contentTypes.ts`, `lib/optimizer.ts`) and the October 3, 2026 evaluation.

## Timeline (for backdated posts)

- Before Sept 30, 2026: do not describe engine internals in detail; general product mentions only ("ContentTrace explains its score with 32 signals in 8 sections").
- Sept 30, 2026: scoring engine rebuilt (the version described below).
- Oct 3, 2026: content-type calibration set from the evaluation; Content Optimizer (Humanize, SEO, AI answers) launched.

## How scoring works

- 8 sections, 32 signals shown in every report:
  - Structure & Flow: Sentence Length Variation, Transitional Phrase Overuse, Predictable List Structures, Paragraph Length Consistency
  - Word Choice & Phrasing: AI Filler Phrases, Hedging Language Overuse, Lack of Contractions, Generic vs Specific Language
  - Voice & Perspective: Distinct Point of View, Personal Anecdotes Present, Emotional Authenticity, Opinion Strength
  - Content & Logic: Depth vs Surface Treatment, Insider/Niche Knowledge, Surprising Observations, Argument Completeness
  - Cognitive Fingerprinting: Opinion Drift / Self-Correction, Thinking Out Loud, Metacognitive Signals, Cognitive Bias Presence
  - Emotional Texture: Genuine vs Performed Empathy, Vulnerability Present, Emotional Range, Specificity of Feeling
  - Pragmatics & Subtext: Subtext and Implication, Irony or Dry Humor, Register Shifts, Over-Explicitness
  - Statistical Proxies (computed in code): Vocabulary Richness, Burstiness Approximation, Response Calibration, Entropy Variance
- 7 sections are judged by Claude (Anthropic's model) acting as an editor with a fixed rubric, in parallel calls. Each signal gets 0 to 10 with 2 short observations that point to the text. Temperature 0, so the same text gets the same or a very close score.
- Statistical Proxies are measured in code and shown for reference only. They carry **no weight** in the score since the Oct 3 testing (burstiness separated human from AI text no better than chance in that test). Say "explains its results with 32 signals", not "scores 32 signals".
- Default section weights (before content-type changes): Structure & Flow 12%, Word Choice 15%, Voice & Perspective 14%, Content & Logic 13%, Cognitive Fingerprinting 16%, Emotional Texture 12%, Pragmatics & Subtext 10%.
- It is an LLM-as-judge rubric plus code metrics plus calibration. It is NOT a trained classifier and does NOT "learn". Never say "proprietary deep learning model".
- The judge prompt watches for newer AI patterns: chat-style openers and closing offers, "it's not X, it's Y" contrast formulas, rule-of-three groupings, em dashes used for rhythm, balanced conclusions that never commit, smooth coverage with no insider detail, and generic empathy.

## Content types

- 10 types, auto-detected or chosen by the user: General, Personal blog / essay, Thought leadership / opinion, Company blog / brand article, Corporate / white paper, Technical / documentation, Academic / student essay, Marketing / web copy, Social post, Email / letter.
- Each type changes section weights and marks signals that do not fit the genre as N/A (left out of the score). Example: Company blog leaves out Personal Anecdotes, Vulnerability, Opinion Drift and Thinking Out Loud. Technical docs leave out 7 signals, including Opinion Strength and Irony.
- 4 calibration groups: formal (academic, technical, corporate), business (company blog, thought leadership, marketing), personal (personal blog, social, email), general (chat/Q&A and mixed).
- Displayed score: 25 at the median raw score of AI samples, 75 at the median raw score of human samples, for that group. Capped between 2 and 98, because no tool can be certain.

## The October 3, 2026 evaluation (internal testing; always state it is internal)

- 162 scored samples: 75 human texts written before 2022 (Reddit ELI5 answers, tweets, company and personal blogs, Enron emails, Python PEPs, arXiv abstracts, Reuters news) and 87 AI replies to 29 prompts from three providers (Claude, ChatGPT, Gemini), default settings, no system prompt.
- With the new calibration, leave-one-out accuracy was 89%: 71 of 75 human texts and 62 of 75 AI texts classified correctly. (The 75 AI texts exclude 12 "humanized" samples, reported separately.)
- Area under the curve for the displayed score rose from 83.7% to 94.8% after the routing fix and new anchors.
- By provider (leave-one-out): ChatGPT 19/25, Claude 20/25, Gemini 23/25 caught.
- Known limits: AI text prompted to "sound human" was caught only 3 of 12 times. Remaining misses include formal AI documents and some AI emails and social posts. Human misses include a company "what is product analytics" article, 2 short emails and 1 academic abstract.
- The business calibration group is small (8 human / 9 AI samples) and needs more data.
- A routing fix in the same week: answers to a person's question now count as "general" even when technical. Before the fix, technical AI explainers were judged against formal anchors and scored far too human.
- Always add: these are internal results on a modest sample, not a guarantee; short texts give weaker signals.

## Content Optimizer (launched Oct 3, 2026)

- 3 goals: Humanize (clear, original writing in the writer's voice), SEO (plus descriptive headings, main point early, target keyword placed naturally), AI answers / AEO (plus a direct answer up top, question-style headings, self-contained quotable passages).
- Works as an editor, not an author: keeps facts, names, numbers and quotes word for word; adds no opinions, feelings or stories. Uses the same Claude model, temperature 0.2.
- Fact guard: compares the rewrite with the original and flags new names, new numbers or changed quotes; tries one repair pass if time allows, else shows "Check these before you publish" warnings.
- Where a real example or source would help, it inserts markers like [Add: a real example from your work] for the writer to fill.
- After the rewrite, the new version is re-scored by the same engine, with the original's content type. The user sees both versions side by side with Human Score, reading ease and Search & AI-answer readiness before and after.
- Readiness = 65% model rubric (6 criteria) + 35% code checks. It is a checklist, not a ranking forecast.
- Honest result from launch testing: because nothing is invented, Human Score gains are often modest; readability and readiness usually improve most. No tool can guarantee rankings or AI citations.

## Pricing (do not put prices in posts unless needed)

- Free monthly analyses with no account; Pro monthly or yearly; one-time Word Packs.

## Wording rule (all posts)

- "AI-assisted" = the default for the human + AI process ContentTrace promotes.
- "AI draft", "AI-generated", "raw AI output" = unedited model output.
- "AI content" only as an exact search phrase (one FAQ question, one H2, or the meta description).
