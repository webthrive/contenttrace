import { env, PUBLIC_SUPABASE_URL } from "./env";

// Plans, prices and limits. Change values here; the API, pricing page and account page all read them.

export const PLANS = {
  free: {
    name: "Free",
    charLimit: 10_000,
    analysesPerMonth: 5,
  },
  pro: {
    name: "Pro",
    charLimit: 30_000,
    wordsPerMonth: 150_000,
    monthlyPrice: 12,
    yearlyPrice: 79,
  },
  pack: {
    name: "Word Pack",
    charLimit: 30_000,
    words: 50_000,
    price: 9,
  },
} as const;

// Yearly Pro shown as a monthly figure (e.g. $6.58) and the saving against paying monthly.
export const PRO_YEARLY_PER_MONTH = (PLANS.pro.yearlyPrice / 12).toFixed(2);
export const PRO_YEARLY_SAVE_PCT = Math.round((1 - PLANS.pro.yearlyPrice / (PLANS.pro.monthlyPrice * 12)) * 100);

// Same network (school, office) can share one IP, so the IP cap is higher than the per-browser cap.
export const FREE_ANALYSES_PER_IP = 15;

export const ACTIVE_SUB_STATUSES = new Set(["active", "trialing"]);

// Billing turns on only when the database is configured. Without it, the site works as before (no limits).
export function billingEnabled(): boolean {
  return Boolean(env("SUPABASE_SERVICE_ROLE_KEY") && PUBLIC_SUPABASE_URL);
}

export function stripeEnabled(): boolean {
  return Boolean(env("STRIPE_SECRET_KEY"));
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.contenttrace.ai").replace(/\/$/, "");
}

export const STRIPE_PRICES = {
  monthly: () => env("STRIPE_PRICE_MONTHLY"),
  yearly: () => env("STRIPE_PRICE_YEARLY"),
  pack: () => env("STRIPE_PRICE_PACK"),
};

export function currentPeriod(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
