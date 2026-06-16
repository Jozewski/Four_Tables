import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE } from "@/app/api/recipes/[id]/route";
import { CONTRIBUTOR_COOKIE_NAME, createContributorSessionToken } from "@/lib/contributorAuth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recipe: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    ingredient: {
      deleteMany: vi.fn(),
    },
    step: {
      deleteMany: vi.fn(),
    },
    familyNote: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const prismaMock = vi.mocked(prisma);

function deleteRecipe(id: string) {
  const token = createContributorSessionToken(1_800_000_000_000);
  return DELETE(new Request("http://localhost/api/recipes/" + id, {
    headers: { cookie: `${CONTRIBUTOR_COOKIE_NAME}=${token}` },
  }), {
    params: Promise.resolve({ id }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("AUTH_SECRET", "test-secret-with-enough-length");
  prismaMock.$transaction.mockImplementation(async (operations) => Promise.all(operations));
});

describe("DELETE /api/recipes/[id]", () => {
  it("rejects invalid recipe ids", async () => {
    const response = await deleteRecipe("not-a-number");
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ ok: false, errors: ["Invalid recipe id."] });
    expect(prismaMock.recipe.delete).not.toHaveBeenCalled();
  });

  it("returns 404 when the recipe does not exist", async () => {
    prismaMock.recipe.findUnique.mockResolvedValue(null);

    const response = await deleteRecipe("42");
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json).toEqual({ ok: false, errors: ["Recipe not found."] });
    expect(prismaMock.recipe.delete).not.toHaveBeenCalled();
  });

  it("deletes related records before deleting the recipe", async () => {
    prismaMock.recipe.findUnique.mockResolvedValue({ id: 42 });
    prismaMock.ingredient.deleteMany.mockResolvedValue({ count: 2 });
    prismaMock.step.deleteMany.mockResolvedValue({ count: 3 });
    prismaMock.familyNote.deleteMany.mockResolvedValue({ count: 1 });
    prismaMock.recipe.delete.mockResolvedValue({ id: 42 });

    const response = await deleteRecipe("42");
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ ok: true, id: 42 });
    expect(prismaMock.ingredient.deleteMany).toHaveBeenCalledWith({ where: { recipeId: 42 } });
    expect(prismaMock.step.deleteMany).toHaveBeenCalledWith({ where: { recipeId: 42 } });
    expect(prismaMock.familyNote.deleteMany).toHaveBeenCalledWith({ where: { recipeId: 42 } });
    expect(prismaMock.recipe.delete).toHaveBeenCalledWith({ where: { id: 42 }, select: { id: true } });
    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
    expect(prismaMock.$transaction.mock.calls[0][0]).toHaveLength(4);
  });
});
