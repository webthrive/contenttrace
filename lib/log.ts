// Write an error to the server log with any key or secret removed.
const SECRET = /(sb_secret_|sb_publishable_|sk_live_|sk_test_|rk_live_|rk_test_|whsec_|sk-ant-)[A-Za-z0-9_\-]+/g;

export function redact(text: string): string {
  return text.replace(SECRET, "$1[redacted]");
}

function describe(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}\n${err.stack ?? ""}`;
  if (typeof err === "string") return err;
  if (Array.isArray(err)) return err.map(describe).join("\n---\n");
  try { return JSON.stringify(err); } catch { return String(err); }
}

export function logError(label: string, err: unknown): void {
  console.error(label, redact(describe(err)));
}
