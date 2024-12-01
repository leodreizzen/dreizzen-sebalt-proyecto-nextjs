import {ProductImageToSave, ProductVideoToSave, VideoToSaveModel} from "@/lib/actions/products/models";
import {getImageUrl, getVideoUrl} from "@/lib/cloudinary-utils";
import {VideoSource} from "@prisma/client";
import {z} from "zod";
import getCloudinary from "@/ui/cloudinary";
import {PRODUCT_VIDEO_FOLDER} from "@/lib/config";

export function getProductImageUrl(coverImage: ProductImageToSave & { isNew: true }): string {
    if (coverImage.type === "url")
        return coverImage.url
    else
        return getImageUrl(coverImage.folder, coverImage.publicId)

}

export function mapVideoSource(video: ProductVideoToSave & { isNew: true }): VideoSource {
    if (video.source === "SteamCdn")
        return VideoSource.STEAMCDN
    else if (video.source === "YouTube")
        return VideoSource.YOUTUBE
    else if (video.source === "Cloudinary")
        return VideoSource.CLOUDINARY
    else throw new Error("Invalid video source")
}

export async function imageExists(folder: string, publicId: string): Promise<boolean> {
    const url = getImageUrl(folder, publicId)
    return await urlExists(url);
}


export async function videoExists(video: z.infer<typeof VideoToSaveModel>& {isNew: true}): Promise<boolean> {
    let url;
    if(video.source == "YouTube") {
        url = `https://www.youtube.com/watch?v=${video.sourceId}`;
    } else if (video.source == "SteamCdn") {
        url = `https://steamcdn-a.akamaihd.net/steam/apps/${video.sourceId}/movie_max.mp4`
    } else if (video.source == "Cloudinary") {
        url = getVideoUrl(video.sourceId);
    } else
        throw new Error("Invalid video source")
    return await urlExists(url);
}

export async function urlExists(url: string): Promise<boolean> {
    const res = await fetch(url, {method: "HEAD"});

    return res.ok;
}

export async function asyncSome<T>(arr: T[], predicate: (el: T) => Promise<boolean>) {
    for (let e of arr) {
        if (await predicate(e)) return true;
    }
    return false;
}