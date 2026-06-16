import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import FilterBar from "@/components/FilterBar";
import RecipeFormModal from "@/components/RecipeFormModal";
import RecipeInlineListItem from "@/components/RecipeInlineListItem";
import { CONTRIBUTOR_COOKIE_NAME, verifyContributorSessionToken } from "@/lib/contributorAuth";
import { prisma } from "@/lib/prisma";

type SearchParams = {
  cultural?: string;
  holiday?: string;
  category?: string;
  status?: string;
};

async function hasContributorAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONTRIBUTOR_COOKIE_NAME)?.value;
  return Boolean(verifyContributorSessionToken(token));
}

async function RecipeGrid({
  canContribute,
  cultural,
  holiday,
  category,
  status,
}: SearchParams & { canContribute: boolean }) {
  const showingArchived = status === "archived";
  const where: Record<string, unknown> = {
    archivedAt: showingArchived ? { not: null } : null,
  };
  if (cultural) where.cultural = cultural;
  if (holiday) where.holiday = holiday;
  if (category) where.category = category;

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy: [{ title: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      cultural: true,
      holiday: true,
      category: true,
      prepTime: true,
      imageUrl: true,
      archivedAt: true,
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
      <div className="section-card rounded-[1.25rem] px-6 py-16 text-center">
        <p className="font-display text-3xl text-[var(--ink-soft)]">
          No recipes found for that combination.
        </p>
        <p className="mt-3 font-body text-sm leading-7 text-[var(--ink-muted)]">
        Clear a filter or add a new family recipe.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-center font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        {cultural ? ` / ${cultural}` : ""}
        {holiday ? ` / ${holiday}` : ""}
        {category ? ` / ${category}` : ""}
        {showingArchived ? " / archived" : ""}
      </p>
      <div className="space-y-5">
        {recipes.map((recipe) => (
          <RecipeInlineListItem key={recipe.id} recipe={recipe} canContribute={canContribute} />
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
  const { cultural, holiday, category, status } = resolvedSearchParams;
  const showingArchived = status === "archived";
  const canContribute = await hasContributorAccess();

  return (
    <div className="portal-shell py-8 md:py-10">
      <div className="recipe-index-hero mb-8">
        <div>
          <p className="eyebrow mb-3">Recipe index</p>
          <h1 className="font-display text-4xl font-bold leading-tight text-[var(--ink)] md:text-5xl">
            {cultural || holiday || category
              ? `${cultural ?? ""} ${holiday ?? ""} ${category ?? ""} Recipes`.trim()
              : showingArchived
                ? "Archived Recipes"
                : "All Recipes"}
          </h1>
          <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-[var(--ink-soft)] md:text-base">
            {showingArchived
              ? "Review recipes that were removed from the main browsing list."
              : "Search the family archive by tradition, holiday, or course. Open a recipe for the full cooking view, or add a new one from family notes."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:justify-end">
          {canContribute && (
            <Link
              href={showingArchived ? "/recipes" : "/recipes?status=archived"}
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.14em] text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
            >
              {showingArchived ? "All Recipes" : "Archived"}
            </Link>
          )}
          {canContribute ? (
            <RecipeFormModal
              mode="create"
              triggerLabel="Add Recipe"
              triggerClassName="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(217,106,39,0.25)]"
            />
          ) : (
            <Link
              href="/contributor"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(217,106,39,0.25)]"
            >
              Contributor Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto mb-10 max-w-5xl fade-up fade-up-delay-1">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="section-card rounded-[1.25rem] py-16 text-center">
            <p className="animate-pulse font-sans-alt text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              Loading recipes...
            </p>
          </div>
        }
      >
        <RecipeGrid
          canContribute={canContribute}
          cultural={cultural}
          holiday={holiday}
          category={category}
          status={status}
        />
      </Suspense>
    </div>
  );
}
