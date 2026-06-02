import Link from "next/link";
import Image from "next/image";
 
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
    holiday: string | null;
    category: string;
    prepTime: number | null;
    imageUrl: string | null;
    _count: { ingredients: number; steps: number };
  };
};
 
function formatPrepTime(minutes: number | null): string {
  if (!minutes) return "";
  if (minutes < 60)   return `${minutes} min`;
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  const days = Math.floor(minutes / 1440);
  return `${days}d`;
}
 
export default function RecipeCard({ recipe }: Props) {
  const color = cultureColor[recipe.cultural] ?? "var(--ink)";
 
  return (
    <Link href={`/recipes/${recipe.id}`} className="card-lift group block">
      <article className="border border-[var(--border)] bg-white/60 h-full relative overflow-hidden flex flex-col">
 
        {/* Photo */}
        <div className="relative w-full h-48 bg-[var(--cream-dark)] overflow-hidden flex-shrink-0">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              width={1200}
              height={800}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-30">
                {recipe.cultural === "Italian"  ? "🍝"
                : recipe.cultural === "Dutch"   ? "🌷"
                : recipe.cultural === "German"  ? "🦢"
                : "🌶️"}
              </span>
            </div>
          )}
          {/* Holiday badge overlaid on photo */}
          {recipe.holiday && (
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1">
              <span className="font-sans-alt text-[9px] tracking-[0.15em] uppercase text-white">
                {holidayEmoji[recipe.holiday]} {recipe.holiday}
              </span>
            </div>
          )}
          {/* Category badge */}
          {!recipe.holiday && (
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1">
              <span className="font-sans-alt text-[9px] tracking-[0.15em] uppercase text-white">
                {recipe.category}
              </span>
            </div>
          )}
          {/* Color bar at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: color }} />
        </div>
 
        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <span
            className="font-sans-alt text-[10px] tracking-[0.2em] uppercase font-semibold mb-2"
            style={{ color }}
          >
            {recipe.cultural}
          </span>
 
          <h2 className="font-display text-lg font-semibold text-[var(--ink)] leading-snug mb-3 group-hover:underline decoration-1 underline-offset-2 flex-1">
            {recipe.title}
          </h2>
 
          {recipe.description && (
            <p className="font-body text-sm text-[var(--ink-soft)] leading-relaxed line-clamp-2 mb-4">
              {recipe.description}
            </p>
          )}
 
          {/* Stats */}
          <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)] mt-auto">
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