import { describe, expect, it } from "vitest";
import { canUseNextImage, getSafeImageUrl } from "@/lib/images";

describe("recipe image helpers", () => {
  it("allows next/image for configured recipe image hosts", () => {
    expect(canUseNextImage("https://www.seriouseats.com/example.jpg")).toBe(true);
  });

  it("does not use next/image for unknown user-submitted image hosts", () => {
    const url = "https://lolascocina.com/wp-content/uploads/2023/06/example.jpg";

    expect(getSafeImageUrl(url)).toBe(url);
    expect(canUseNextImage(url)).toBe(false);
  });
});
