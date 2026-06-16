const DEFAULT_PRODUCTION_SITE_URL = "https://jozewski.tech";
const DEFAULT_LOCAL_SITE_URL = "http://localhost:3002";

function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function getSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredSiteUrl) {
    return normalizeSiteUrl(configuredSiteUrl);
  }

  if (process.env.VERCEL_ENV === "production") {
    return DEFAULT_PRODUCTION_SITE_URL;
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

  if (vercelUrl) {
    return normalizeSiteUrl(
      vercelUrl.startsWith("http://") || vercelUrl.startsWith("https://")
        ? vercelUrl
        : `https://${vercelUrl}`
    );
  }

  return DEFAULT_LOCAL_SITE_URL;
}
