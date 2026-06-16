import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002").replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const recipes = await prisma.recipe.findMany({
    where: { archivedAt: null },
    select: { id: true, createdAt: true },
    orderBy: { id: "asc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${siteUrl}/recipes/${recipe.id}`,
    lastModified: recipe.createdAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...recipeRoutes];
}
