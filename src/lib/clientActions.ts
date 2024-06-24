import {Tag} from "@prisma/client";

import {ArrayElement} from "@/lib/definitions";
import {
    addProduct,
    authorizeFeaturedTagImageUpload, authorizeProductImageUpload, ProductImageToSave,
    ProductToAddServer, ProductVideoToSave,
    saveFeaturedTags,
    SaveFeaturedTagsImage,
    UploadData
} from "@/lib/actions";
import axios from "axios";
import {ImageItem, NewImage, NewVideo, VideoItem} from "@/ui/admin/products/add/AddProductForm";

type FeaturedUploadImageResult = {
    success: true
    image: SaveFeaturedTagsImage
} | {
    success: false,
    error: string
}

type ProductUploadImageResult = {
    success: true
    image: ProductImageToSave
} | {
    success: false,
    error: string
}

type ProductUploadVideoResult = {
    success: true
    video: ProductVideoToSave
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
    const imagePromises = tags.map(tag => uploadFeaturedIfNew(tag.image))
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

export async function uploadFeaturedIfNew(image: AdminImage): Promise<FeaturedUploadImageResult>{
    if(!image.isNew)
        return {success: true, image:{isNew: false, id: image.id}}
    else
        return await uploadFeaturedTagImage(image)
}


export async function uploadFeaturedTagImage(image: AdminImage & {isNew: true}): Promise<FeaturedUploadImageResult> {
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

async function uploadImage(image: File, alt: string, uploadData: UploadData): Promise<FeaturedUploadImageResult & ({image: {
        isNew: true
    }} | {success:false})>{
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

export async function uploadProductImageIfNew(image: ImageItem): Promise<ProductUploadImageResult>{
    if(!image.isNew)
        return {success: true, image:{isNew: false, id: image.id}}
    else
        return uploadNewProductImage(image)
}

async function uploadNewProductImage(image: ImageItem & {isNew: true}): Promise<ProductUploadImageResult & ({success: false} | {image: {
        isNew: true
    }})>{
     if (image.type === "url")
        return {success: true, image: {isNew: true, url: image.url, alt: image.alt, type: "url"}}
    else
        return await uploadProductImage(image)
}

export async function uploadProductImage(image: ImageItem & {type: "file"} & {isNew: true}): Promise<ProductUploadImageResult & ({success: false} | {image: {
        isNew: true, type: "file" | "url"
    }})> {
const authorizeResult = await authorizeProductImageUpload();
    if (!authorizeResult.success)
        return {success: false, error: "Failed to authorize image upload: " + authorizeResult.error}
    try{
        const uploadRes = await uploadImage(image.file, image.alt, authorizeResult.uploadData)
        if(uploadRes.success)
            return {success: true, image: {isNew: true, publicId: uploadRes.image.publicId, folder: uploadRes.image.folder, alt: image.alt, type: "file"}}
        else
            return {success: false, error: uploadRes.error}
    }
    catch(e){
        console.error(e)
        return {success: false, error: "Failed to upload image"}
    }
}


interface ProductToAddClient extends Omit<ProductToAddServer, "images" | "videos" | "coverImage">{
    images: ImageItem[],
    videos: VideoItem[],
    coverImage: ImageItem
}

async function uploadProductVideoIfNew(video: VideoItem): Promise<ProductUploadVideoResult>{
    if(!video.isNew)
        return {success: true, video: {isNew: false, id: video.id}}
    else{
        const thumbnailUploadResult = await uploadNewProductImage(video.thumbnail)
        if(!thumbnailUploadResult.success)
            return {success: false, error: "Failed to upload thumbnail: " + thumbnailUploadResult.error}
        if(video.type === "url") {
            if(video.source === "YouTube"){
                const url = new URL(video.url)
                const videoId = url.searchParams.get("v")
                if(!videoId)
                    return {success: false, error: "Invalid youtube url"}
                return {success: true, video: {isNew: true, sourceId: videoId, source: "YouTube", alt: video.alt, thumbnail: thumbnailUploadResult.image}}
            }
            else if(video.source === "SteamCdn"){
                const url = new URL(video.url)
                const match = video.url.match(/\/apps\/(\d+)\//);
                if (!match || !match[1])
                    return {success: false, error: "Invalid steamcdn url"}
                const videoId = match[1]
                return {success: true, video: {isNew: true, sourceId: videoId, source: "SteamCdn", alt: video.alt, thumbnail: thumbnailUploadResult.image}}
            } else
                return {success: false, error: "Invalid video source"}
        }
        else
            return {success: false, error: "File video uploads are not supported at this time"}
    }


}

export async function createProductClient(product: ProductToAddClient & {videos: NewVideo[], images: NewImage[]}) {
    const imagePromises = product.images.map(image => uploadProductImageIfNew(image))
    const imageResults = (await Promise.all(imagePromises) )
    const failed = imageResults.filter(r => !r.success) as (ArrayElement<typeof imageResults> & { success: false })[]
    if (failed.length > 0) {
        const errors = failed.map(r => r.error).join("\n")
        return {success: false, error: "Failed to upload images. Errors: \n" + errors}
    }

    const videoPromises = product.videos.map(video => uploadProductVideoIfNew(video))
    const videoResults = await Promise.all(videoPromises)
    const videoFailed = videoResults.filter(r => !r.success) as (ArrayElement<typeof videoResults> & { success: false })[]
    if (videoFailed.length > 0) {
        const errors = videoFailed.map(r => r.error).join("\n")
        return {success: false, error: "Failed to upload videos. Errors: \n" + errors}
    }

    const images = (imageResults as (ArrayElement<typeof imageResults> & { success: true })[])
        .map(r => r.image)
    const videos = (videoResults as (ArrayElement<typeof videoResults> & { success: true })[]).map(r=>r.video)

    const coverImageUploadResult = await uploadProductImageIfNew(product.coverImage)
    if(!coverImageUploadResult.success)
        return {
            success: false,
            message: "Failed to upload cover image"
        }
    const coverImage = coverImageUploadResult.image
    // @ts-ignore
    return await addProduct({...product, images, videos, coverImage})
}