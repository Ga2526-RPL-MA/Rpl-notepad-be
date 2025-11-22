/*
  Warnings:

  - You are about to drop the column `classId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `week` on the `Note` table. All the data in the column will be lost.
  - Added the required column `weekId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_classId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "classId",
DROP COLUMN "week",
ADD COLUMN     "userName" TEXT,
ADD COLUMN     "weekId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Week" (
    "id" SERIAL NOT NULL,
    "week" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
