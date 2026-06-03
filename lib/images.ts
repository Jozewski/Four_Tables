const blockedImageSubstrings = [
  "photo-1600398138360-766b7c2e38b0",
  "photo-1571167366136-b57e23b84584",
  "thegluttonlife.com/wp-content/uploads/2020/02/DSC_0130-1024x678.jpg",
];

export function getSafeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  if (url.includes("source.unsplash.com")) {
    return null;
  }

  if (blockedImageSubstrings.some((value) => url.includes(value))) {
    return null;
  }

  try {
    // Validate URL shape so Next/Image does not attempt invalid upstream fetches.
    new URL(url);
    return url;
  } catch {
    return null;
  }
}
