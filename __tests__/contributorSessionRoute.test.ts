import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contributor/session/route";
import { CONTRIBUTOR_COOKIE_NAME } from "@/lib/contributorAuth";

afterEach(() => {
  vi.unstubAllEnvs();
});

function signIn(inviteCode: string) {
  return POST(
    new Request("http://localhost/api/contributor/session", {
      method: "POST",
      body: JSON.stringify({ inviteCode }),
    }),
  );
}

describe("POST /api/contributor/session", () => {
  it("rejects invalid invite codes", async () => {
    vi.stubEnv("AUTH_SECRET", "test-secret-with-enough-length");
    vi.stubEnv("CONTRIBUTOR_INVITE_CODE", "family-only");

    const response = await signIn("wrong-code");
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ ok: false, errors: ["Invalid contributor invite code."] });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("sets a signed contributor cookie for a valid invite code", async () => {
    vi.stubEnv("AUTH_SECRET", "test-secret-with-enough-length");
    vi.stubEnv("CONTRIBUTOR_INVITE_CODE", "family-only");

    const response = await signIn("family-only");
    const json = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(setCookie).toContain(`${CONTRIBUTOR_COOKIE_NAME}=`);
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
  });
});
