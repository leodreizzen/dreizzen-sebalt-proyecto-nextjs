/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `productoId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `Empresa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Imagen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Producto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `source` on the `Video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VideoSource" AS ENUM ('YOUTUBE', 'CLOUDINARY');

-- DropForeignKey
ALTER TABLE "Imagen" DROP CONSTRAINT "producto_descripcion_fk";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "cover_image_fk";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "developer_company_fk";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "publisher_company_fk";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_productoId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToTag" DROP CONSTRAINT "_ProductToTag_A_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "descripcion",
DROP COLUMN "productoId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "productId" INTEGER,
DROP COLUMN "source",
ADD COLUMN     "source" "VideoSource" NOT NULL;

-- DropTable
DROP TABLE "Empresa";

-- DropTable
DROP TABLE "Imagen";

-- DropTable
DROP TABLE "Producto";

-- DropEnum
DROP TYPE "FuenteVideo";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "originalPrice_cents" INTEGER NOT NULL,
    "currentPrice_cents" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "launchDate" TIMESTAMP(3) NOT NULL,
    "developerId" INTEGER NOT NULL,
    "publisherId" INTEGER NOT NULL,
    "coverImageId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "productDescriptionId" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_coverImageId_key" ON "Product"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Video_source_url_key" ON "Video"("source", "url");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "cover_image_fk" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "developer_company_fk" FOREIGN KEY ("developerId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "publisher_company_fk" FOREIGN KEY ("publisherId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "product_description_fk" FOREIGN KEY ("productDescriptionId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
