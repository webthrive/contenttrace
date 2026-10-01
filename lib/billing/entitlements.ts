// Who may run an analysis, how long the text may be, and how usage is counted.
// The store is an interface so the logic can be tested without a real database.
import { ACTIVE_SUB_STATUSES, FREE_ANALYSES_PER_IP, PLANS, currentPeriod } from "./config";

export type Profile = {
  sub_status: string | null;
  sub_period_end: string | null;
  pack_words: number;
  stripe_customer_id: string | null;
};

export interface BillingStore {
  getProfile(userId: string): Promise<Profile | null>;
  getUsage(subject: string, period: string): Promise<{ analyses: number; words: number }>;
  consumeUsage(subject: string, period: string, words: number, maxAnalyses: number | null, maxWords: number | null): Promise<boolean>;
  releaseUsage(subject: string, period: string, words: number): Promise<void>;
  consumePack(userId: string, words: number): Promise<boolean>;
  addPack(userId: string, words: number): Promise<void>;
}

export type Identity = {
  userId: string | null;
  email: string | null;
  anonId: string;
  ipHash: string;
};

export type Status = {
  plan: "free" | "pro" | "pack";
  signedIn: boolean;
  email: string | null;
  charLimit: number;
  freeAnalysesLeft: number; // for free users (and as a fallback for others)
  freeAnalysesTotal: number;
  proWordsLeft: number | null; // null when not Pro
  proWordsTotal: number | null;
  packWords: number;
  subPeriodEnd: string | null;
};

export function isProActive(p: Profile | null, now = new Date()): boolean {
  if (!p || !p.sub_status || !ACTIVE_SUB_STATUSES.has(p.sub_status)) return false;
  if (!p.sub_period_end) return true;
  return new Date(p.sub_period_end).getTime() > now.getTime() - 24 * 3600 * 1000; // 1 day grace for webhook delays
}

function freeSubject(id: Identity) {
  return id.userId ? `user:${id.userId}` : `anon:${id.anonId}`;
}

export async function getStatus(store: BillingStore, id: Identity, now = new Date()): Promise<Status> {
  const period = currentPeriod(now);
  const profile = id.userId ? await store.getProfile(id.userId) : null;
  const pro = isProActive(profile, now);
  const packWords = profile?.pack_words ?? 0;

  const freeUsed = (await store.getUsage(freeSubject(id), period)).analyses;
  const freeLeft = Math.max(0, PLANS.free.analysesPerMonth - freeUsed);

  let proWordsLeft: number | null = null;
  if (pro && id.userId) {
    const used = (await store.getUsage(`pro:${id.userId}`, period)).words;
    proWordsLeft = Math.max(0, PLANS.pro.wordsPerMonth - used);
  }

  const plan: Status["plan"] = pro ? "pro" : packWords > 0 ? "pack" : "free";
  return {
    plan,
    signedIn: Boolean(id.userId),
    email: id.email,
    charLimit: plan === "free" ? PLANS.free.charLimit : Math.max(PLANS.pro.charLimit, PLANS.pack.charLimit),
    freeAnalysesLeft: freeLeft,
    freeAnalysesTotal: PLANS.free.analysesPerMonth,
    proWordsLeft,
    proWordsTotal: pro ? PLANS.pro.wordsPerMonth : null,
    packWords,
    subPeriodEnd: profile?.sub_period_end ?? null,
  };
}

export type Reservation =
  | { ok: true; source: "pro" | "pack" | "free"; release: () => Promise<void> }
  | { ok: false; code: "too_long" | "limit"; message: string };

// Reserve usage before the analysis starts. Call release() if the analysis fails.
export async function reserve(store: BillingStore, id: Identity, text: string, words: number, now = new Date()): Promise<Reservation> {
  const period = currentPeriod(now);
  const status = await getStatus(store, id, now);

  if (text.length > status.charLimit) {
    return {
      ok: false,
      code: "too_long",
      message:
        status.plan === "free"
          ? `Free analyses are limited to ${PLANS.free.charLimit.toLocaleString()} characters. Pro and Word Pack allow up to ${PLANS.pro.charLimit.toLocaleString()}.`
          : `Text must be under ${status.charLimit.toLocaleString()} characters.`,
    };
  }

  // 1. Pro monthly words
  if (status.plan === "pro" && id.userId) {
    const subject = `pro:${id.userId}`;
    if (await store.consumeUsage(subject, period, words, null, PLANS.pro.wordsPerMonth)) {
      return { ok: true, source: "pro", release: () => store.releaseUsage(subject, period, words) };
    }
  }

  // 2. Word Pack credits (also used by Pro users who run out of monthly words)
  if (id.userId && status.packWords >= words) {
    const userId = id.userId;
    if (await store.consumePack(userId, words)) {
      return { ok: true, source: "pack", release: () => store.addPack(userId, words) };
    }
  }

  // 3. Free analyses (only for text within the free length limit)
  if (text.length <= PLANS.free.charLimit) {
    const subject = freeSubject(id);
    if (await store.consumeUsage(subject, period, words, PLANS.free.analysesPerMonth, null)) {
      const ipSubject = `ip:${id.ipHash}`;
      if (id.userId || (await store.consumeUsage(ipSubject, period, words, FREE_ANALYSES_PER_IP, null))) {
        return {
          ok: true,
          source: "free",
          release: async () => {
            await store.releaseUsage(subject, period, words);
            if (!id.userId) await store.releaseUsage(ipSubject, period, words);
          },
        };
      }
      await store.releaseUsage(subject, period, words); // IP cap reached: undo the browser count
    }
  }

  const message =
    status.plan === "pro"
      ? "You have used this month's Pro words. Add a Word Pack to keep going, or wait until next month."
      : status.plan === "pack"
        ? "Your Word Pack does not have enough words left for this text. Add another pack or upgrade to Pro."
        : `You have used your ${PLANS.free.analysesPerMonth} free analyses this month. Upgrade to Pro or buy a Word Pack to keep going.`;
  return { ok: false, code: "limit", message };
}

// Supabase implementation of the store.
export function supabaseStore(sb: import("@supabase/supabase-js").SupabaseClient): BillingStore {
  const check = <T,>(r: { data: T; error: { message: string } | null }) => {
    if (r.error) throw new Error(r.error.message);
    return r.data;
  };
  return {
    async getProfile(userId) {
      const r = await sb.from("profiles").select("sub_status, sub_period_end, pack_words, stripe_customer_id").eq("id", userId).maybeSingle();
      return check(r) as Profile | null;
    },
    async getUsage(subject, period) {
      const r = await sb.from("usage").select("analyses, words").eq("subject", subject).eq("period", period).maybeSingle();
      const d = check(r) as { analyses: number; words: number } | null;
      return d ?? { analyses: 0, words: 0 };
    },
    async consumeUsage(subject, period, words, maxAnalyses, maxWords) {
      const r = await sb.rpc("consume_usage", { p_subject: subject, p_period: period, p_words: words, p_max_analyses: maxAnalyses, p_max_words: maxWords });
      return Boolean(check(r));
    },
    async releaseUsage(subject, period, words) {
      check(await sb.rpc("release_usage", { p_subject: subject, p_period: period, p_words: words }));
    },
    async consumePack(userId, words) {
      const r = await sb.rpc("consume_pack", { p_user: userId, p_words: words });
      return Boolean(check(r));
    },
    async addPack(userId, words) {
      check(await sb.rpc("add_pack", { p_user: userId, p_words: words }));
    },
  };
}
