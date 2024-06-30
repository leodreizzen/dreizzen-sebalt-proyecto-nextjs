/*
  Warnings:

  - You are about to drop the column `nombre` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `productoDescripcionId` on the `Imagen` table. All the data in the column will be lost.
  - You are about to drop the column `desarrolladorId` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `editorId` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `fechaLanzamiento` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `imagenPortadaId` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `precioActual_centavos` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `precio_centavos` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `fuente` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `_ProductoToTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coverImageId]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[source,url]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImageId` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentProce_cents` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `developerId` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `launchDate` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_cents` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisherId` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inDropdown` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Imagen" DROP CONSTRAINT "producto_descripcion_fk";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "desarrollador_empresa_fk";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "editor_empresa_fk";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "imagen_portada_fk";

-- DropForeignKey
ALTER TABLE "_ProductoToTag" DROP CONSTRAINT "_ProductoToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductoToTag" DROP CONSTRAINT "_ProductoToTag_B_fkey";

-- DropIndex
DROP INDEX "Empresa_nombre_key";

-- DropIndex
DROP INDEX "Producto_imagenPortadaId_key";

-- DropIndex
DROP INDEX "Tag_nombre_key";

-- DropIndex
DROP INDEX "Video_fuente_url_key";

-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "nombre",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Imagen" DROP COLUMN "productoDescripcionId",
ADD COLUMN     "productDescriptionId" INTEGER;

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "desarrolladorId",
DROP COLUMN "editorId",
DROP COLUMN "fechaLanzamiento",
DROP COLUMN "imagenPortadaId",
DROP COLUMN "precioActual_centavos",
DROP COLUMN "precio_centavos",
ADD COLUMN     "coverImageId" INTEGER NOT NULL,
ADD COLUMN     "currentProce_cents" INTEGER NOT NULL,
ADD COLUMN     "developerId" INTEGER NOT NULL,
ADD COLUMN     "launchDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "price_cents" INTEGER NOT NULL,
ADD COLUMN     "publisherId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "nombre",
ADD COLUMN     "inDropdown" BOOLEAN NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "fuente",
ADD COLUMN     "source" "FuenteVideo" NOT NULL;

-- DropTable
DROP TABLE "_ProductoToTag";

-- CreateTable
CREATE TABLE "_ProductToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "_ProductToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_name_key" ON "Empresa"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_coverImageId_key" ON "Producto"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Video_source_url_key" ON "Video"("source", "url");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "cover_image_fk" FOREIGN KEY ("coverImageId") REFERENCES "Imagen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "developer_company_fk" FOREIGN KEY ("developerId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "publisher_company_fk" FOREIGN KEY ("publisherId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "producto_descripcion_fk" FOREIGN KEY ("productDescriptionId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
