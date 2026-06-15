import { NextResponse } from "next/server";
import { normalizeAiRecipeOutput } from "@/lib/aiRecipeAssist";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const recipeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "description",
    "cultural",
    "holiday",
    "category",
    "prepTime",
    "imageUrl",
    "ingredients",
    "steps",
    "notes",
  ],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    cultural: { type: "string", enum: ["Italian", "Dutch", "German", "Mexican"] },
    holiday: { type: "string", enum: ["", "Christmas", "Easter", "Thanksgiving"] },
    category: {
      type: "string",
      enum: ["Main", "Dessert", "Bread", "Soup", "Side", "Seafood", "Appetizer"],
    },
    prepTime: { type: "string" },
    imageUrl: { type: "string" },
    ingredients: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["amount", "unit", "name"],
        properties: {
          amount: { type: "string" },
          unit: { type: "string" },
          name: { type: "string" },
        },
      },
    },
    steps: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["instruction"],
        properties: {
          instruction: { type: "string" },
        },
      },
    },
    notes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["author", "content"],
        properties: {
          author: { type: "string" },
          content: { type: "string" },
        },
      },
    },
  },
};

function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getResponseText(payload: unknown): string {
  const data = payload as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ text?: unknown; type?: unknown }> }>;
  };

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return "";
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, errors: ["OPENAI_API_KEY is not configured."] },
      { status: 500 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Request body must be valid JSON."] },
      { status: 400 },
    );
  }

  const body = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const notes = toTrimmedString(body.notes);
  const currentRecipe = body.currentRecipe;

  if (notes.length < 10) {
    return NextResponse.json(
      { ok: false, errors: ["Add at least 10 characters of recipe notes before using AI assist."] },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You turn rough family recipe notes into clean structured recipe form data. Return only valid JSON matching the schema. Do not invent family stories, but you may infer reasonable cooking structure from the notes.",
          },
          {
            role: "user",
            content: JSON.stringify({
              notes,
              currentRecipe,
              supportedValues: {
                cultural: ["Italian", "Dutch", "German", "Mexican"],
                holiday: ["", "Christmas", "Easter", "Thanksgiving"],
                category: ["Main", "Dessert", "Bread", "Soup", "Side", "Seafood", "Appetizer"],
              },
            }),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "recipe_form_values",
            strict: true,
            schema: recipeJsonSchema,
          },
        },
      }),
    });

    const openAiJson = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, errors: ["OpenAI could not generate recipe fields right now."] },
        { status: 502 },
      );
    }

    const generatedText = getResponseText(openAiJson);
    const normalized = normalizeAiRecipeOutput(generatedText);

    if (!normalized.valid) {
      return NextResponse.json(
        { ok: false, errors: normalized.errors },
        { status: 422 },
      );
    }

    return NextResponse.json({ ok: true, values: normalized.values });
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Unable to use AI assist right now."] },
      { status: 500 },
    );
  }
}
