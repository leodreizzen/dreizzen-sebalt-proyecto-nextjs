import {Tag} from "@prisma/client";

import {ArrayElement} from "@/lib/definitions";
import {authorizeFeaturedTagImageUpload, saveFeaturedTags, SaveFeaturedTagsImage, UploadData} from "@/lib/actions";
import axios from "axios";

type UploadImageResult = {
    success: true
    image: SaveFeaturedTagsImage
} | {
    success: false,
    error: string
}

if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME){
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set")
}
const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

if(!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY){
    throw new Error("NEXT_PUBLIC_CLOUDINARY_API_KEY not set")
}
const cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY


export async function saveFeaturedTagsClient(tags: TagAndImage[]) {
    const imagePromises = tags.map(tag => uploadIfNew(tag.image))
    const imageResults = await Promise.all(imagePromises)
    const failed = imageResults.filter(r => !r.success) as (ArrayElement<typeof imageResults> & { success: false })[]
    if (failed.length > 0) {
        const errors = failed.map(r => r.error).join("\n")
        return {success: false, error: "Failed to upload images. Errors: \n" + errors}
    }
    const images = (imageResults as (ArrayElement<typeof imageResults> & { success: true })[])
        .map(r => r.image)

    return await saveFeaturedTags(tags.map((tag, i) => ({
        id: tag.tag.id,
        image: {
            ...images[i],
        }
    })))
}

export interface TagAndImage {
    tag: Tag,
    image: AdminImage
}

type AdminImage = {
    isNew: false
    id: number
    url: string
    alt: string
}  |
{
    isNew: true
    file: File
    alt: string,
    url: string
}

export async function uploadIfNew(image: AdminImage): Promise<UploadImageResult>{
    if(!image.isNew)
        return {success: true, image:{isNew: false, id: image.id}}
    else
        return await uploadFeaturedTagImage(image)
}


export async function uploadFeaturedTagImage(image: AdminImage & {isNew: true}): Promise<UploadImageResult> {
    const authorizeResult = await authorizeFeaturedTagImageUpload();
    if (!authorizeResult.success)
        return {success: false, error: "Failed to authorize image upload: " + authorizeResult.error}
    try{
        return await uploadImage(image.file, image.alt, authorizeResult.uploadData)
    }
    catch(e){
        console.error(e)
        return {success: false, error: "Failed to upload image"}
    }
}

async function uploadImage(image: File, alt: string, uploadData: UploadData): Promise<UploadImageResult>{
    const data = new FormData()
    data.append("api_key", cloudinaryApiKey)
    data.append("public_id", uploadData.id)
    data.append("timestamp", uploadData.timestamp.toString())
    data.append("signature", uploadData.signature)
    data.append("folder", uploadData.folder)
    data.append("file", image)
    try{
        await axios.post(`http://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, data)
        return {
            success: true,
            image: {
                alt: alt,
                isNew: true,
                folder: uploadData.folder,
                publicId: uploadData.id
            }
        }
    }catch (e){
        console.error(e)
        return {
            success: false,
            error: "Failed to upload image"
        }
    }
 }