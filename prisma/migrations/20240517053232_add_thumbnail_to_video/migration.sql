/*
  Warnings:

  - You are about to drop the column `description` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[thumbnailId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alt` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "description",
ADD COLUMN     "alt" TEXT NOT NULL,
ADD COLUMN     "thumbnailId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Video_thumbnailId_key" ON "Video"("thumbnailId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
