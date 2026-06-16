"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContributorSignInForm() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contributor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });
      const json = (await response.json().catch(() => null)) as
        | { ok?: boolean; errors?: string[] }
        | null;

      if (!response.ok || !json?.ok) {
        setError(json?.errors?.length ? json.errors.join(" ") : "Unable to sign in.");
        return;
      }

      router.push("/contributor");
      router.refresh();
    } catch {
      setError("Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <label className="block space-y-2">
        <span className="font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          Invite Code
        </span>
        <input
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
          autoComplete="off"
          required
        />
      </label>

      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(217,106,39,0.25)] transition hover:brightness-110 disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
