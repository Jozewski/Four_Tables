const blockedImageSubstrings = [
  "photo-1600398138360-766b7c2e38b0",
  "photo-1571167366136-b57e23b84584",
  "thegluttonlife.com/wp-content/uploads/2020/02/DSC_0130-1024x678.jpg",
];

const nextImageHostnames = new Set([
  "images.unsplash.com",
  "source.unsplash.com",
  "www.thegluttonlife.com",
  "www.internationalcuisine.com",
  "www.chefspencil.com",
  "ourgabledhome.com",
  "mydinner.co.uk",
  "www.daringgourmet.com",
  "platedcravings.com",
  "mexicanappetizersandmore.com",
  "www.isabeleats.com",
  "www.royalresorts.com",
  "www.laylita.com",
  "www.holajalapeno.com",
  "www.italiankitchenconfessions.com",
  "www.themediterraneandish.com",
  "www.thespruceeats.com",
  "lechicpatissier.com",
  "muybuenoblog.com",
  "tastesbetterfromscratch.com",
  "www.seriouseats.com",
]);

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

export function canUseNextImage(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && nextImageHostnames.has(parsed.hostname);
  } catch {
    return false;
  }
}
