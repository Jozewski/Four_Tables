import { getSiteUrl } from "@/lib/site";

export function toJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function getWebsiteStructuredData() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Four Tables",
    url: siteUrl,
    description:
      "A family recipe collection shaped like a modern recipe portal, built around Italian, Dutch, German, and Mexican traditions.",
    publisher: {
      "@type": "Organization",
      name: "Four Tables",
      url: siteUrl,
    },
  };
}

type RecipeListItem = {
  id: number;
  title: string;
  description: string | null;
  cultural: string;
  holiday: string | null;
  category: string;
  imageUrl?: string | null;
};

type RecipeStructuredDataInput = {
  id: number;
  title: string;
  description: string | null;
  cultural: string;
  holiday: string | null;
  category: string;
  prepTime: number | null;
  imageUrl: string | null;
  createdAt: Date;
  ingredients: Array<{ amount: string; unit: string | null; name: string }>;
  steps: Array<{ stepNumber: number; instruction: string }>;
};

export function getCollectionPageStructuredData(input: {
  name: string;
  description: string;
  path: string;
  recipes: RecipeListItem[];
}) {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${input.path}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Four Tables",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.recipes.map((recipe, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/recipes/${recipe.id}`,
        name: recipe.title,
      })),
    },
  };
}

export function getRecipeStructuredData(recipe: RecipeStructuredDataInput) {
  const siteUrl = getSiteUrl();
  const recipeUrl = `${siteUrl}/recipes/${recipe.id}`;
  const keywords = [recipe.cultural, recipe.holiday, recipe.category].filter(Boolean).join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description:
      recipe.description ?? `${recipe.title} from the ${recipe.cultural} tradition on Four Tables.`,
    url: recipeUrl,
    image: recipe.imageUrl ? [recipe.imageUrl] : undefined,
    datePublished: recipe.createdAt.toISOString(),
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cultural,
    keywords,
    totalTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
    recipeIngredient: recipe.ingredients.map((ingredient) =>
      `${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ""} ${ingredient.name}`.trim(),
    ),
    recipeInstructions: recipe.steps
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .map((step) => ({
        "@type": "HowToStep",
        position: step.stepNumber,
        text: step.instruction,
      })),
    author: {
      "@type": "Organization",
      name: "Four Tables",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Four Tables",
      url: siteUrl,
    },
  };
}

export function getBreadcrumbStructuredData(items: Array<{ name: string; path: string }>) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
