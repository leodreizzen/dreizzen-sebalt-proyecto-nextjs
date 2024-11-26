import {v2 as cloudinaryV2} from "cloudinary";

export function getImageUrl(folder: string, publicId: string): string {
    return cloudinaryV2.utils.url(`${folder}/${publicId}`, {resource_type: "image", cloud_name: cloudinaryCloudName})
}

export function getVideoUrl(publicId: string): string {
    return cloudinaryV2.utils.url(`${publicId}`, {resource_type: "video", cloud_name: cloudinaryCloudName})
}

if (!process.env.CLOUDINARY_API_SECRET)
    throw new Error("Missing CLOUDINARY_API_SECRET")
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set")
}
const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME


export function signUploadRequest(timestamp: number, folder: string, id: `${string}-${string}-${string}-${string}-${string}`, allowedFormats: string): string {
    const signature = cloudinaryV2.utils.api_sign_request({
        allowed_formats: allowedFormats,
        timestamp: timestamp,
        folder: folder,
        public_id: id
    }, CLOUDINARY_API_SECRET);
    return signature;
}