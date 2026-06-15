import {
  RecipeFormValues,
  validateRecipeInput,
} from "@/lib/recipeValidation";

type AiRecipeAssistSuccess = {
  valid: true;
  values: RecipeFormValues;
};

type AiRecipeAssistFailure = {
  valid: false;
  errors: string[];
};

export type AiRecipeAssistResult = AiRecipeAssistSuccess | AiRecipeAssistFailure;

function toFormString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function objectFromUnknown(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function normalizeAiRecipeOutput(rawOutput: unknown): AiRecipeAssistResult {
  const parsed = parseMaybeJson(rawOutput);
  const root = objectFromUnknown(parsed);
  const source = objectFromUnknown(root.recipe ?? root);

  const rawIngredients = Array.isArray(source.ingredients) ? source.ingredients : [];
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];
  const rawNotes = Array.isArray(source.notes) ? source.notes : [];

  const values: RecipeFormValues = {
    title: toFormString(source.title),
    description: toFormString(source.description),
    cultural: toFormString(source.cultural),
    holiday: toFormString(source.holiday),
    category: toFormString(source.category),
    prepTime: toFormString(source.prepTime),
    imageUrl: toFormString(source.imageUrl),
    ingredients: rawIngredients.map((ingredient) => {
      const i = objectFromUnknown(ingredient);
      return {
        amount: toFormString(i.amount),
        unit: toFormString(i.unit),
        name: toFormString(i.name),
      };
    }),
    steps: rawSteps.map((step) => {
      if (typeof step === "string") {
        return { instruction: step.trim() };
      }

      const s = objectFromUnknown(step);
      return {
        instruction: toFormString(s.instruction),
      };
    }),
    notes: rawNotes.map((note) => {
      const n = objectFromUnknown(note);
      return {
        author: toFormString(n.author),
        content: toFormString(n.content),
      };
    }),
  };

  const validation = validateRecipeInput(values);
  if (!validation.valid) {
    return { valid: false, errors: validation.errors };
  }

  return {
    valid: true,
    values: {
      ...values,
      title: validation.data.title,
      description: validation.data.description ?? "",
      holiday: validation.data.holiday ?? "",
      prepTime: validation.data.prepTime === null ? "" : String(validation.data.prepTime),
      imageUrl: validation.data.imageUrl ?? "",
      ingredients: validation.data.ingredients.map((ingredient) => ({
        amount: ingredient.amount,
        unit: ingredient.unit ?? "",
        name: ingredient.name,
      })),
      steps: validation.data.steps.map((step) => ({
        instruction: step.instruction,
      })),
      notes: validation.data.notes.map((note) => ({
        author: note.author,
        content: note.content,
      })),
    },
  };
}
