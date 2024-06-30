-- CreateEnum
CREATE TYPE "FuenteVideo" AS ENUM ('YOUTUBE', 'CLOUDINARY');

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio_centavos" INTEGER NOT NULL,
    "precioActual_centavos" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "descripcionBreve" TEXT,
    "fechaLanzamiento" TIMESTAMP(3) NOT NULL,
    "desarrolladorId" INTEGER NOT NULL,
    "editorId" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "fuente" "FuenteVideo" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "productoId" INTEGER,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imagen" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "productoId" INTEGER,

    CONSTRAINT "Imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductoToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_nombre_key" ON "Producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nombre_key" ON "Empresa"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nombre_key" ON "Tag"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Video_fuente_url_key" ON "Video"("fuente", "url");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductoToTag_AB_unique" ON "_ProductoToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductoToTag_B_index" ON "_ProductoToTag"("B");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "desarrollador_empresa_fk" FOREIGN KEY ("desarrolladorId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "editor_empresa_fk" FOREIGN KEY ("editorId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagen" ADD CONSTRAINT "Imagen_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoToTag" ADD CONSTRAINT "_ProductoToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoToTag" ADD CONSTRAINT "_ProductoToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
