import { describe, expect, it } from "vitest";
import { normalizeAiRecipeOutput } from "@/lib/aiRecipeAssist";

describe("AI recipe assist output normalization", () => {
  it("rejects malformed AI output with no ingredients", () => {
    const result = normalizeAiRecipeOutput({
      title: "Sunday Sauce",
      cultural: "Italian",
      category: "Main",
      steps: [{ instruction: "Simmer slowly." }],
    });

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain("At least one ingredient is required.");
    }
  });

  it("returns normalized form values for valid AI output", () => {
    const result = normalizeAiRecipeOutput({
      title: "  Sunday Sauce  ",
      description: "Long simmered tomato sauce.",
      cultural: "Italian",
      holiday: "",
      category: "Main",
      prepTime: 180,
      imageUrl: "",
      ingredients: [
        { amount: 2, unit: "tbsp", name: "olive oil" },
        { amount: "28", unit: "oz", name: "crushed tomatoes" },
      ],
      steps: [
        { instruction: "Warm the oil in a heavy pot." },
        { instruction: "Simmer tomatoes until thick." },
      ],
      notes: [{ author: "Grandma Louise", content: "Let it bubble slowly." }],
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.values).toEqual({
        title: "Sunday Sauce",
        description: "Long simmered tomato sauce.",
        cultural: "Italian",
        holiday: "",
        category: "Main",
        prepTime: "180",
        imageUrl: "",
        ingredients: [
          { amount: "2", unit: "tbsp", name: "olive oil" },
          { amount: "28", unit: "oz", name: "crushed tomatoes" },
        ],
        steps: [
          { instruction: "Warm the oil in a heavy pot." },
          { instruction: "Simmer tomatoes until thick." },
        ],
        notes: [{ author: "Grandma Louise", content: "Let it bubble slowly." }],
      });
    }
  });
});
