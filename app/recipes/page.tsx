import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";
import FilterBar from "@/components/FilterBar";
import { Suspense } from "react";

type SearchParams = {
  cultural?: string;
  holiday?: string;
  category?: string;
};

async function RecipeGrid({ cultural, holiday, category }: SearchParams) {
  const where: Record<string, string> = {};
  if (cultural) where.cultural = cultural;
  if (holiday)  where.holiday  = holiday;
  if (category) where.category = category;

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy: [{ cultural: "asc" }, { holiday: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      cultural: true,
      holiday: true,
      category: true,
      prepTime: true,
      imageUrl: true,
      _count: { select: { ingredients: true, steps: true } },
    },
  });

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl italic text-[var(--ink-soft)]">
          No recipes found for that combination.
        </p>
        <p className="font-body text-sm text-[var(--ink-muted)] mt-2">
          Try clearing one of the filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="font-sans-alt text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)] mb-8 text-center">
        {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        {cultural ? ` · ${cultural}` : ""}
        {holiday  ? ` · ${holiday}`  : ""}
        {category ? ` · ${category}` : ""}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { cultural, holiday, category } = resolvedSearchParams;

  return (
    <div className="max-w-5xl mx-auto px-8 md:px-10 py-14">
      {/* Header */}
      <div className="mb-12 fade-up text-center">
        <h1 className="font-display text-4xl font-bold text-[var(--ink)] mb-2">
          {cultural || holiday || category
            ? `${cultural ?? ""} ${holiday ?? ""} ${category ?? ""} Recipes`.trim()
            : "All Recipes"}
        </h1>
        <p className="font-body text-sm italic text-[var(--ink-muted)] max-w-2xl mx-auto">
          Traditions from four tables, gathered in one place.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-12 pb-10 border-b border-[var(--border)] fade-up fade-up-delay-1 max-w-4xl mx-auto">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      {/* Recipe grid */}
      <Suspense
        fallback={
          <div className="text-center py-20">
            <p className="font-sans-alt text-xs tracking-[0.2em] uppercase text-[var(--ink-muted)] animate-pulse">
              Loading recipes…
            </p>
          </div>
        }
      >
        <RecipeGrid cultural={cultural} holiday={holiday} category={category} />
      </Suspense>
    </div>
  );
}
