import { NextResponse } from "next/server";
import {
  clearContributorCookie,
  createContributorCookie,
  createContributorSessionToken,
} from "@/lib/contributorAuth";

function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const expectedInviteCode = process.env.CONTRIBUTOR_INVITE_CODE ?? "";
  const authSecret = process.env.AUTH_SECRET ?? "";

  if (!expectedInviteCode || !authSecret) {
    return NextResponse.json(
      { ok: false, errors: ["Contributor auth is not configured."] },
      { status: 500 },
    );
  }

  const payload = await request.json().catch(() => null);
  const inviteCode = toTrimmedString((payload as { inviteCode?: unknown } | null)?.inviteCode);

  if (inviteCode !== expectedInviteCode) {
    return NextResponse.json(
      { ok: false, errors: ["Invalid contributor invite code."] },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", createContributorCookie(createContributorSessionToken()));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", clearContributorCookie());
  return response;
}
