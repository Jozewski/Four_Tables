"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
};

function encodeMailtoSubject(title: string) {
  return encodeURIComponent(`${title} - Four Tables`);
}

function encodeMailtoBody(title: string, url: string) {
  return encodeURIComponent(`I wanted to share this recipe from Four Tables:\n\n${title}\n${url}`);
}

export default function RecipeShareActions({ title, description, url, imageUrl }: Props) {
  const [feedback, setFeedback] = useState("");

  const sharePayload = useMemo(
    () => ({
      title: `${title} - Four Tables`,
      text: description ?? "A family recipe from Four Tables.",
      url,
    }),
    [description, title, url]
  );

  const emailHref = useMemo(
    () => `mailto:?subject=${encodeMailtoSubject(title)}&body=${encodeMailtoBody(title, url)}`,
    [title, url]
  );

  const pinterestHref = useMemo(() => {
    const params = new URLSearchParams({
      url,
      description: `${title} - Four Tables`,
    });

    if (imageUrl) {
      params.set("media", imageUrl);
    }

    return `https://pinterest.com/pin/create/button/?${params.toString()}`;
  }, [imageUrl, title, url]);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setFeedback("Recipe link copied.");
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share(sharePayload);
      setFeedback("Share sheet opened.");
      return;
    }

    await copyLink();
  }

  return (
    <div className="mt-7 border-t border-[var(--border)] pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            void handleShare();
          }}
          className="recipe-share-primary inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] transition"
          aria-label="Share recipe"
        >
          Share
        </button>
        <button
          type="button"
          onClick={() => {
            void copyLink();
          }}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:border-[var(--ink-muted)] hover:bg-[var(--surface-soft)]"
          aria-label="Copy recipe link"
        >
          Copy Link
        </button>
        <a
          href={emailHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:border-[var(--ink-muted)] hover:bg-[var(--surface-soft)]"
          aria-label="Share by email"
        >
          Email
        </a>
        <a
          href={pinterestHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:border-[var(--ink-muted)] hover:bg-[var(--surface-soft)]"
          aria-label="Share on Pinterest"
        >
          Pinterest
        </a>
      </div>
      <p className="sr-only" aria-live="polite">
        {feedback}
      </p>
    </div>
  );
}
