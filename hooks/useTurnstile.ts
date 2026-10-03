"use client";

import { useEffect, useRef, useState } from "react";
import type { UsageInfo } from "@/lib/billing/browser";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
const api = () => (window as unknown as { turnstile?: TurnstileApi }).turnstile;

// Free-plan requests need a Cloudflare Turnstile token. Paid plans never do.
export function needsBotCheckFor(usage: UsageInfo | null): boolean {
  return Boolean(TURNSTILE_SITE_KEY && usage?.enabled && usage.plan === "free");
}

// Cloudflare Turnstile: a quick, usually invisible human check. Put `ref` on an empty div.
export function useTurnstile(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [, setToken] = useState<string | null>(null);
  // Latest token and when it arrived. Tokens are single-use and expire after 5 minutes,
  // and mobile browsers can pause the expiry timer while a tab is in the background.
  const tokenRef = useRef<{ token: string; at: number } | null>(null);

  useEffect(() => {
    if (!enabled || widgetId.current) return;
    const render = () => {
      const ts = api();
      if (!ts || !ref.current || widgetId.current) return;
      widgetId.current = ts.render(ref.current, {
        sitekey: TURNSTILE_SITE_KEY, appearance: "interaction-only",
        callback: (t: string) => { tokenRef.current = { token: t, at: Date.now() }; setToken(t); },
        "expired-callback": () => { tokenRef.current = null; setToken(null); },
        "error-callback": () => {
          tokenRef.current = null; setToken(null);
          setTimeout(() => { const t = api(); if (t && widgetId.current) t.reset(widgetId.current); }, 2000);
          return true;
        },
      });
    };
    if (api()) { render(); return; }
    const existing = document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile"]');
    if (existing) { existing.addEventListener("load", render); return; }
    const sc = document.createElement("script");
    sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    sc.async = true; sc.onload = render;
    document.head.appendChild(sc);
  }, [enabled]);

  const reset = () => {
    const ts = api();
    tokenRef.current = null;
    if (ts && widgetId.current) { ts.reset(widgetId.current); setToken(null); }
  };

  // Return a token that is fresh and not used yet. Gets a new one when needed (waits up to 20 s).
  const getFreshToken = async (force = false): Promise<string | null> => {
    const cur = tokenRef.current;
    if (!force && cur && Date.now() - cur.at < 240_000) { tokenRef.current = null; return cur.token; }
    reset();
    for (let i = 0; i < 80; i++) {
      await new Promise((r) => setTimeout(r, 250));
      const t = tokenRef.current;
      if (t) { tokenRef.current = null; return t.token; }
    }
    return null;
  };

  return { ref, reset, getFreshToken };
}
