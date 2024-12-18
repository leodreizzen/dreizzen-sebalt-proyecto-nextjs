import Prisma, {Image, PrismaClient, Video} from "@prisma/client";
import _prisma from "@/lib/prisma";
import {TransactionPrismaClient} from "@/lib/definitions";
import {
    deleteImageFromCloudinary,
    deleteImageFromCloudinaryByPublicId,
    deleteVideoFromCloudinary, deleteVideoFromCloudinaryByPublicId
} from "@/lib/cloudinary";
import {ActionResult} from "next/dist/server/app-render/types";

if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set")

export async function garbageCollectImage(image: Image, prisma: TransactionPrismaClient = _prisma): Promise<ActionResult> {
    const img = await prisma.image.findUnique({
        where: {
            id: image.id
        }, include: {
            inDescription: true,
            inProductCover: true,
            inVideoThumbnail: true,
            _count: {
                select: {
                    inFeaturedTag: true
                }
            }
        }
    })
    if (!img) {
        throw new Error("Image not found")
    }
    if (!img.inDescription && !img.inProductCover && !img.inVideoThumbnail && img._count.inFeaturedTag === 0) {
        if (img.url.startsWith(`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`)){
            const deleteRes = await deleteImageFromCloudinary(image)
            if (!deleteRes.success) {
                console.error("Error deleting image" + deleteRes.error)
                return {success: false, error: "Error deleting image" + deleteRes.error}
            }
        }
        await prisma.image.delete({
            where: {
                id: image.id
            }
        })
    }
    return {success: true}
}


export async function garbageCollectVideo(video: Video, prisma: TransactionPrismaClient = _prisma): Promise<ActionResult> {
    const vid = await prisma.video.findUnique({
        where: {
            id: video.id
        }, include: {
            product: true,
            thumbnail: true
        }
    })
    if (!vid) {
        return {success: false, error: "Video not found"}
    }
    if (!vid.product) {
        if (vid.source == "CLOUDINARY") {
            const deleteRes = await deleteVideoFromCloudinary(video)
            if (!deleteRes.success) {
                throw new Error("Error deleting image" + deleteRes.error)
            }
        }
        await prisma.video.delete({
            where: {
                id: video.id
            }
        })
        if (vid.thumbnail) {
            const thumbnailRes = await garbageCollectImage(vid.thumbnail, prisma)
            if (!thumbnailRes.success) {
                return {
                    success: false,
                    error: "Error deleting thumbnail" + thumbnailRes.error
                }
            }
        }
    }
    return {success: true}
}

export async function garbageCollectPending(){
    const prisma = _prisma;
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const pending = await prisma.pendingMedia.findMany({
        where: {
            timestamp: {
                lt: twoHoursAgo
            }
        }
    })
    console.log("Garbage collecting pending media: " + JSON.stringify(pending))
    for(const media of pending){
        let success = true;
        if(media.type == "IMAGE"){
            if(media.source == "CLOUDINARY"){
                const deleteRes = await deleteImageFromCloudinaryByPublicId(`${media.folder}/${media.publicId}`)
                if (!deleteRes.success){
                    success = false;
                    console.error("Error deleting image" + deleteRes.error)
                }
            }
        }else if(media.type == "VIDEO"){
            if(media.source == "CLOUDINARY"){
                const deleteRes = await deleteVideoFromCloudinaryByPublicId(`${media.folder}/${media.publicId}`)
                if (!deleteRes.success) {
                    success = false;
                    console.error("Error deleting video" + deleteRes.error)
                }
            }
        } else {
            console.error("Unknown media type: " + media.type)
            success = false;
        }
        if(success) {
            await prisma.pendingMedia.delete({
                where: {
                    id: media.id
                }
            })
        }
    }
}