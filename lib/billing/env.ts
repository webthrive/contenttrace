// Read a server-side setting and remove spaces or line breaks that a paste can add.
export function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

// Settings that the browser also needs. Next.js inlines these only when the full name is written out.
export const PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || undefined;
export const PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || undefined;
