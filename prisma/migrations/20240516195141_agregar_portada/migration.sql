/*
  Warnings:

  - You are about to drop the column `productoId` on the `Imagen` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imagenPortadaId]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imagenPortadaId` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Imagen" DROP CONSTRAINT "Imagen_productoId_fkey";

-- AlterTable
ALTER TABLE "Imagen" DROP COLUMN "productoId",
ADD COLUMN     "productoDescripcionId" INTEGER;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "imagenPortadaId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Producto_imagenPortadaId_key" ON "Producto"("imagenPortadaId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "imagen_portada_fk" FOREIGN KEY ("imagenPortadaId") REFERENCES "Imagen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "producto_descripcion_fk" FOREIGN KEY ("productoDescripcionId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
