/*
  Warnings:

  - You are about to drop the `_ProductToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductToTag" DROP CONSTRAINT "_ProductToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToTag" DROP CONSTRAINT "_ProductToTag_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "_ProductToTag";

-- CreateTable
CREATE TABLE "ProductTag" (
    "order" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("productId","tagId")
);

-- CreateTable
CREATE TABLE "FeaturedTag" (
    "order" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "FeaturedTag_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "FeaturedProduct" (
    "productId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FeaturedProduct_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "invoiceDataId" INTEGER NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceData" (
    "id" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "purchaseId" INTEGER NOT NULL,

    CONSTRAINT "InvoiceData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTag_order_key" ON "ProductTag"("order");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedTag_order_key" ON "FeaturedTag"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_invoiceDataId_key" ON "Purchase"("invoiceDataId");

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedTag" ADD CONSTRAINT "FeaturedTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedTag" ADD CONSTRAINT "FeaturedTag_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedProduct" ADD CONSTRAINT "FeaturedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_invoiceDataId_fkey" FOREIGN KEY ("invoiceDataId") REFERENCES "InvoiceData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
