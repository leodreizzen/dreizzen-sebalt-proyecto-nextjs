/*
  Warnings:

  - You are about to drop the `PurchaseProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PurchaseProduct" DROP CONSTRAINT "PurchaseProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseProduct" DROP CONSTRAINT "PurchaseProduct_purchaseId_fkey";

-- AlterTable
CREATE SEQUENCE invoicedata_id_seq;
ALTER TABLE "InvoiceData" ALTER COLUMN "id" SET DEFAULT nextval('invoicedata_id_seq');
ALTER SEQUENCE invoicedata_id_seq OWNED BY "InvoiceData"."id";

-- DropTable
DROP TABLE "PurchaseProduct";

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "originalPrice_cents" INTEGER NOT NULL,
    "currentPrice_cents" INTEGER NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("productId","purchaseId")
);

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
