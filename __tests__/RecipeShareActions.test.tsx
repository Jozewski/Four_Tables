import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RecipeShareActions from "@/components/RecipeShareActions";

const shareMock = vi.fn();
const writeTextMock = vi.fn();

describe("RecipeShareActions", () => {
  beforeEach(() => {
    shareMock.mockReset();
    writeTextMock.mockReset();

    Object.defineProperty(globalThis.navigator, "share", {
      configurable: true,
      value: shareMock,
    });

    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("uses the native share sheet when available", async () => {
    shareMock.mockResolvedValue(undefined);

    render(
      <RecipeShareActions
        title="Grandma Louise's Homemade Pasta Dough"
        description="Hand-rolled egg pasta made on the kitchen table."
        url="https://jozewski.tech/recipes/12"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Share recipe" }));

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledWith({
        title: "Grandma Louise's Homemade Pasta Dough - Four Tables",
        text: "Hand-rolled egg pasta made on the kitchen table.",
        url: "https://jozewski.tech/recipes/12",
      });
    });
  });

  it("copies the recipe link and confirms the action", async () => {
    writeTextMock.mockResolvedValue(undefined);

    render(
      <RecipeShareActions
        title="Grandma Louise's Homemade Pasta Dough"
        description="Hand-rolled egg pasta made on the kitchen table."
        url="https://jozewski.tech/recipes/12"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy recipe link" }));

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("https://jozewski.tech/recipes/12");
    });

    expect(screen.getByText("Recipe link copied.")).toBeDefined();
  });

  it("falls back to copying the link when native sharing is unavailable", async () => {
    Object.defineProperty(globalThis.navigator, "share", {
      configurable: true,
      value: undefined,
    });
    writeTextMock.mockResolvedValue(undefined);

    render(
      <RecipeShareActions
        title="Grandma Louise's Homemade Pasta Dough"
        description="Hand-rolled egg pasta made on the kitchen table."
        url="https://jozewski.tech/recipes/12"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Share recipe" }));

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("https://jozewski.tech/recipes/12");
    });

    expect(screen.getByText("Recipe link copied.")).toBeDefined();
  });

  it("renders outbound email and Pinterest share links", () => {
    render(
      <RecipeShareActions
        title="Grandma Louise's Homemade Pasta Dough"
        description="Hand-rolled egg pasta made on the kitchen table."
        url="https://jozewski.tech/recipes/12"
      />
    );

    expect(screen.getByRole("link", { name: "Share by email" }).getAttribute("href")).toContain(
      "mailto:"
    );
    expect(screen.getByRole("link", { name: "Share on Pinterest" }).getAttribute("href")).toContain(
      "https://pinterest.com/pin/create/button/"
    );
  });
});
