/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_idempotencyKey_key" ON "Purchase"("idempotencyKey");
