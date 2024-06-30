/*
  Warnings:

  - Added the required column `email` to the `InvoiceData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceData" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProductSale" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "originalPrice_cents" INTEGER NOT NULL,
    "currentPrice_cents" INTEGER NOT NULL,
    "isFeatured" BOOLEAN NOT NULL,

    CONSTRAINT "ProductSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseProduct" (
    "originalPrice_cents" INTEGER NOT NULL,
    "currentPrice_cents" INTEGER NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "PurchaseProduct_pkey" PRIMARY KEY ("purchaseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSale_productId_key" ON "ProductSale"("productId");

-- AddForeignKey
ALTER TABLE "ProductSale" ADD CONSTRAINT "ProductSale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseProduct" ADD CONSTRAINT "PurchaseProduct_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseProduct" ADD CONSTRAINT "PurchaseProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
