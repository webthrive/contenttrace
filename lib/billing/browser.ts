"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function authAvailable(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Browser client: handles sign-in and keeps the session cookie fresh.
export function supabaseBrowser(): SupabaseClient {
  if (!client) client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return client;
}

export type UsageInfo = {
  enabled: boolean;
  payments?: boolean;
  error?: string;
  plan?: "free" | "pro" | "pack";
  signedIn?: boolean;
  email?: string | null;
  charLimit: number;
  freeAnalysesLeft?: number;
  freeAnalysesTotal?: number;
  proWordsLeft?: number | null;
  proWordsTotal?: number | null;
  packWords?: number;
  subPeriodEnd?: string | null;
};

export async function fetchUsage(): Promise<UsageInfo | null> {
  try {
    const r = await fetch("/api/usage", { cache: "no-store" });
    return (await r.json()) as UsageInfo;
  } catch {
    return null;
  }
}

// Start Stripe Checkout; sends the visitor to sign in first when needed.
export async function startCheckout(kind: "monthly" | "yearly" | "pack"): Promise<string | null> {
  const r = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind }) });
  const j = (await r.json().catch(() => ({}))) as { url?: string; error?: string; code?: string };
  if (j.code === "login") {
    window.location.href = `/login?next=${encodeURIComponent(`/pricing?buy=${kind}`)}`;
    return null;
  }
  if (j.code === "already_pro") {
    window.location.href = "/account";
    return null;
  }
  if (j.url) {
    window.location.href = j.url;
    return null;
  }
  return j.error || "Could not start checkout. Please try again.";
}
