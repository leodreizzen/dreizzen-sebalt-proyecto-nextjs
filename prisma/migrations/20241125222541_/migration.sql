/*
  Warnings:

  - You are about to drop the column `currentPrice_cents` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice_cents` on the `ProductSale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "currentPrice_cents";

-- AlterTable
ALTER TABLE "ProductSale" DROP COLUMN "originalPrice_cents";
