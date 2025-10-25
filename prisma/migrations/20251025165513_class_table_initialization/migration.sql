-- CreateTable
CREATE TABLE "Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lecturer" TEXT NOT NULL,
    "timetable" DATETIME NOT NULL,
    "room" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserClasses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    CONSTRAINT "UserClasses_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserClasses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserClasses_userId_classId_key" ON "UserClasses"("userId", "classId");
