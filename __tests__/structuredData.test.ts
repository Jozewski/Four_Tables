import { describe, expect, it, vi } from "vitest";
import { getCollectionPageStructuredData, getRecipeStructuredData } from "@/lib/structuredData";

vi.mock("@/lib/site", () => ({
  getSiteUrl: () => "https://jozewski.tech",
}));

describe("structured data", () => {
  it("keeps recipe list pages as an ItemList without partial Recipe entries", () => {
    const jsonLd = getCollectionPageStructuredData({
      name: "All Recipes",
      description: "Browse the full Four Tables recipe archive.",
      path: "/recipes",
      recipes: [
        {
          id: 12,
          title: "Grandma Louise's Homemade Pasta Dough",
          description: "Hand-rolled egg pasta made on the kitchen table.",
          cultural: "Italian",
          holiday: "Christmas",
          category: "Main",
          imageUrl: "https://jozewski.tech/images/pasta.jpg",
        },
      ],
    });

    expect(jsonLd["@type"]).toBe("CollectionPage");
    expect(jsonLd.mainEntity["@type"]).toBe("ItemList");
    expect(jsonLd.mainEntity.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        url: "https://jozewski.tech/recipes/12",
        name: "Grandma Louise's Homemade Pasta Dough",
      },
    ]);
  });

  it("publishes full Recipe fields on recipe detail pages", () => {
    const jsonLd = getRecipeStructuredData({
      id: 7,
      title: "Quick Tomato Bruschetta",
      description: "A quick appetizer with tomatoes, basil, and toasted bread.",
      cultural: "Italian",
      holiday: null,
      category: "Appetizer",
      prepTime: 15,
      imageUrl: "https://jozewski.tech/images/bruschetta.jpg",
      createdAt: new Date("2026-06-17T12:00:00.000Z"),
      ingredients: [
        { amount: "4", unit: null, name: "ripe Roma tomatoes" },
        { amount: "2", unit: "cloves", name: "garlic" },
      ],
      steps: [
        { stepNumber: 2, instruction: "Spoon the mixture over toasted bread." },
        { stepNumber: 1, instruction: "Toss the tomatoes, garlic, basil, oil, and salt." },
      ],
    });

    expect(jsonLd["@type"]).toBe("Recipe");
    expect(jsonLd.recipeIngredient).toEqual(["4 ripe Roma tomatoes", "2 cloves garlic"]);
    expect(jsonLd.recipeInstructions).toEqual([
      {
        "@type": "HowToStep",
        position: 1,
        text: "Toss the tomatoes, garlic, basil, oil, and salt.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        text: "Spoon the mixture over toasted bread.",
      },
    ]);
  });
});
