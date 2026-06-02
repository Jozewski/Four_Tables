import { prisma } from "@/lib/prisma";
import RecipeDetail from "@/components/RecipeDetail";
import Link from "next/link";
import { notFound } from "next/navigation";

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

function formatPrepTime(minutes: number | null): string {
  if (!minutes) return "";
  if (minutes < 60)   return `${minutes} minutes`;
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} hr ${m} min` : `${h} hours`;
  }
  const days = Math.floor(minutes / 1440);
  return `${days} day${days > 1 ? "s" : ""} (includes inactive time)`;
}

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({ select: { id: true } });
  return recipes.map((r) => ({ id: String(r.id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(params.id) },
    select: { title: true, cultural: true },
  });
  if (!recipe) return { title: "Recipe Not Found" };
  return { title: `${recipe.title} — Four Tables` };
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(params.id) },
    include: {
      ingredients: { orderBy: { order: "asc" } },
      steps:       { orderBy: { stepNumber: "asc" } },
      notes:       { orderBy: { createdAt: "asc" } },
    },
  });

  if (!recipe) notFound();

  const color = cultureColor[recipe.cultural] ?? "var(--ink)";

  // Sibling recipes — same cultural tradition, different id
  const related = await prisma.recipe.findMany({
    where: { cultural: recipe.cultural, id: { not: recipe.id } },
    select: { id: true, title: true, holiday: true },
    take: 3,
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      {/* Breadcrumb */}
      <nav className="font-sans-alt text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)] mb-10 fade-up">
        <Link href="/recipes" className="hover:text-[var(--ink)] transition-colors">
          All Recipes
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/recipes?cultural=${recipe.cultural}`}
          className="transition-colors hover:text-[var(--ink)]"
          style={{ color }}
        >
          {recipe.cultural}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--ink)]">{recipe.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-12 fade-up fade-up-delay-1">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="font-sans-alt text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1 border"
            style={{ color, borderColor: color }}
          >
            {recipe.cultural}
          </span>
          <span className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
            {holidayEmoji[recipe.holiday]} {recipe.holiday}
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--ink)] leading-tight mb-5">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="font-body text-lg text-[var(--ink-soft)] leading-relaxed max-w-2xl">
            {recipe.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-[var(--border)]">
          {recipe.prepTime && (
            <div>
              <p className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
                Prep Time
              </p>
              <p className="font-body text-sm text-[var(--ink)] mt-0.5">
                {formatPrepTime(recipe.prepTime)}
              </p>
            </div>
          )}
          <div>
            <p className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
              Ingredients
            </p>
            <p className="font-body text-sm text-[var(--ink)] mt-0.5">
              {recipe.ingredients.length}
            </p>
          </div>
          <div>
            <p className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
              Steps
            </p>
            <p className="font-body text-sm text-[var(--ink)] mt-0.5">
              {recipe.steps.length}
            </p>
          </div>
        </div>
      </header>

      {/* Accent rule */}
      <div className="h-px mb-10" style={{ backgroundColor: color, opacity: 0.3 }} />

      {/* Tabbed content */}
      <div className="fade-up fade-up-delay-2">
        <RecipeDetail
          cultural={recipe.cultural}
          ingredients={recipe.ingredients}
          steps={recipe.steps}
          notes={recipe.notes}
        />
      </div>

      {/* Related recipes from same tradition */}
      {related.length > 0 && (
        <section className="mt-20 pt-10 border-t border-[var(--border)] fade-up">
          <p className="ornamental-rule mb-8" style={{ color }}>
            More {recipe.cultural} Recipes
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/recipes/${r.id}`}
                className="card-lift block border border-[var(--border)] p-5 bg-white/60"
              >
                <span className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
                  {holidayEmoji[r.holiday]} {r.holiday}
                </span>
                <h3 className="font-display text-base font-semibold text-[var(--ink)] mt-1 leading-snug">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
