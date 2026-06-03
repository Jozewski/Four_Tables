import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRecipeInput } from "@/lib/recipeValidation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, errors: ["Invalid recipe id."] }, { status: 400 });
    }

    const existing = await prisma.recipe.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ ok: false, errors: ["Recipe not found."] }, { status: 404 });
    }

    const payload = await request.json();
    const validation = validateRecipeInput(payload);

    if (!validation.valid) {
      return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
    }

    const input = validation.data;

    await prisma.recipe.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        cultural: input.cultural,
        holiday: input.holiday,
        category: input.category,
        prepTime: input.prepTime,
        imageUrl: input.imageUrl,
        ingredients: {
          deleteMany: {},
          create: input.ingredients.map((ingredient, idx) => ({
            order: idx + 1,
            amount: ingredient.amount,
            unit: ingredient.unit,
            name: ingredient.name,
          })),
        },
        steps: {
          deleteMany: {},
          create: input.steps.map((step, idx) => ({
            stepNumber: idx + 1,
            instruction: step.instruction,
          })),
        },
        notes: {
          deleteMany: {},
          create: input.notes.map((note) => ({
            author: note.author,
            content: note.content,
          })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Unable to update recipe right now."] },
      { status: 500 },
    );
  }
}
