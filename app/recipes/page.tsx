import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";
import FilterBar from "@/components/FilterBar";
import { Suspense } from "react";

type SearchParams = {
  cultural?: string;
  holiday?: string;
};

async function RecipeGrid({ cultural, holiday }: SearchParams) {
  const where: Record<string, string> = {};
  if (cultural) where.cultural = cultural;
  if (holiday)  where.holiday  = holiday;

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy: [{ cultural: "asc" }, { holiday: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      cultural: true,
      holiday: true,
      prepTime: true,
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
      <p className="font-sans-alt text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)] mb-6">
        {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        {cultural ? ` · ${cultural}` : ""}
        {holiday  ? ` · ${holiday}`  : ""}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
}

export default function RecipesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { cultural, holiday } = searchParams;

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="mb-10 fade-up">
        <h1 className="font-display text-4xl font-bold text-[var(--ink)] mb-2">
          {cultural || holiday
            ? `${cultural ?? ""} ${holiday ?? ""} Recipes`.trim()
            : "All Recipes"}
        </h1>
        <p className="font-body text-sm italic text-[var(--ink-muted)]">
          Traditions from four tables, gathered in one place.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 pb-10 border-b border-[var(--border)] fade-up fade-up-delay-1">
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
        <RecipeGrid cultural={cultural} holiday={holiday} />
      </Suspense>
    </div>
  );
}
