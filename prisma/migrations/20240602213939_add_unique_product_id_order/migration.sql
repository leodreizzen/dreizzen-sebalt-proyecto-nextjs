/*
  Warnings:

  - A unique constraint covering the columns `[productId,order]` on the table `ProductTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductTag_productId_order_key" ON "ProductTag"("productId", "order");
