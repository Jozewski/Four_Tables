import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function normalizeConnectionString(input: string): string {
  if (!input) return "";
  return input.replace(/sslmode=require/gi, "sslmode=verify-full");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: normalizeConnectionString(process.env.DATABASE_URL ?? "") }),
    log: process.env.PRISMA_LOG_QUERIES === "true" ? ["query"] : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
