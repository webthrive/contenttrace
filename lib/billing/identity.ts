import { createHash, randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { getSessionUser } from "./supabase";
import { env } from "./env";
import type { Identity } from "./entitlements";

const ANON_COOKIE = "ct_aid";

// Identify the visitor: signed-in user (if any), an anonymous browser ID, and a salted IP hash.
// The raw IP address is never stored.
export async function getIdentity(): Promise<Identity> {
  const store = await cookies();
  let anonId = store.get(ANON_COOKIE)?.value;
  if (!anonId || !/^[a-f0-9]{32}$/.test(anonId)) {
    anonId = randomBytes(16).toString("hex");
    try {
      store.set(ANON_COOKIE, anonId, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 400 });
    } catch {
      // read-only context
    }
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
  const ipHash = createHash("sha256")
    .update(`${env("IP_HASH_SALT") || "contenttrace"}:${ip}`)
    .digest("hex")
    .slice(0, 32);

  const user = await getSessionUser();
  return { userId: user?.id ?? null, email: user?.email ?? null, anonId, ipHash };
}

// Cloudflare Turnstile check for free (not paid) analyses. Skipped when no secret is configured.
export async function verifyTurnstile(token: unknown): Promise<boolean> {
  const secret = env("TURNSTILE_SECRET_KEY");
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    // No "remoteip": on mobile networks (for example iCloud Private Relay or IPv4/IPv6 switching)
    // the IP that solved the check can differ from the IP that calls this API.
    const body = new URLSearchParams({ secret, response: token });
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const j = (await r.json()) as { success?: boolean; "error-codes"?: string[]; hostname?: string };
    if (!j.success) console.warn("Turnstile check failed:", (j["error-codes"] ?? []).join(","), j.hostname ?? "");
    return Boolean(j.success);
  } catch (err) {
    console.warn("Turnstile check error:", err instanceof Error ? err.message : "unknown");
    return false;
  }
}
