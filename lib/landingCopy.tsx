import type { ReactNode } from "react";
import type { OptimizeGoal } from "@/types/optimize";
import { OPTIMIZE_FREE_UNITS, PLANS, PRO_YEARLY_PER_MONTH } from "@/lib/billing/config";

// Marketing copy for the analyzer pages. The home page and each paid search landing page
// use the same tool and layout, with copy that matches what the visitor searched for.

export type LandingVariant = "home" | "humanize";

type Card = { icon: string; title: string; desc: string };
type Optimizer = { icon: string; title: string; tag: string; points: string[]; best: string };

export type LandingCopy = {
  h1: string;
  sub: string;
  inputLabel: string; // shown above the text box on phones
  cta: string; // the main button
  ctaNote?: string; // small line under the box for signed-out visitors
  intro: ReactNode;
  afterAnalysis: "analysis" | "optimize"; // which tab opens when the check finishes
  autoRun?: OptimizeGoal; // run this optimizer as soon as the check finishes
  defaultGoal: OptimizeGoal;
  optimizers: { title: string; sub: string; items: Optimizer[]; note: string };
  guide?: { title: string; sub: string; tips: { title: string; desc: string }[]; outro: ReactNode };
  steps: { title: string; sub: string; items: Card[] };
  audiences: { title: string; sub: string; items: Card[] };
  reasons: { title: string; sub: string; items: Card[] };
  showDetectorDetails: boolean;
  showBlog: boolean;
  faqs: { q: string; a: string }[];
};

const strong = (s: string) => <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{s}</strong>;

const OPTIMIZERS: Record<"humanize" | "seo" | "aeo", Optimizer> = {
  humanize: { icon: "✍️", title: "Humanize", tag: "Turn generic AI drafts into clear, original writing in your voice.", points: ["Cuts AI filler and generic phrasing", "Plain words and varied sentences", "Marks where your own examples belong"], best: "AI first drafts, emails, LinkedIn posts" },
  seo: { icon: "🔎", title: "SEO", tag: "Help search engines understand your page.", points: ["Descriptive headings", "The main point in the first paragraph", "Your keyword placed naturally, never stuffed"], best: "Blog posts, landing pages, guides" },
  aeo: { icon: "💬", title: "AI answers (AEO)", tag: "Get quoted in AI Overviews, ChatGPT and Perplexity.", points: ["A direct answer up top", "Question-style headings", "Self-contained, quotable passages"], best: "FAQs, how-to content, explainers" },
};

const NEVER_INVENTS = "We edit wording only. We never invent facts, quotes or stories. Where a real example or number would help, we add a marker like [Add: a real example] for you to fill in.";

const PRIVACY: Card = { icon: "🔒", title: "Private by Default", desc: "Signed out, your text is never stored. Signed in, results go to your private history and you can delete them any time. Never used to train models." };

const FREE_CHECKS = PLANS.free.analysesPerMonth;
const FAQ_FREE = `Yes, to start. You get ${FREE_CHECKS} free checks a month for texts up to ${PLANS.free.charLimit.toLocaleString()} characters, with no account and no credit card. An AI check uses 1 and each optimizer run uses ${OPTIMIZE_FREE_UNITS}. For longer texts and more runs, Pro is $${PRO_YEARLY_PER_MONTH} a month billed yearly ($${PLANS.pro.yearlyPrice}) or $${PLANS.pro.monthlyPrice} month to month, or you can buy a one-time Word Pack.`;
const FAQ_UNDETECTABLE = "No, and we do not promise that. Humanize edits wording so a draft reads naturally. It never invents personal stories, opinions or facts to push the score up, so the Human Score may move only a little. Reading ease usually improves most. The biggest gains come from the real details you add where we place [Add: ...] markers, because specific, first-hand detail is what makes writing human.";
const FAQ_FACTS = "No. The optimizer keeps your facts, numbers, names and quotes, and it does not add opinions or feelings you did not write. A fact check compares the new version with your original and flags anything that changed. No tool can guarantee rankings or AI citations, so review every change before you publish.";
const FAQ_STORE = "Only if you sign in. Signed out, your text is processed in real time and is not stored, logged, or used to train any models. When you are signed in, each analysis and optimization is saved to your private history so you can come back to it. Only you can see it, and you can delete any item at any time. We never use your text to train models.";

