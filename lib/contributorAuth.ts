import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const CONTRIBUTOR_COOKIE_NAME = "four-tables-contributor";
const maxAgeSeconds = 60 * 60 * 24 * 7;
const maxAgeMs = maxAgeSeconds * 1000;

export type ContributorSession = {
  role: "contributor";
  issuedAt: number;
};

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "";
}

function signPayload(payload: string): string {
  const secret = getAuthSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function signaturesMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createContributorSessionToken(issuedAt = Date.now()): string {
  const payload = base64UrlEncode(JSON.stringify({ role: "contributor", issuedAt }));
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifyContributorSessionToken(
  token: string | null | undefined,
  now = Date.now(),
): ContributorSession | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  if (!expectedSignature || !signaturesMatch(signature, expectedSignature)) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as Partial<ContributorSession>;
    if (parsed.role !== "contributor" || typeof parsed.issuedAt !== "number") return null;
    if (now - parsed.issuedAt > maxAgeMs) return null;
    return { role: parsed.role, issuedAt: parsed.issuedAt };
  } catch {
    return null;
  }
}

function parseCookieHeader(cookieHeader: string): Map<string, string> {
  const cookies = new Map<string, string>();

  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (!name || valueParts.length === 0) continue;
    cookies.set(name, valueParts.join("="));
  }

  return cookies;
}

export function getContributorSessionFromCookieHeader(
  cookieHeader: string | null | undefined,
  now = Date.now(),
): ContributorSession | null {
  if (!cookieHeader) return null;
  const token = parseCookieHeader(cookieHeader).get(CONTRIBUTOR_COOKIE_NAME);
  return verifyContributorSessionToken(token, now);
}

export function getContributorSessionFromRequest(request: Request): ContributorSession | null {
  return getContributorSessionFromCookieHeader(request.headers.get("cookie"));
}

export function isContributorRequest(request: Request): boolean {
  return Boolean(getContributorSessionFromRequest(request));
}

export function unauthorizedContributorResponse() {
  return NextResponse.json(
    { ok: false, errors: ["Contributor access is required."] },
    { status: 401 },
  );
}

export function createContributorCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "Secure" : "";
  return [
    `${CONTRIBUTOR_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    secure,
  ].filter(Boolean).join("; ");
}

export function clearContributorCookie(): string {
  return `${CONTRIBUTOR_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
