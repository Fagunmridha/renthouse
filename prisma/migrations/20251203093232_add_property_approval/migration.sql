-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "familyType" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "rooms" INTEGER NOT NULL,
    "images" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Property" ("available", "createdAt", "description", "familyType", "featured", "id", "images", "location", "ownerEmail", "ownerId", "ownerName", "ownerPhone", "price", "rooms", "terms", "title") SELECT "available", "createdAt", "description", "familyType", "featured", "id", "images", "location", "ownerEmail", "ownerId", "ownerName", "ownerPhone", "price", "rooms", "terms", "title" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");
CREATE INDEX "Property_location_idx" ON "Property"("location");
CREATE INDEX "Property_familyType_idx" ON "Property"("familyType");
CREATE INDEX "Property_available_idx" ON "Property"("available");
CREATE INDEX "Property_approved_idx" ON "Property"("approved");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
