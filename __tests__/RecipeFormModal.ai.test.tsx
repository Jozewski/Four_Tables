import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import RecipeFormModal from "@/components/RecipeFormModal";
import { RecipeFormValues } from "@/lib/recipeValidation";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const aiValues: RecipeFormValues = {
  title: "Sunday Sauce",
  description: "A slow simmered tomato sauce.",
  cultural: "Italian",
  holiday: "",
  category: "Main",
  prepTime: "180",
  imageUrl: "",
  ingredients: [
    { amount: "2", unit: "tbsp", name: "olive oil" },
    { amount: "28", unit: "oz", name: "crushed tomatoes" },
  ],
  steps: [
    { instruction: "Warm the oil in a heavy pot." },
    { instruction: "Simmer tomatoes until thick." },
  ],
  notes: [{ author: "Grandma Louise", content: "Let it bubble slowly." }],
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("RecipeFormModal AI assist", () => {
  it("sends rough notes to AI assist and applies returned values to editable fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, values: aiValues }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<RecipeFormModal mode="create" triggerLabel="Add Recipe" />);

    fireEvent.click(screen.getByRole("button", { name: "Add Recipe" }));
    fireEvent.change(screen.getByLabelText("AI recipe notes"), {
      target: { value: "Grandma sauce with tomatoes, olive oil, and a slow simmer." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Draft with AI" }));

    await waitFor(() => {
      expect((screen.getByLabelText("Title") as HTMLInputElement).value).toBe("Sunday Sauce");
    });

    expect((screen.getByLabelText("Description") as HTMLTextAreaElement).value).toBe(
      "A slow simmered tomato sauce.",
    );
    expect((screen.getByLabelText("Prep Time (minutes)") as HTMLInputElement).value).toBe("180");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/recipes/assist",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("shows AI assist errors returned by the server", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        ok: false,
        errors: ["OpenAI error: Invalid model."],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<RecipeFormModal mode="create" triggerLabel="Add Recipe" />);

    fireEvent.click(screen.getByRole("button", { name: "Add Recipe" }));
    fireEvent.change(screen.getByLabelText("AI recipe notes"), {
      target: { value: "Grandma sauce with tomatoes, olive oil, and a slow simmer." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Draft with AI" }));

    expect(await screen.findByText("OpenAI error: Invalid model.")).toBeDefined();
    expect((screen.getByLabelText("AI recipe notes") as HTMLTextAreaElement).value).toBe(
      "Grandma sauce with tomatoes, olive oil, and a slow simmer.",
    );
  });

  it("uploads a family photo and applies the returned image value", async () => {
    const imageUrl = "data:image/png;base64,aGVsbG8=";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, imageUrl }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<RecipeFormModal mode="create" triggerLabel="Add Recipe" />);

    fireEvent.click(screen.getByRole("button", { name: "Add Recipe" }));
    fireEvent.change(screen.getByLabelText("Upload Family Photo"), {
      target: {
        files: [new File(["hello"], "family-table.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect((screen.getByLabelText("Image URL") as HTMLInputElement).value).toBe(imageUrl);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/recipes/images",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      }),
    );
  });
});
