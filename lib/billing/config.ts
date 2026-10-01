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
    monthlyPrice: 9,
    yearlyPrice: 79,
  },
  pack: {
    name: "Word Pack",
    charLimit: 30_000,
    words: 50_000,
    price: 9,
  },
} as const;

// Same network (school, office) can share one IP, so the IP cap is higher than the per-browser cap.
export const FREE_ANALYSES_PER_IP = 15;

export const ACTIVE_SUB_STATUSES = new Set(["active", "trialing"]);

// Billing turns on only when the database is configured. Without it, the site works as before (no limits).
export function billingEnabled(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.contenttrace.ai").replace(/\/$/, "");
}

export const STRIPE_PRICES = {
  monthly: () => process.env.STRIPE_PRICE_MONTHLY,
  yearly: () => process.env.STRIPE_PRICE_YEARLY,
  pack: () => process.env.STRIPE_PRICE_PACK,
};

export function currentPeriod(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
