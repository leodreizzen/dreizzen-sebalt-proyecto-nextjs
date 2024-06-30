/*
  Warnings:

  - You are about to drop the column `developerId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `publisherId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "developer_company_fk";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "publisher_company_fk";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "developerId",
DROP COLUMN "publisherId";

-- CreateTable
CREATE TABLE "_developer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_publisher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_developer_AB_unique" ON "_developer"("A", "B");

-- CreateIndex
CREATE INDEX "_developer_B_index" ON "_developer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_publisher_AB_unique" ON "_publisher"("A", "B");

-- CreateIndex
CREATE INDEX "_publisher_B_index" ON "_publisher"("B");

-- AddForeignKey
ALTER TABLE "_developer" ADD CONSTRAINT "_developer_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_developer" ADD CONSTRAINT "_developer_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_publisher" ADD CONSTRAINT "_publisher_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_publisher" ADD CONSTRAINT "_publisher_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
