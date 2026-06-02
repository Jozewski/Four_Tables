"use client";

import { useRouter, useSearchParams } from "next/navigation";

const cultures = ["Italian", "Dutch", "German", "Mexican"];
const holidays = ["Christmas", "Easter", "Thanksgiving"];

const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch:   "var(--dutch)",
  German:  "var(--german)",
  Mexican: "var(--mexican)",
};

export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const activeCultural = params.get("cultural") || "";
  const activeHoliday  = params.get("holiday")  || "";

  function navigate(cultural: string, holiday: string) {
    const q = new URLSearchParams();
    if (cultural) q.set("cultural", cultural);
    if (holiday)  q.set("holiday",  holiday);
    router.push(`/recipes${q.toString() ? "?" + q.toString() : ""}`);
  }

  function toggleCultural(c: string) {
    navigate(activeCultural === c ? "" : c, activeHoliday);
  }

  function toggleHoliday(h: string) {
    navigate(activeCultural, activeHoliday === h ? "" : h);
  }

  return (
    <div className="space-y-5">
      {/* Cultural filters */}
      <div>
        <p className="font-sans-alt text-[10px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mb-3">
          Family
        </p>
        <div className="flex flex-wrap gap-2">
          {cultures.map((c) => {
            const active = activeCultural === c;
            return (
              <button
                key={c}
                onClick={() => toggleCultural(c)}
                className="font-sans-alt text-xs tracking-[0.12em] uppercase px-4 py-2 border transition-all"
                style={{
                  borderColor: active ? cultureColor[c] : "var(--border)",
                  backgroundColor: active ? cultureColor[c] : "transparent",
                  color: active ? "white" : "var(--ink-soft)",
                }}
              >
                {c}
              </button>
            );
          })}
          {activeCultural && (
            <button
              onClick={() => toggleCultural(activeCultural)}
              className="font-sans-alt text-xs tracking-[0.12em] uppercase px-3 py-2 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Holiday filters */}
      <div>
        <p className="font-sans-alt text-[10px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mb-3">
          Holiday
        </p>
        <div className="flex flex-wrap gap-2">
          {holidays.map((h) => {
            const active = activeHoliday === h;
            return (
              <button
                key={h}
                onClick={() => toggleHoliday(h)}
                className="font-sans-alt text-xs tracking-[0.12em] uppercase px-4 py-2 border transition-all"
                style={{
                  borderColor: active ? "var(--gold)" : "var(--border)",
                  backgroundColor: active ? "var(--gold)" : "transparent",
                  color: active ? "white" : "var(--ink-soft)",
                }}
              >
                {h === "Christmas" && "🎄 "}
                {h === "Easter"    && "🐣 "}
                {h === "Thanksgiving" && "🍂 "}
                {h}
              </button>
            );
          })}
          {activeHoliday && (
            <button
              onClick={() => toggleHoliday(activeHoliday)}
              className="font-sans-alt text-xs tracking-[0.12em] uppercase px-3 py-2 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
