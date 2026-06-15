import Link from "next/link";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/images";
 
const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch:   "var(--dutch)",
  German:  "var(--german)",
  Mexican: "var(--mexican)",
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

function cultureInitial(cultural: string): string {
  return cultural.slice(0, 1).toUpperCase();
}
 
export default function RecipeCard({ recipe }: Props) {
  const color = cultureColor[recipe.cultural] ?? "var(--ink)";
  const metaLabel = recipe.holiday ?? recipe.category;
  const prepTime = formatPrepTime(recipe.prepTime);
  const imageUrl = getSafeImageUrl(recipe.imageUrl);
 
  return (
    <Link href={`/recipes/${recipe.id}`} className="card-lift group block h-full">
      <article className="section-card rounded-[1.5rem] h-full relative overflow-hidden flex flex-col">
        <div className="relative w-full h-52 bg-[var(--cream-dark)] overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.title}
              width={1200}
              height={800}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: color }}>
              <span className="font-display text-6xl text-white/85">
                {cultureInitial(recipe.cultural)}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute left-4 right-4 bottom-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-2">
            <span className="image-chip">
              {recipe.cultural}
            </span>

            <span className="image-chip">
              {metaLabel}
            </span>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: color }} />
        </div>

        <div className="p-5 md:p-6 flex flex-col flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3 text-[10px] font-sans-alt font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)] mb-3">
            <span>{recipe.category}</span>
            {prepTime ? <span>{prepTime}</span> : <span>Family recipe</span>}
          </div>

          <h2 className="font-display text-[1.25rem] sm:text-[1.45rem] font-semibold text-[var(--ink)] leading-tight mb-3 group-hover:text-[var(--accent)] transition-colors flex-1">
            {recipe.title}
          </h2>

          {recipe.description && (
            <p className="font-body text-sm text-[var(--ink-soft)] leading-7 line-clamp-2 sm:line-clamp-3 mb-5">
              {recipe.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-4 border-t border-[var(--border)] mt-auto">
            <span className="font-sans-alt text-[11px] font-semibold tracking-wide text-[var(--ink-muted)]">
              {recipe._count.ingredients} ingredients
            </span>
            <span className="font-sans-alt text-[11px] font-semibold tracking-wide text-[var(--ink-muted)]">
              {recipe._count.steps} steps
            </span>
            <span className="sm:ml-auto font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color }}>
              View recipe
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
