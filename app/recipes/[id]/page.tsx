import { prisma } from "@/lib/prisma";
import RecipeDetail from "@/components/RecipeDetail";
import Link from "next/link";
import Image from "next/image";
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (!Number.isFinite(id)) return { title: "Recipe Not Found" };

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { title: true, cultural: true },
  });
  if (!recipe) return { title: "Recipe Not Found" };
  return { title: `${recipe.title} — Four Tables` };
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (!Number.isFinite(id)) notFound();

  const recipe = await prisma.recipe.findUnique({
    where: { id },
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
    <div className="max-w-5xl mx-auto px-6 md:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="font-sans-alt text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)] mb-8 fade-up">
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

      {/* Hero */}
      <header className="mb-10 fade-up fade-up-delay-1">
        <div className="relative border border-[var(--border)] bg-white/70 overflow-hidden">
          <div className="relative w-full h-64 md:h-80 lg:h-96 bg-[var(--cream-dark)]">
            {recipe.imageUrl ? (
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={1600}
                height={1000}
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 1200px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
                {recipe.cultural === "Italian" ? "🍝" : recipe.cultural === "Dutch" ? "🌷" : recipe.cultural === "German" ? "🦢" : "🌶️"}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            <div className="absolute left-0 right-0 bottom-0 p-6 md:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="font-sans-alt text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1 border border-white/60 bg-black/20"
                  style={{ borderColor: color }}
                >
                  {recipe.cultural}
                </span>
                <span className="font-sans-alt text-[10px] tracking-[0.2em] uppercase px-3 py-1 bg-black/30 border border-white/25">
                  {recipe.holiday ? `${holidayEmoji[recipe.holiday] ?? ""} ${recipe.holiday}` : recipe.category}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                {recipe.title}
              </h1>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {recipe.description && (
              <p className="font-body text-base md:text-lg text-[var(--ink-soft)] leading-relaxed max-w-3xl">
                {recipe.description}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
              {recipe.prepTime && (
                <div>
                  <p className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">Prep Time</p>
                  <p className="font-body text-sm text-[var(--ink)] mt-1">{formatPrepTime(recipe.prepTime)}</p>
                </div>
              )}
              <div>
                <p className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">Category</p>
                <p className="font-body text-sm text-[var(--ink)] mt-1">{recipe.category}</p>
              </div>
              <div>
                <p className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">Ingredients</p>
                <p className="font-body text-sm text-[var(--ink)] mt-1">{recipe.ingredients.length}</p>
              </div>
              <div>
                <p className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">Steps</p>
                <p className="font-body text-sm text-[var(--ink)] mt-1">{recipe.steps.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabbed content */}
      <div className="fade-up fade-up-delay-2 border border-[var(--border)] bg-white/70 p-6 md:p-8">
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
