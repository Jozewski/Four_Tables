import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRecipeInput } from "@/lib/recipeValidation";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateRecipeInput(payload);

    if (!validation.valid) {
      return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
    }

    const input = validation.data;

    const created = await prisma.recipe.create({
      data: {
        title: input.title,
        description: input.description,
        cultural: input.cultural,
        holiday: input.holiday,
        category: input.category,
        prepTime: input.prepTime,
        imageUrl: input.imageUrl,
        ingredients: {
          create: input.ingredients.map((ingredient, idx) => ({
            order: idx + 1,
            amount: ingredient.amount,
            unit: ingredient.unit,
            name: ingredient.name,
          })),
        },
        steps: {
          create: input.steps.map((step, idx) => ({
            stepNumber: idx + 1,
            instruction: step.instruction,
          })),
        },
        notes: {
          create: input.notes.map((note) => ({
            author: note.author,
            content: note.content,
          })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Unable to create recipe right now."] },
      { status: 500 },
    );
  }
}
