-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "UserRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserRoom" ("id", "roomId", "userId") SELECT "id", "roomId", "userId" FROM "UserRoom";
DROP TABLE "UserRoom";
ALTER TABLE "new_UserRoom" RENAME TO "UserRoom";
CREATE INDEX "UserRoom_roomId_idx" ON "UserRoom"("roomId");
CREATE INDEX "UserRoom_userId_idx" ON "UserRoom"("userId");
CREATE UNIQUE INDEX "UserRoom_roomId_userId_key" ON "UserRoom"("roomId", "userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
