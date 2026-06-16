import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { PATCH } from "@/app/api/recipes/[id]/archive/route";
import { CONTRIBUTOR_COOKIE_NAME, createContributorSessionToken } from "@/lib/contributorAuth";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recipe: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const prismaMock = prisma as unknown as {
  recipe: {
    findUnique: Mock;
    update: Mock;
  };
};

function archiveRecipe(id: string) {
  const token = createContributorSessionToken(1_800_000_000_000);
  return PATCH(new Request("http://localhost/api/recipes/" + id + "/archive", {
    headers: { cookie: `${CONTRIBUTOR_COOKIE_NAME}=${token}` },
  }), {
    params: Promise.resolve({ id }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("AUTH_SECRET", "test-secret-with-enough-length");
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