export const LANDING_COPY: Record<LandingVariant, LandingCopy> = {
  home: {
    h1: "Turn AI Drafts Into Content That Reads Human and Ranks",
    sub: "Humanize your writing, optimize it for SEO, and shape it for AI answers. See every change before and after.",
    inputLabel: "Paste your text to improve it",
    cta: "Check & Improve",
    intro: <>Paste a draft. Our AI check shows what makes it sound machine-written. Then pick a goal: {strong("Humanize")}, {strong("SEO")} or {strong("AI answers")}. We rewrite the weak spots, score the new version, and show every change side by side. We edit wording only, and we never invent facts.</>,
    afterAnalysis: "analysis",
    defaultGoal: "aeo",
    optimizers: {
      title: "Three Ways to Improve Your Text",
      sub: "Pick a goal, or run all three. You see every change, with the scores before and after.",
      items: [OPTIMIZERS.humanize, OPTIMIZERS.seo, OPTIMIZERS.aeo],
      note: NEVER_INVENTS,
    },
    steps: {
      title: "How It Works",
      sub: "Three steps. No account needed to start.",
      items: [
        { icon: "📋", title: "Paste Your Draft", desc: "A blog post, email, landing page, social post or any AI-assisted draft." },
        { icon: "🔍", title: "See What Sounds Like AI", desc: "A Human Score out of 100, with the signals behind it explained in plain language." },
        { icon: "✨", title: "Pick a Goal and Compare", desc: "Humanize, SEO or AI answers. Compare before and after side by side, then copy the new version." },
      ],
    },
    audiences: {
      title: "Who Uses Content Trace",
      sub: "For anyone who writes with AI, or reviews writing that might be.",
      items: [
        { icon: "📣", title: "Content & SEO Teams", desc: "Humanize AI drafts and tune them for search and AI answers before they go live." },
        { icon: "✍️", title: "Marketers", desc: "Turn AI first drafts into copy that sounds like your brand, without losing your facts." },
        { icon: "🤝", title: "Agencies & Freelancers", desc: "Deliver AI-assisted work that reads like your best writer, with a before and after to show clients." },
        { icon: "🗞️", title: "Publishers & Editors", desc: "Screen submissions for AI patterns and see exactly which signals stand out." },
        { icon: "🎓", title: "Educators", desc: "Get a second opinion on writing, with every signal explained." },
      ],
    },
    reasons: {
      title: "Why Content Trace",
      sub: "An editor and an AI check in one place.",
      items: [
        { icon: "🛡️", title: "Edits, Never Invents", desc: "Your facts, numbers and quotes stay. A fact check flags anything that changed." },
        { icon: "↔️", title: "Every Change Shown", desc: "Before and after, side by side, with the changes highlighted." },
        { icon: "✨", title: "Three Optimizers", desc: "Humanize, SEO and AI answers, scored with the same engine before and after." },
        { icon: "🧠", title: "Explains the Score", desc: "32 signals, each scored and explained. Not just a percentage." },
        { icon: "🆓", title: "Free to Start", desc: `${FREE_CHECKS} free checks every month. No credit card. Pro from $${PRO_YEARLY_PER_MONTH}/month (billed yearly).` },
        PRIVACY,
      ],
    },
    showDetectorDetails: true,
    showBlog: true,
    faqs: [
      { q: "What do the three optimizers do?", a: "After the AI check, the optimizer rewrites the weak spots it found for the goal you choose. Humanize turns generic AI drafts into clear, original writing in your voice: plain words, varied sentences, no AI filler, and markers where your own examples belong. SEO adds descriptive headings, puts the main point early and places your keyword naturally. AI answers adds a direct answer up top, question headings and passages that AI Overviews, ChatGPT and Perplexity can quote. Then it scores the new version with the same engine and shows every change side by side. You can run all three on the same text." },
      { q: "Will Humanize make AI text undetectable?", a: FAQ_UNDETECTABLE },
      { q: "Does the optimizer change my facts or guarantee rankings?", a: FAQ_FACTS },
      { q: "Is it free?", a: FAQ_FREE },
      { q: "How does the AI check work?", a: "It scores your text across 8 sections and 32 signals, from sentence rhythm and word choice to voice and reasoning patterns, and adjusts for the type of content. You get a Human Score out of 100 with every signal explained. No AI detector is 100% accurate, so treat the score as an indicator, not a verdict, especially for short or heavily edited texts." },
      { q: "Can I use it for academic work?", a: "Educators can use the AI check to review student work, and students can use it to review their own writing. Results should not be used as sole evidence in academic disciplinary proceedings. AI detection is probabilistic, and a low Human Score does not prove AI authorship." },
      { q: "Does Content Trace store my text?", a: FAQ_STORE },
    ],
  },

  humanize: {
    h1: "Humanize AI Writing in One Click",
    sub: "Turn your AI draft into clear, original content in your own voice. Every change shown side by side.",
    inputLabel: "Paste your AI draft to humanize it",
    cta: "Humanize My Text",
    ctaNote: `Free to try, no account needed. Each run uses ${1 + OPTIMIZE_FREE_UNITS} of your ${FREE_CHECKS} free monthly checks: 1 to check the text, ${OPTIMIZE_FREE_UNITS} to humanize it.`,
    intro: <>AI drafts are fast, but they often sound like every other page. Content Trace finds the generic, filler-heavy spots and rewrites them in plain, specific language. It keeps your facts and quotes, and marks where {strong("your own experience, examples and data")} will make the piece worth reading. Then run {strong("SEO")} and {strong("AI answers")} on the same text.</>,
    afterAnalysis: "optimize",
    autoRun: "readability",
    defaultGoal: "readability",
    optimizers: {
      title: "Humanize First. Then Go Further.",
      sub: "SEO and AI answers include the Humanize edits, plus their own. Run them on the same text and compare.",
      items: [OPTIMIZERS.humanize, OPTIMIZERS.seo, OPTIMIZERS.aeo],
      note: NEVER_INVENTS,
    },
    guide: {
      title: "How to Humanize AI Writing",
      sub: "Five edits that turn a generic AI draft into something worth reading, with or without a tool.",
      tips: [
        { title: "Add what only you know", desc: "A client result, a number from your work, a mistake you learned from. First-hand experience is what makes content original and worth citing." },
        { title: "Say what you think", desc: "Take a clear position instead of balancing every point. A real point of view is what readers remember." },
        { title: "Cut the AI filler", desc: "Phrases like \"it's important to note\", \"in today's fast-paced world\" and \"moreover\" add nothing. Delete them." },
        { title: "Vary your sentence length", desc: "AI writes in an even rhythm. Mix short sentences with longer ones." },
        { title: "Use plain words and contractions", desc: "\"Use\" instead of \"utilize\". \"It's\" instead of \"it is\", where the tone allows." },
      ],
      outro: <>Content Trace does steps 3 to 5 for you in one click, and marks the spots where your own details and opinions (steps 1 and 2) will add the most value. <a href="/blog/how-to-humanize-ai-content" style={{ color: "var(--accent)", fontWeight: 600 }}>Read the full guide</a></>,
    },
    steps: {
      title: "How It Works",
      sub: "Usually one to two minutes from paste to a better draft.",
      items: [
        { icon: "📋", title: "Paste Your AI Draft", desc: "A blog post, email, LinkedIn post, report or landing page." },
        { icon: "✍️", title: "We Humanize It", desc: "We find the generic, AI-sounding spots and rewrite them in clear, specific language." },
        { icon: "↔️", title: "Compare, Add, Copy", desc: "See every change side by side, fill in the [Add: ...] markers with your own examples, then copy." },
      ],
    },
    audiences: {
      title: "Built for People Who Write With AI",
      sub: "Use AI for speed. Add the expertise only you have.",
      items: [
        { icon: "📣", title: "Marketers & Content Teams", desc: "Blog posts, emails and landing pages that sound like your brand." },
        { icon: "✍️", title: "Bloggers & Creators", desc: "Keep your voice while you write faster with AI." },
        { icon: "🤝", title: "Agencies & Freelancers", desc: "Deliver AI-assisted work with real substance, not generic filler." },
        { icon: "💼", title: "Professionals", desc: "Emails, reports and LinkedIn posts that sound like you." },
      ],
    },
    reasons: {
      title: "Why Humanize With Content Trace",
      sub: "Better content, not just different wording.",
      items: [
        { icon: "💡", title: "Your Expertise, Not Ours", desc: "We never invent stories or facts. We mark where your own examples and data belong, so the result is original." },
        { icon: "↔️", title: "Every Change Shown", desc: "Before and after, side by side, with the changes highlighted." },
        { icon: "🛡️", title: "Keeps Your Facts", desc: "Your facts, numbers and quotes stay. A fact check flags anything that changed." },
        { icon: "🆓", title: "Free to Try", desc: `${FREE_CHECKS} free checks a month. No account, no credit card.` },
        PRIVACY,
      ],
    },
    showDetectorDetails: false,
    showBlog: false,
    faqs: [
      { q: "How do I humanize AI writing?", a: "Start with what only you can add: a real example, a number from your work, your own opinion. Then cut AI filler, vary your sentence length and use plain words. Content Trace does the wording edits in one click and marks where your own details belong, so the result is better, not just different." },
      { q: "How is this different from other AI humanizers?", a: "Many humanizers paraphrase text to slip past AI detectors. That often makes writing worse and can change your meaning. Content Trace edits for clarity and originality, keeps your facts and quotes, shows every change, and points you to the details that make content worth reading." },
      { q: "Is this AI humanizer free?", a: FAQ_FREE },
      { q: "Will it make my text undetectable?", a: FAQ_UNDETECTABLE },
      { q: "Does it change my meaning or facts?", a: FAQ_FACTS },
      { q: "What can I humanize?", a: `Any text you write: blog posts, emails, LinkedIn posts, reports, product descriptions and landing pages. Free checks work on texts up to ${PLANS.free.charLimit.toLocaleString()} characters. Pro works on texts up to ${PLANS.pro.charLimit.toLocaleString()} characters.` },
      { q: "What else can it do?", a: "After you humanize a draft, you can run SEO (descriptive headings, the main point early, your keyword placed naturally) or AI answers (a direct answer up top and passages that AI Overviews, ChatGPT and Perplexity can quote) on the same text, and compare each version." },
      { q: "Is my text stored?", a: FAQ_STORE },
    ],
  },
};
