const { PrismaClient } = require("@prisma/client");
let PrismaPg;

try {
  ({ PrismaPg } = require("@prisma/adapter-pg"));
} catch {
  throw new Error(
    'Missing Prisma Postgres adapter. Run "npm install @prisma/adapter-pg" to use Prisma 7 with PostgreSQL.'
  );
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
  log: [
    "query",
    "info",
    "warn",
    "error",
  ],
});

module.exports = prisma;
