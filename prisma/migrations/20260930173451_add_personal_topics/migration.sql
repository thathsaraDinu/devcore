/*
  Warnings:

  - A unique constraint covering the columns `[createdByUserId,slug]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_topicId_fkey";

-- DropIndex
DROP INDEX "Topic_slug_key";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "topicId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "createdByUserId" TEXT;

-- CreateIndex
CREATE INDEX "Topic_createdByUserId_idx" ON "Topic"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_createdByUserId_slug_key" ON "Topic"("createdByUserId", "slug");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
