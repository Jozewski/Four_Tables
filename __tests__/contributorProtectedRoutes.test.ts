import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as assistRecipe } from "@/app/api/recipes/assist/route";
import { PATCH as archiveRecipe } from "@/app/api/recipes/[id]/archive/route";
import { DELETE as deleteRecipe, PUT as updateRecipe } from "@/app/api/recipes/[id]/route";
import { POST as createRecipe } from "@/app/api/recipes/route";
import { POST as uploadImage } from "@/app/api/recipes/images/route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recipe: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
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

async function expectContributorRequired(response: Response) {
  const json = await response.json();
  expect(response.status).toBe(401);
  expect(json).toEqual({ ok: false, errors: ["Contributor access is required."] });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("contributor route protection", () => {
  it("rejects public recipe creation before validation or database writes", async () => {
    const response = await createRecipe(
      new Request("http://localhost/api/recipes", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    await expectContributorRequired(response);
    expect(prismaMock.recipe.create).not.toHaveBeenCalled();
  });

  it("rejects public recipe updates before database writes", async () => {
    const response = await updateRecipe(
      new Request("http://localhost/api/recipes/42", {
        method: "PUT",
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ id: "42" }) },
    );

    await expectContributorRequired(response);
    expect(prismaMock.recipe.update).not.toHaveBeenCalled();
  });

  it("rejects public recipe archives before database writes", async () => {
    const response = await archiveRecipe(new Request("http://localhost/api/recipes/42/archive"), {
      params: Promise.resolve({ id: "42" }),
    });

    await expectContributorRequired(response);
    expect(prismaMock.recipe.update).not.toHaveBeenCalled();
  });

  it("rejects public hard deletes before database writes", async () => {
    const response = await deleteRecipe(new Request("http://localhost/api/recipes/42"), {
      params: Promise.resolve({ id: "42" }),
    });

    await expectContributorRequired(response);
    expect(prismaMock.recipe.delete).not.toHaveBeenCalled();
  });

  it("rejects public image uploads before parsing form data", async () => {
    const response = await uploadImage(
      new Request("http://localhost/api/recipes/images", { method: "POST" }),
    );

    await expectContributorRequired(response);
  });

  it("rejects public AI assist before checking OpenAI configuration", async () => {
    const response = await assistRecipe(
      new Request("http://localhost/api/recipes/assist", {
        method: "POST",
        body: JSON.stringify({ notes: "A long enough family recipe note." }),
      }),
    );

    await expectContributorRequired(response);
  });
});
