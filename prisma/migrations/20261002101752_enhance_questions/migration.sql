-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('OPEN', 'RESOLVED');

-- DropIndex
DROP INDEX "Question_userId_topicId_idx";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "status" "QuestionStatus" NOT NULL DEFAULT 'OPEN';

-- CreateTable
CREATE TABLE "QuestionNote" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionNote_questionId_idx" ON "QuestionNote"("questionId");

-- CreateIndex
CREATE INDEX "QuestionNote_noteId_idx" ON "QuestionNote"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionNote_questionId_noteId_key" ON "QuestionNote"("questionId", "noteId");

-- CreateIndex
CREATE INDEX "Question_userId_status_idx" ON "Question"("userId", "status");

-- AddForeignKey
ALTER TABLE "QuestionNote" ADD CONSTRAINT "QuestionNote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionNote" ADD CONSTRAINT "QuestionNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
