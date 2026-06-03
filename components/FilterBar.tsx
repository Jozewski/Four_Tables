"use client";
 
import { useRouter, useSearchParams } from "next/navigation";
 
const cultures  = ["Italian", "Dutch", "German", "Mexican"];
const holidays  = ["Christmas", "Easter", "Thanksgiving"];
const categories = ["Main", "Dessert", "Bread", "Soup", "Side", "Seafood", "Appetizer"];
 
const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch:   "var(--dutch)",
  German:  "var(--german)",
  Mexican: "var(--mexican)",
};
 
export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const activeCultural = params.get("cultural")  || "";
  const activeHoliday  = params.get("holiday")   || "";
  const activeCategory = params.get("category")  || "";
 
  function navigate(cultural: string, holiday: string, category: string) {
    const q = new URLSearchParams();
    if (cultural) q.set("cultural", cultural);
    if (holiday)  q.set("holiday",  holiday);
    if (category) q.set("category", category);
    router.push(`/recipes${q.toString() ? "?" + q.toString() : ""}`);
  }
 
  function toggle(type: "cultural" | "holiday" | "category", value: string) {
    navigate(
      type === "cultural" ? (activeCultural === value ? "" : value) : activeCultural,
      type === "holiday"  ? (activeHoliday  === value ? "" : value) : activeHoliday,
      type === "category" ? (activeCategory === value ? "" : value) : activeCategory,
    );
  }
 
  const hasFilters = activeCultural || activeHoliday || activeCategory;

  function buttonClass(active: boolean) {
    return [
      "rounded-full px-4 py-2.5 border text-xs font-sans-alt font-extrabold uppercase tracking-[0.12em] transition-all min-h-10",
      active ? "shadow-sm" : "bg-white hover:-translate-y-px",
    ].join(" ");
  }
 
  return (
    <div className="soft-panel rounded-[1.75rem] p-6 md:p-7 space-y-7 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="font-sans-alt text-[11px] font-extrabold tracking-[0.22em] uppercase text-[var(--accent)] mb-2">Narrow the collection</p>
        <p className="font-body text-sm text-[var(--ink-soft)] leading-7">
          Filter by family tradition, holiday, or course to move through the recipe archive the way people browse a cooking site.
        </p>
      </div>

      <div>
        <p className="font-sans-alt text-[10px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mb-3">Family</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 justify-center">
          {cultures.map((c) => {
            const active = activeCultural === c;
            return (
              <button key={c} onClick={() => toggle("cultural", c)}
                className={buttonClass(active)}
                style={{
                  borderColor: active ? cultureColor[c] : "var(--border)",
                  backgroundColor: active ? cultureColor[c] : "transparent",
                  color: active ? "white" : "var(--ink-soft)",
                }}>
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-sans-alt text-[10px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mb-3">Holiday</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 justify-center">
          {holidays.map((h) => {
            const active = activeHoliday === h;
            return (
              <button key={h} onClick={() => toggle("holiday", h)}
                className={buttonClass(active)}
                style={{
                  borderColor: active ? "var(--gold)" : "var(--border)",
                  backgroundColor: active ? "var(--gold)" : "transparent",
                  color: active ? "white" : "var(--ink-soft)",
                }}>
                {h === "Christmas" && "🎄 "}
                {h === "Easter" && "🐣 "}
                {h === "Thanksgiving" && "🍂 "}
                {h}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-sans-alt text-[10px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mb-3">Course</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 justify-center">
          {categories.map((c) => {
            const active = activeCategory === c;
            return (
              <button key={c} onClick={() => toggle("category", c)}
                className={buttonClass(active)}
                style={{
                  borderColor: active ? "var(--ink)" : "var(--border)",
                  backgroundColor: active ? "var(--ink)" : "transparent",
                  color: active ? "white" : "var(--ink-soft)",
                }}>
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <button onClick={() => navigate("", "", "")}
          className="font-sans-alt text-xs font-extrabold tracking-[0.15em] uppercase text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors underline underline-offset-4 mx-auto block">
          ✕ Clear all filters
        </button>
      )}
    </div>
  );
}