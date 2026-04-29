import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

// Read database path from DATABASE_URL env var (e.g. file:./dev.db or file:/absolute/path/prod.db)
const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const dbRelPath = rawUrl.replace(/^file:/, "");
const sqliteFile = path.isAbsolute(dbRelPath)
  ? dbRelPath
  : path.join(process.cwd(), dbRelPath);

const adapter = new PrismaBetterSqlite3({
  url: `file:${sqliteFile.replace(/\\/g, "/")}` as `file:${string}`,
});

/** Höj när Prisma-schemat ändras så gammal cachad klient slängs (annars t.ex. saknad `cardImage` i validering). */
const PRISMA_SCHEMA_VER = 9;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  __prismaSchemaVer?: number;
};

function prismaClientLooksCurrent(client: PrismaClient | undefined): boolean {
  return (
    client != null &&
    typeof (client as { user?: { findUnique?: unknown } }).user?.findUnique === "function"
  );
}

let prisma: PrismaClient;
const cached = globalForPrisma.prisma;
const verOk = globalForPrisma.__prismaSchemaVer === PRISMA_SCHEMA_VER;
if (verOk && prismaClientLooksCurrent(cached)) {
  prisma = cached as PrismaClient;
} else {
  if (cached) void cached.$disconnect().catch(() => {});
  prisma = new PrismaClient({ adapter });
  globalForPrisma.prisma = prisma;
  globalForPrisma.__prismaSchemaVer = PRISMA_SCHEMA_VER;
}

export { prisma };
