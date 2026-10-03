# ContentTrace calibration eval

These scripts test the real analyzer (`app/api/analyze`) on known human and known AI text, and propose new
`CALIBRATION` anchors for `lib/contentTypes.ts`. Run them again after any change to prompts, weights, factors or the model.

## Files

| File | Purpose |
|---|---|
| `prompts.json` | 29 prompts (5 chat, 5 email, 5 post, 5 article, 5 formal, plus 4 "humanized"). Sent to Claude, ChatGPT and Gemini. |
| `generate-ai.mjs` | Makes the AI samples through the three APIs. You type the keys. |
| `run-eval.mjs` | Sends every sample to the analyzer on your Mac and saves the scores. |
| `summarize.mjs` | Accuracy, AUC, per-factor signal, wrong calls, and proposed anchors (with a leave-one-out check). |
| `data/human-samples.jsonl` | 75 human samples. Not in git (third-party text). Kept in the Drive folder. |

Data and results stay out of git. Set `CT_EVAL_DIR` to the `eval` folder in the Drive folder, so Claude can read the results.

## Human samples (75, all written before 2022)

| Category | n | Source | Dates |
|---|---|---|---|
| Chat-style answers | 15 | Reddit answers in the ELI5 dataset (r/explainlikeimfive, AskHistorians, AskScience), via the M4 benchmark | 2011-2019 |
| Posts | 6 | Reddit comments, ELI5 dataset | 2011-2019 |
| Posts | 5 | Tweets, TweetEval (SemEval 2017) | 2015-2016 |
| Posts | 4 | PostHog blog first-person posts (CEO diary, team post), file versions from the 28 Dec 2021 commit | 2021 |
| Emails | 15 | Enron email corpus, one email per sender, no replies or forwards | 2001-2002 |
| Articles | 5 | PostHog company blog, 28 Dec 2021 commit | 2020-2021 |
| Articles | 4 | Andrej Karpathy blog (long posts cut at a paragraph near 8,000 characters) | 2014-2020 |
| Articles | 2 | Rust project blog | 2019-2020 |
| Articles | 4 | Reuters news (RCV1), via the Ghostbuster dataset | 1996-1997 |
| Formal | 5 | Python Enhancement Proposals (technical), file versions from the 31 Dec 2021 commit | 2019-2020 |
| Formal | 5 | arXiv abstracts (academic), via the M4 benchmark | 2007 |
| Formal | 5 | Reuters news (corporate), via the Ghostbuster dataset | 1996-1997 |

Each row has `source`, `url`, `date` and `expected_type`. Markdown from blog sources is kept (headings, lists, bold),
because AI replies also come with markdown. Use `--plain` to test text copied from a web page instead.

## AI samples (87)

29 prompts x 3 providers. No system prompt, default settings. Topics mirror the human set (same content types).
Models: Claude = newest Sonnet on your key; ChatGPT = `chat-latest` (the ChatGPT model); Gemini = `gemini-flash-latest`.
Change with `CLAUDE_MODEL`, `OPENAI_MODEL`, `GEMINI_MODEL`. See all IDs: `node eval/generate-ai.mjs --list-models`.

The 4 "humanized" prompts ask the model to sound human. They are reported apart and are not used for anchors.

## How to run (on your Mac)

1. Set the folder (every new terminal):

   ```bash
   cd ~/Desktop/ct-push
   export CT_EVAL_DIR="$HOME/Library/CloudStorage/GoogleDrive-colinharbut@gmail.com/My Drive/WT/ContentTrace - Website/ContentTrace.ai - Website/eval"
   ```

2. Install packages (first time only): `npm install`

3. Make the AI samples (about 5 minutes, about $2). Type each key, or press Enter to skip:

   ```bash
   node eval/generate-ai.mjs
   ```

4. Terminal A: start the site with only the Anthropic key. Do not use `.env.local` with Supabase keys (usage limits and the human check would block the eval). Use the same model as production:

   ```bash
   ANTHROPIC_API_KEY=sk-ant-... ANTHROPIC_MODEL=claude-sonnet-4-6 npm run dev
   ```

5. Terminal B (do step 1 again first): score all samples (about 15-30 minutes, about $15-20 for 162 samples):

   ```bash
   node eval/run-eval.mjs
   ```

   Quick test first: `node eval/run-eval.mjs --limit 4`. If it stops, run it again with `--out <same file>` to resume.

6. Make the report: `node eval/summarize.mjs`. It saves `results/run-...-summary.md` in the Drive folder.

7. Tell Claude the run is done. Claude reads the results and updates `CALIBRATION`.

## Notes

- Raw scores are grouped by the content type the analyzer detects (as for real users). `--type expected` sends the known type instead.
- Samples longer than 9,800 characters are cut at a paragraph break (the local site uses the free 10,000-character limit).
- Proposed anchors = median raw score of human and AI samples per group. A group needs 5+ samples on each side, or the anchors stay as they are.
- The leave-one-out accuracy scores each sample with anchors built from the other samples. It is a fairer number than in-sample accuracy.
- Do not publish accuracy numbers from this set as marketing claims. It is small and it is our own test set.
