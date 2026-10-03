"use client";

export type WorkspaceTab<T extends string> = { id: T; label: string; badge?: number | string | null };

// Big, obvious tabs that split a results page into "Analysis" and "Optimize & compare".
export default function WorkspaceTabs<T extends string>({ tabs, active, onChange }: { tabs: WorkspaceTab<T>[]; active: T; onChange: (id: T) => void }) {
  return (
    <div role="tablist" style={{ display: "flex", gap: "6px", borderBottom: "1px solid var(--border)", margin: "0 0 18px", overflowX: "auto" }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button key={t.id} role="tab" aria-selected={on} onClick={() => onChange(t.id)}
            style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", padding: "11px 16px", fontSize: "15px", fontWeight: on ? 700 : 500, fontFamily: "var(--font)", cursor: "pointer",
              color: on ? "var(--accent)" : "var(--text-secondary)", background: "none", border: "none", borderBottom: on ? "3px solid var(--accent)" : "3px solid transparent", marginBottom: "-1px" }}>
            {t.label}
            {t.badge != null && t.badge !== 0 && t.badge !== "" && (
              <span style={{ fontSize: "12px", fontWeight: 700, color: "white", background: "var(--accent)", borderRadius: "10px", padding: "1px 8px" }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
