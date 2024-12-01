import "server-only"
import {Image, Video} from "@prisma/client";
import {v2} from "cloudinary";
import {extractPublicId} from 'cloudinary-build-url'
if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    throw new Error("Missing CLOUDINARY_CLOUD_NAME")
if(!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
    throw new Error("Missing CLOUDINARY_API_KEY")
if(!process.env.CLOUDINARY_API_SECRET)
    throw new Error("Missing CLOUDINARY_API_SECRET")

v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteImageFromCloudinary(image: Image) {
    const publicId = extractPublicId(image.url).split('?')[0];
    return await deleteImageFromCloudinaryByPublicId(publicId);
}

export async function deleteImageFromCloudinaryByPublicId(publicId: string) {
    const res = await v2.uploader.destroy(publicId, {resource_type: "image", invalidate: true}) as {
        result: string
    }
    if (res.result === "not found") {
        console.warn("Image not found in cloudinary: " + publicId)
        return {
            success: true
        }
    } else if (res.result == "ok") {
        return {
            success: true
        }
    } else {
        console.error("Error deleting image" + res.result)
        return {
            success: false,
            error: res.result
        }
    }
}


export async function deleteVideoFromCloudinary(video: Video) {
    if (video.source === "CLOUDINARY") {
        const publicId = video.sourceId;
        return await deleteVideoFromCloudinaryByPublicId(publicId);
    }
    return {
        success: true
    }
}

export async function deleteVideoFromCloudinaryByPublicId(publicId: string) {
    const res = await v2.uploader.destroy(publicId, {resource_type: "video", invalidate: true}) as {
        result: string
    }
    if (res.result === "not found") {
        console.warn("Video not found in cloudinary: " + publicId)
        return {
            success: true
        }
    } else if (res.result == "ok") {
        return {
            success: true
        }
    } else {
        console.error("Error deleting Video" + res.result)
        return {
            success: false,
            error: res.result
        }
    }
}
