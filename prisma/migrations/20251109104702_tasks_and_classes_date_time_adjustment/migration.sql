-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "timetable" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "dueDate" DROP NOT NULL;
