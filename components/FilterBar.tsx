"use client";

import { useRouter, useSearchParams } from "next/navigation";

const cultures = ["Italian", "Dutch", "German", "Mexican"];
const holidays = ["Christmas", "Easter", "Thanksgiving"];
const categories = ["Main", "Dessert", "Bread", "Soup", "Side", "Seafood", "Appetizer"];

const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch: "var(--dutch)",
  German: "var(--german)",
  Mexican: "var(--mexican)",
};

export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const activeCultural = params.get("cultural") || "";
  const activeHoliday = params.get("holiday") || "";
  const activeCategory = params.get("category") || "";

  function navigate(cultural: string, holiday: string, category: string) {
    const q = new URLSearchParams();
    if (cultural) q.set("cultural", cultural);
    if (holiday) q.set("holiday", holiday);
    if (category) q.set("category", category);
    router.push(`/recipes${q.toString() ? "?" + q.toString() : ""}`);
  }

  function toggle(type: "cultural" | "holiday" | "category", value: string) {
    navigate(
      type === "cultural" ? (activeCultural === value ? "" : value) : activeCultural,
      type === "holiday" ? (activeHoliday === value ? "" : value) : activeHoliday,
      type === "category" ? (activeCategory === value ? "" : value) : activeCategory,
    );
  }

  const hasFilters = activeCultural || activeHoliday || activeCategory;

  function buttonClass(active: boolean) {
    return [
      "rounded-full px-4 py-2 border text-xs font-sans-alt font-extrabold uppercase tracking-[0.1em] transition-all min-h-10",
      active ? "shadow-sm" : "bg-white hover:-translate-y-px hover:border-[var(--accent)]",
    ].join(" ");
  }

  return (
    <div className="filter-panel">
      <div className="filter-grid">
        <div>
          <p className="mb-3 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            Family
          </p>
          <div className="filter-options">
            {cultures.map((culture) => {
              const active = activeCultural === culture;
              return (
                <button
                  key={culture}
                  onClick={() => toggle("cultural", culture)}
                  className={buttonClass(active)}
                  style={{
                    borderColor: active ? cultureColor[culture] : "var(--border)",
                    backgroundColor: active ? cultureColor[culture] : "var(--filter-chip-bg)",
                    color: active ? "#ffffff" : "#0f172a",
                  }}
                >
                  {culture}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            Holiday
          </p>
          <div className="filter-options">
            {holidays.map((holiday) => {
              const active = activeHoliday === holiday;
              return (
                <button
                  key={holiday}
                  onClick={() => toggle("holiday", holiday)}
                  className={buttonClass(active)}
                  style={{
                    borderColor: active ? "var(--gold)" : "var(--border)",
                    backgroundColor: active ? "var(--gold)" : "var(--filter-chip-bg)",
                    color: active ? "#111827" : "#0f172a",
                  }}
                >
                  {holiday}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            Course
          </p>
          <div className="filter-options">
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => toggle("category", category)}
                  className={buttonClass(active)}
                  style={{
                    borderColor: active ? "var(--accent)" : "var(--border)",
                    backgroundColor: active ? "var(--accent)" : "var(--filter-chip-bg)",
                    color: active ? "#111827" : "#0f172a",
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={() => navigate("", "", "")}
            className="self-end rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 font-sans-alt text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ink-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--ink)] lg:justify-self-end"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
