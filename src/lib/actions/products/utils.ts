import {ProductImageToSave, ProductVideoToSave} from "@/lib/actions/products/models";
import {getImageUrl} from "@/lib/cloudinary-utils";
import {VideoSource} from "@prisma/client";

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