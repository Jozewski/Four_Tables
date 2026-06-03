import { prisma } from "@/lib/prisma";
import RecipeDetail from "@/components/RecipeDetail";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSafeImageUrl } from "@/lib/images";

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

  const imageUrl = getSafeImageUrl(recipe.imageUrl);

  const color = cultureColor[recipe.cultural] ?? "var(--ink)";

  // Sibling recipes — same cultural tradition, different id
  const related = await prisma.recipe.findMany({
    where: { cultural: recipe.cultural, id: { not: recipe.id } },
    select: { id: true, title: true, holiday: true },
    take: 3,
  });

  return (
    <div className="portal-shell py-10 md:py-12">
      <nav className="font-sans-alt text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)] mb-8 fade-up">
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

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] items-start fade-up fade-up-delay-1">
        <aside className="section-card rounded-[2rem] overflow-hidden lg:sticky lg:top-28">
          <div className="relative w-full h-[22rem] md:h-[30rem] lg:h-[40rem] bg-[var(--cream-dark)]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={recipe.title}
                width={1200}
                height={1600}
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
                {recipe.cultural === "Italian" ? "🍝" : recipe.cultural === "Dutch" ? "🌷" : recipe.cultural === "German" ? "🦢" : "🌶️"}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute left-0 right-0 bottom-0 p-5 md:p-7 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="font-sans-alt text-[10px] font-extrabold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border border-white/60 bg-black/25"
                  style={{ borderColor: color }}
                >
                  {recipe.cultural}
                </span>
                <span className="font-sans-alt text-[10px] font-extrabold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-white/90 text-[var(--ink)] border border-white/25">
                  {recipe.holiday ? `${holidayEmoji[recipe.holiday] ?? ""} ${recipe.holiday}` : recipe.category}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <header className="section-card rounded-[2rem] p-6 md:p-8 lg:p-10">
            <p className="eyebrow mb-4">Recipe Details</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[0.96] text-[var(--ink)]">
              {recipe.title}
            </h1>

            {recipe.description && (
              <p className="font-body text-base md:text-lg text-[var(--ink-soft)] leading-8 mt-5">
                {recipe.description}
              </p>
            )}

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mt-7 pt-6 border-t border-[var(--border)]">
              {recipe.prepTime && (
                <div className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                  <p className="font-sans-alt text-[10px] font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)]">Prep Time</p>
                  <p className="font-body text-sm text-[var(--ink)] mt-2">{formatPrepTime(recipe.prepTime)}</p>
                </div>
              )}
              <div className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                <p className="font-sans-alt text-[10px] font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)]">Category</p>
                <p className="font-body text-sm text-[var(--ink)] mt-2">{recipe.category}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                <p className="font-sans-alt text-[10px] font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)]">Ingredients</p>
                <p className="font-body text-sm text-[var(--ink)] mt-2">{recipe.ingredients.length}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                <p className="font-sans-alt text-[10px] font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)]">Steps</p>
                <p className="font-body text-sm text-[var(--ink)] mt-2">{recipe.steps.length}</p>
              </div>
            </div>
          </header>

          <section className="fade-up fade-up-delay-2 section-card rounded-[2rem] p-6 md:p-8 lg:p-10">
            <p className="eyebrow mb-4">Recipe & Instructions</p>
            <RecipeDetail
              cultural={recipe.cultural}
              ingredients={recipe.ingredients}
              steps={recipe.steps}
              notes={recipe.notes}
            />
          </section>
        </div>
      </section>

      {/* Related recipes from same tradition */}
      {related.length > 0 && (
        <section className="mt-16 pt-10 border-t border-[var(--border)] fade-up">
          <p className="ornamental-rule mb-8" style={{ color }}>
            More {recipe.cultural} Recipes
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/recipes/${r.id}`}
                className="card-lift block rounded-[1.35rem] border border-[var(--border)] p-5 bg-[var(--surface)]"
              >
                <span className="font-sans-alt text-[10px] font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)]">
                  {r.holiday ? `${holidayEmoji[r.holiday]} ${r.holiday}` : "Family recipe"}
                </span>
                <h3 className="font-display text-lg font-semibold text-[var(--ink)] mt-2 leading-snug">
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
