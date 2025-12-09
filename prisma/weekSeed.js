const prisma = require('../src/middleware/prismaClient');

async function main() {
  const classes = await prisma.class.findMany({
    where: {
      id: {
        in: [2, 3, 4, 5, 6, 7, 8],
      },
    },
  });

  for (const cls of classes) {
    const existingWeeks = await prisma.week.count({
      where: { classId: cls.id },
    });

    if (existingWeeks > 0) {
      console.log(
        `SKIP: Week untuk class ${cls.id} (${cls.name}) sudah ada (${existingWeeks} minggu)`
      );
      continue; 
    }

    const weeks = Array.from({ length: 16 }, (_, i) => ({
      week: i + 1,
      classId: cls.id,
    }));

    await prisma.week.createMany({
      data: weeks,
    });

    console.log(
      `CREATE: Weeks untuk class ${cls.id} (${cls.name}) sudah dibuat (16 minggu)`
    );
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
