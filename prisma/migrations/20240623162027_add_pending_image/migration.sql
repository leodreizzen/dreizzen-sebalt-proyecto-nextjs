-- CreateEnum
CREATE TYPE "PendingMediaSource" AS ENUM ('CLOUDINARY');

-- CreateEnum
CREATE TYPE "PendingMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "PendingMedia" (
    "id" SERIAL NOT NULL,
    "source" "PendingMediaSource" NOT NULL,
    "type" "PendingMediaType" NOT NULL,
    "publicId" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingMedia_folder_publicId_key" ON "PendingMedia"("folder", "publicId");
