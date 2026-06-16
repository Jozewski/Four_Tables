import { NextResponse } from "next/server";
import { isContributorRequest, unauthorizedContributorResponse } from "@/lib/contributorAuth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isContributorRequest(request)) {
    return unauthorizedContributorResponse();
  }

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

    const archived = await prisma.recipe.update({
      where: { id },
      data: { archivedAt: new Date() },
      select: { id: true, archivedAt: true },
    });

    return NextResponse.json({ ok: true, id: archived.id });
  } catch {
    return NextResponse.json(
      { ok: false, errors: ["Unable to archive recipe right now."] },
      { status: 500 },
    );
  }
}
