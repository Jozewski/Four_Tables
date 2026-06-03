export const CULTURES = ["Italian", "Dutch", "German", "Mexican"] as const;
export const HOLIDAYS = ["Christmas", "Easter", "Thanksgiving"] as const;
export const CATEGORIES = ["Main", "Dessert", "Bread", "Soup", "Side", "Seafood", "Appetizer"] as const;

export type RecipeFormIngredient = {
  amount: string;
  unit: string;
  name: string;
};

export type RecipeFormStep = {
  instruction: string;
};

export type RecipeFormNote = {
  author: string;
  content: string;
};

export type RecipeFormValues = {
  title: string;
  description: string;
  cultural: string;
  holiday: string;
  category: string;
  prepTime: string;
  imageUrl: string;
  ingredients: RecipeFormIngredient[];
  steps: RecipeFormStep[];
  notes: RecipeFormNote[];
};

export type NormalizedRecipeInput = {
  title: string;
  description: string | null;
  cultural: string;
  holiday: string | null;
  category: string;
  prepTime: number | null;
  imageUrl: string | null;
  ingredients: Array<{ amount: string; unit: string | null; name: string }>;
  steps: Array<{ instruction: string }>;
  notes: Array<{ author: string; content: string }>;
};

export const EMPTY_RECIPE_FORM: RecipeFormValues = {
  title: "",
  description: "",
  cultural: "",
  holiday: "",
  category: "",
  prepTime: "",
  imageUrl: "",
  ingredients: [{ amount: "", unit: "", name: "" }],
  steps: [{ instruction: "" }],
  notes: [],
};

function toTrimmedString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function toNullableString(value: unknown): string | null {
  const v = toTrimmedString(value);
  return v.length > 0 ? v : null;
}

export function normalizeRecipeInput(input: unknown): NormalizedRecipeInput {
  const obj = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  const rawIngredients = Array.isArray(obj.ingredients) ? obj.ingredients : [];
  const rawSteps = Array.isArray(obj.steps) ? obj.steps : [];
  const rawNotes = Array.isArray(obj.notes) ? obj.notes : [];

  const prepRaw = toTrimmedString(obj.prepTime);
  const prepParsed = prepRaw ? Number(prepRaw) : NaN;

  return {
    title: toTrimmedString(obj.title),
    description: toNullableString(obj.description),
    cultural: toTrimmedString(obj.cultural),
    holiday: toNullableString(obj.holiday),
    category: toTrimmedString(obj.category),
    prepTime: Number.isInteger(prepParsed) && prepParsed > 0 ? prepParsed : null,
    imageUrl: toNullableString(obj.imageUrl),
    ingredients: rawIngredients.map((ingredient) => {
      const i = ingredient as Record<string, unknown>;
      return {
        amount: toTrimmedString(i.amount),
        unit: toNullableString(i.unit),
        name: toTrimmedString(i.name),
      };
    }),
    steps: rawSteps.map((step) => {
      const s = step as Record<string, unknown>;
      return {
        instruction: toTrimmedString(s.instruction),
      };
    }),
    notes: rawNotes.map((note) => {
      const n = note as Record<string, unknown>;
      return {
        author: toTrimmedString(n.author),
        content: toTrimmedString(n.content),
      };
    }),
  };
}

export function validateRecipeInput(input: unknown): { valid: true; data: NormalizedRecipeInput } | { valid: false; errors: string[] } {
  const data = normalizeRecipeInput(input);
  const errors: string[] = [];

  if (data.title.length < 3 || data.title.length > 160) {
    errors.push("Title is required and must be between 3 and 160 characters.");
  }

  if (!CULTURES.includes(data.cultural as (typeof CULTURES)[number])) {
    errors.push("Cultural tradition is required and must be one of Italian, Dutch, German, or Mexican.");
  }

  if (!CATEGORIES.includes(data.category as (typeof CATEGORIES)[number])) {
    errors.push("Category is required and must match the supported recipe categories.");
  }

  if (data.holiday && !HOLIDAYS.includes(data.holiday as (typeof HOLIDAYS)[number])) {
    errors.push("Holiday must be Christmas, Easter, Thanksgiving, or empty.");
  }

  if (data.prepTime !== null && (data.prepTime < 1 || data.prepTime > 10080)) {
    errors.push("Prep time must be between 1 and 10080 minutes.");
  }

  if (data.imageUrl) {
    try {
      const parsed = new URL(data.imageUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.push("Image URL must use http or https.");
      }
    } catch {
      errors.push("Image URL must be a valid URL.");
    }
  }

  if (!data.ingredients.length) {
    errors.push("At least one ingredient is required.");
  }

  data.ingredients.forEach((ingredient, idx) => {
    if (!ingredient.amount) {
      errors.push(`Ingredient ${idx + 1}: amount is required.`);
    }
    if (!ingredient.name || ingredient.name.length > 180) {
      errors.push(`Ingredient ${idx + 1}: name is required and must be 180 characters or fewer.`);
    }
  });

  if (!data.steps.length) {
    errors.push("At least one step is required.");
  }

  data.steps.forEach((step, idx) => {
    if (!step.instruction || step.instruction.length < 4) {
      errors.push(`Step ${idx + 1}: instruction must be at least 4 characters.`);
    }
  });

  data.notes.forEach((note, idx) => {
    if (!note.author || !note.content) {
      errors.push(`Family note ${idx + 1}: both author and content are required.`);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data };
}
