/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Purchase" ALTER COLUMN "paymentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_paymentId_key" ON "Purchase"("paymentId");
