import { describe, expect, it } from "vitest";
import { normalizeRecipeInput, validateRecipeInput } from "@/lib/recipeValidation";

describe("recipe input validation", () => {
  it("accepts a complete recipe with related ingredients, steps, and notes", () => {
    const result = validateRecipeInput({
      title: "Sunday Sauce",
      description: "A long-simmered family tomato sauce.",
      cultural: "Italian",
      holiday: "",
      category: "Main",
      prepTime: "180",
      imageUrl: "https://example.com/sauce.jpg",
      ingredients: [
        { amount: "2", unit: "tbsp", name: "olive oil" },
        { amount: "28", unit: "oz", name: "crushed tomatoes" },
      ],
      steps: [
        { instruction: "Warm the oil in a heavy pot." },
        { instruction: "Simmer tomatoes until thickened." },
      ],
      notes: [{ author: "Grandma Louise", content: "Let it bubble slowly." }],
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.prepTime).toBe(180);
      expect(result.data.holiday).toBeNull();
      expect(result.data.ingredients).toHaveLength(2);
      expect(result.data.steps).toHaveLength(2);
      expect(result.data.notes).toHaveLength(1);
    }
  });

  it("rejects missing required relationship data", () => {
    const result = validateRecipeInput({
      title: "Sauce",
      cultural: "Italian",
      category: "Main",
      ingredients: [],
      steps: [],
      notes: [],
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain("At least one ingredient is required.");
      expect(result.errors).toContain("At least one step is required.");
    }
  });

  it("normalizes empty optional fields to null", () => {
    const result = normalizeRecipeInput({
      title: "  Mole Negro Turkey  ",
      description: "  ",
      cultural: "Mexican",
      holiday: "",
      category: "Main",
      prepTime: "",
      imageUrl: "",
      ingredients: [{ amount: "1", unit: "", name: "turkey" }],
      steps: [{ instruction: "Roast until fully cooked." }],
      notes: [],
    });

    expect(result.title).toBe("Mole Negro Turkey");
    expect(result.description).toBeNull();
    expect(result.holiday).toBeNull();
    expect(result.prepTime).toBeNull();
    expect(result.imageUrl).toBeNull();
    expect(result.ingredients[0].unit).toBeNull();
  });
});
