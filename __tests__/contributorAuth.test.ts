import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTRIBUTOR_COOKIE_NAME,
  createContributorSessionToken,
  getContributorSessionFromCookieHeader,
  verifyContributorSessionToken,
} from "@/lib/contributorAuth";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("contributor auth tokens", () => {
  it("verifies a signed contributor session token", () => {
    vi.stubEnv("AUTH_SECRET", "test-secret-with-enough-length");

    const token = createContributorSessionToken(1_800_000_000_000);
    const session = verifyContributorSessionToken(token, 1_800_000_000_000);

    expect(session).toEqual({ role: "contributor", issuedAt: 1_800_000_000_000 });
  });

  it("rejects tampered contributor session tokens", () => {
    vi.stubEnv("AUTH_SECRET", "test-secret-with-enough-length");

    const token = createContributorSessionToken(1_800_000_000_000);
    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;

    expect(verifyContributorSessionToken(tampered, 1_800_000_000_000)).toBeNull();
  });

  it("reads a contributor session from a cookie header", () => {
    vi.stubEnv("AUTH_SECRET", "test-secret-with-enough-length");
    const token = createContributorSessionToken(1_800_000_000_000);

    const session = getContributorSessionFromCookieHeader(
      `${CONTRIBUTOR_COOKIE_NAME}=${token}; other=value`,
      1_800_000_000_000,
    );

    expect(session?.role).toBe("contributor");
  });
});
