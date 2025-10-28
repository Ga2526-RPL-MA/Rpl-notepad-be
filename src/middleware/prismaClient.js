const { PrismaBetterSQLite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('../../generated/prisma');

const adapter = new PrismaBetterSQLite3({
  url: process.env.DATABASE_PRISMA_URL
});
const prisma = new PrismaClient({ adapter });

module.exports = prisma;