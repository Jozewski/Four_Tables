import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import RecipeImage from "@/components/RecipeImage";
import { notFound } from "next/navigation";
import RecipeDetail from "@/components/RecipeDetail";
import { getSafeImageUrl } from "@/lib/images";
import { prisma } from "@/lib/prisma";
import {
  getBreadcrumbStructuredData,
  getRecipeStructuredData,
  toJsonLd,
} from "@/lib/structuredData";

type RelatedRecipe = {
  id: number;
  title: string;
  holiday: string | null;
};

export const dynamic = "force-dynamic";

const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch: "var(--dutch)",
  German: "var(--german)",
  Mexican: "var(--mexican)",
};

function formatPrepTime(minutes: number | null): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} hr ${m} min` : `${h} hours`;
  }
  const days = Math.floor(minutes / 1440);
  return `${days} day${days > 1 ? "s" : ""} (includes inactive time)`;
}

function cultureInitial(cultural: string): string {
  return cultural.slice(0, 1).toUpperCase();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await connection();

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (!Number.isFinite(id)) return { title: "Recipe Not Found" };

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { title: true, cultural: true, description: true, imageUrl: true },
  });
  if (!recipe) return { title: "Recipe Not Found" };

  const description =
    recipe.description ??
    `${recipe.title} from the ${recipe.cultural} tradition on Four Tables.`;

  const imageUrl = getSafeImageUrl(recipe.imageUrl);

  return {
    title: `${recipe.title} - Four Tables`,
    description,
    alternates: {
      canonical: `/recipes/${id}`,
    },
    openGraph: {
      title: `${recipe.title} - Four Tables`,
      description,
      url: `/recipes/${id}`,
      type: "article",
      images: imageUrl ? [{ url: imageUrl, alt: recipe.title }] : undefined,
    },
  };
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  await connection();

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (!Number.isFinite(id)) notFound();

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: { orderBy: { order: "asc" } },
      steps: { orderBy: { stepNumber: "asc" } },
      notes: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!recipe) notFound();

  const imageUrl = getSafeImageUrl(recipe.imageUrl);
  const color = cultureColor[recipe.cultural] ?? "var(--ink)";

  const related = await prisma.recipe.findMany({
    where: { cultural: recipe.cultural, id: { not: recipe.id } },
    select: { id: true, title: true, holiday: true },
    take: 3,
  });

  const recipeStructuredData = getRecipeStructuredData({
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    cultural: recipe.cultural,
    holiday: recipe.holiday,
    category: recipe.category,
    prepTime: recipe.prepTime,
    imageUrl,
    createdAt: recipe.createdAt,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  });

  const breadcrumbStructuredData = getBreadcrumbStructuredData([
    { name: "Four Tables", path: "/" },
    { name: "All Recipes", path: "/recipes" },
    { name: recipe.cultural, path: `/recipes?cultural=${encodeURIComponent(recipe.cultural)}` },
    { name: recipe.title, path: `/recipes/${recipe.id}` },
  ]);

  return (
    <div className="portal-shell py-8 md:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(recipeStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbStructuredData) }}
      />
      <nav className="mb-6 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] fade-up">
        <Link href="/recipes" className="transition-colors hover:text-[var(--ink)]">
          All Recipes
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/recipes?cultural=${recipe.cultural}`}
          className="transition-colors hover:text-[var(--ink)]"
          style={{ color }}
        >
          {recipe.cultural}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink)]">{recipe.title}</span>
      </nav>

      <section className="grid items-start gap-6 fade-up fade-up-delay-1 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="section-card overflow-hidden rounded-[1.35rem] lg:sticky lg:top-24">
          <div className="relative h-[22rem] w-full bg-[var(--cream-dark)] md:h-[30rem] lg:h-[38rem]">
            {imageUrl ? (
              <RecipeImage
                src={imageUrl}
                alt={recipe.title}
                width={1200}
                height={1600}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                loading="eager"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center font-display text-8xl text-white"
                style={{ backgroundColor: color }}
              >
                {cultureInitial(recipe.cultural)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="recipe-detail-culture-pill rounded-full border border-white/60 bg-black/25 px-3 py-1.5 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.22em]"
                  style={{ borderColor: color }}
                >
                  {recipe.cultural}
                </span>
                <span className="recipe-detail-meta-pill rounded-full border border-white/25 bg-white/90 px-3 py-1.5 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink)]">
                  {recipe.holiday ?? recipe.category}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <header className="section-card rounded-[1.35rem] p-6 md:p-8 lg:p-9">
            <p className="eyebrow mb-4">Recipe Details</p>
            <h1 className="font-display text-4xl font-bold leading-[0.98] text-[var(--ink)] md:text-5xl">
              {recipe.title}
            </h1>

            {recipe.description && (
              <p className="mt-5 font-body text-base leading-8 text-[var(--ink-soft)] md:text-lg">
                {recipe.description}
              </p>
            )}

            <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-6 xl:grid-cols-4">
              {recipe.prepTime && (
                <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                  <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    Prep Time
                  </p>
                  <p className="mt-2 font-body text-sm text-[var(--ink)]">
                    {formatPrepTime(recipe.prepTime)}
                  </p>
                </div>
              )}
              <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Category
                </p>
                <p className="mt-2 font-body text-sm text-[var(--ink)]">{recipe.category}</p>
              </div>
              <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Ingredients
                </p>
                <p className="mt-2 font-body text-sm text-[var(--ink)]">
                  {recipe.ingredients.length}
                </p>
              </div>
              <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4">
                <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Steps
                </p>
                <p className="mt-2 font-body text-sm text-[var(--ink)]">{recipe.steps.length}</p>
              </div>
            </div>
          </header>

          <section className="section-card rounded-[1.35rem] p-6 fade-up fade-up-delay-2 md:p-8 lg:p-9">
            <p className="eyebrow mb-4">Recipe and Instructions</p>
            <RecipeDetail
              cultural={recipe.cultural}
              ingredients={recipe.ingredients}
              steps={recipe.steps}
              notes={recipe.notes}
            />
          </section>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-14 border-t border-[var(--border)] pt-8 fade-up">
          <p className="ornamental-rule mb-8" style={{ color }}>
            More {recipe.cultural} Recipes
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((relatedRecipe: RelatedRecipe) => (
              <Link
                key={relatedRecipe.id}
                href={`/recipes/${relatedRecipe.id}`}
                className="card-lift block rounded-[1.15rem] border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <span className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  {relatedRecipe.holiday ?? "Family recipe"}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-[var(--ink)]">
                  {relatedRecipe.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
