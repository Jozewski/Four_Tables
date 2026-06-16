import { beforeEach, describe, expect, it, vi } from "vitest";
import { PATCH } from "@/app/api/recipes/[id]/archive/route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recipe: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const prismaMock = vi.mocked(prisma);

function archiveRecipe(id: string) {
  return PATCH(new Request("http://localhost/api/recipes/" + id + "/archive"), {
    params: Promise.resolve({ id }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/recipes/[id]/archive", () => {
  it("rejects invalid recipe ids", async () => {
    const response = await archiveRecipe("not-a-number");
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ ok: false, errors: ["Invalid recipe id."] });
    expect(prismaMock.recipe.update).not.toHaveBeenCalled();
  });

  it("returns 404 when the recipe does not exist", async () => {
    prismaMock.recipe.findUnique.mockResolvedValue(null);

    const response = await archiveRecipe("42");
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toEqual({ ok: false, errors: ["Recipe not found."] });
    expect(prismaMock.recipe.update).not.toHaveBeenCalled();
  });

  it("archives the recipe without deleting related records", async () => {
    prismaMock.recipe.findUnique.mockResolvedValue({ id: 42 });
    prismaMock.recipe.update.mockResolvedValue({ id: 42, archivedAt: new Date("2026-06-15T00:00:00.000Z") });

    const response = await archiveRecipe("42");
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ ok: true, id: 42 });
    expect(prismaMock.recipe.update).toHaveBeenCalledWith({
      where: { id: 42 },
      data: { archivedAt: expect.any(Date) },
      select: { id: true, archivedAt: true },
    });
  });
});
