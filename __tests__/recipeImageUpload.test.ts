import { describe, expect, it } from "vitest";
import { imageFileToDataUrl } from "@/lib/recipeImageUpload";
import { validateRecipeInput } from "@/lib/recipeValidation";

describe("recipe image uploads", () => {
  it("accepts image data URLs as recipe image input", () => {
    const result = validateRecipeInput({
      title: "Family Salsa",
      description: "",
      cultural: "Mexican",
      holiday: "",
      category: "Appetizer",
      prepTime: "15",
      imageUrl: "data:image/png;base64,aGVsbG8=",
      ingredients: [{ amount: "4", unit: "", name: "tomatoes" }],
      steps: [{ instruction: "Chop and mix everything together." }],
      notes: [],
    });

    expect(result.valid).toBe(true);
  });

  it("rejects non-image uploads", async () => {
    const file = new File(["not an image"], "notes.txt", { type: "text/plain" });

    const result = await imageFileToDataUrl(file);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Upload must be a JPEG, PNG, WebP, or GIF image.");
    }
  });
});
