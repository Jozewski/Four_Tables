import Link from "next/link";

const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch:   "var(--dutch)",
  German:  "var(--german)",
  Mexican: "var(--mexican)",
};

const holidayEmoji: Record<string, string> = {
  Christmas:    "🎄",
  Easter:       "🐣",
  Thanksgiving: "🍂",
};

type Props = {
  recipe: {
    id: number;
    title: string;
    description: string | null;
    cultural: string;
    holiday: string;
    prepTime: number | null;
    _count: { ingredients: number; steps: number };
  };
};

function formatPrepTime(minutes: number | null): string {
  if (!minutes) return "";
  if (minutes < 60)  return `${minutes} min`;
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  const days = Math.floor(minutes / 1440);
  return `${days} day${days > 1 ? "s" : ""}`;
}

export default function RecipeCard({ recipe }: Props) {
  const color = cultureColor[recipe.cultural] ?? "var(--ink)";

  return (
    <Link href={`/recipes/${recipe.id}`} className="card-lift group block">
      <article className="border border-[var(--border)] bg-white/60 h-full relative overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ backgroundColor: color }} />

        <div className="p-6">
          {/* Meta row */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="font-sans-alt text-[10px] tracking-[0.2em] uppercase font-semibold"
              style={{ color }}
            >
              {recipe.cultural}
            </span>
            <span className="font-sans-alt text-[10px] tracking-[0.15em] uppercase text-[var(--ink-muted)]">
              {holidayEmoji[recipe.holiday]} {recipe.holiday}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-xl font-semibold text-[var(--ink)] leading-snug mb-3 group-hover:underline decoration-1 underline-offset-2">
            {recipe.title}
          </h2>

          {/* Description */}
          {recipe.description && (
            <p className="font-body text-sm text-[var(--ink-soft)] leading-relaxed line-clamp-3 mb-4">
              {recipe.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 pt-3 border-t border-[var(--border)]">
            {recipe.prepTime && (
              <span className="font-sans-alt text-[11px] tracking-wide text-[var(--ink-muted)]">
                ⏱ {formatPrepTime(recipe.prepTime)}
              </span>
            )}
            <span className="font-sans-alt text-[11px] tracking-wide text-[var(--ink-muted)]">
              {recipe._count.ingredients} ingredients
            </span>
            <span className="font-sans-alt text-[11px] tracking-wide text-[var(--ink-muted)]">
              {recipe._count.steps} steps
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
