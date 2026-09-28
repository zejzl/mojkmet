-- One review per user per farm: existing duplicates (if any) are collapsed to the most
-- recent, since there's no reasonable way to auto-merge rating/comment across duplicates.
DELETE FROM "reviews" a USING "reviews" b
  WHERE a."userId" = b."userId" AND a."farmId" = b."farmId" AND a."id" < b."id";

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_farmId_key" ON "reviews"("userId", "farmId");
