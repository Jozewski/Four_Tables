import { prisma } from "@/lib/prisma";
import RecipeInlineListItem from "@/components/RecipeInlineListItem";
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
    orderBy: [{ cultural: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      cultural: true,
      holiday: true,
      category: true,
      prepTime: true,
      imageUrl: true,
      ingredients: {
        orderBy: { order: "asc" },
        select: { id: true, order: true, amount: true, unit: true, name: true },
      },
      steps: {
        orderBy: { stepNumber: "asc" },
        select: { id: true, stepNumber: true, instruction: true },
      },
      notes: {
        orderBy: { createdAt: "asc" },
        select: { id: true, author: true, content: true },
      },
    },
  });

  if (recipes.length === 0) {
    return (
      <div className="section-card rounded-[1.75rem] text-center py-20 px-6">
        <p className="font-display text-3xl text-[var(--ink-soft)]">
          No recipes found for that combination.
        </p>
        <p className="font-body text-sm text-[var(--ink-muted)] mt-3 leading-7">
          Try clearing one of the filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="font-sans-alt text-[11px] font-extrabold tracking-[0.18em] uppercase text-[var(--ink-muted)] mb-8 text-center">
        {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        {cultural ? ` · ${cultural}` : ""}
        {holiday  ? ` · ${holiday}`  : ""}
        {category ? ` · ${category}` : ""}
      </p>
      <div className="space-y-6">
        {recipes.map((recipe) => (
          <RecipeInlineListItem key={recipe.id} recipe={recipe} />
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
    <div className="portal-shell py-10 md:py-14">
      <div className="soft-panel rounded-[2rem] p-8 md:p-10 mb-10 fade-up text-center">
        <p className="eyebrow justify-center mb-4">Browse recipes</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--ink)] mb-3">
          {cultural || holiday || category
            ? `${cultural ?? ""} ${holiday ?? ""} ${category ?? ""} Recipes`.trim()
            : "All Recipes"}
        </h1>
        <p className="font-body text-sm md:text-base text-[var(--ink-soft)] max-w-3xl mx-auto leading-7">
          Move through the full collection by family tradition, holiday, or course. This page should feel practical first: find the dish, open it, cook it.
        </p>
      </div>

      <div className="mb-12 fade-up fade-up-delay-1 max-w-5xl mx-auto">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="section-card rounded-[1.75rem] text-center py-20">
            <p className="font-sans-alt text-xs font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)] animate-pulse">
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
