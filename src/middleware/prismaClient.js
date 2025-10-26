const { PrismaBetterSQLite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('../../generated/prisma');

const adapter = new PrismaBetterSQLite3({
  url: "file:./prisma/database.db"
});
const prisma = new PrismaClient({ adapter });

module.exports = prisma;