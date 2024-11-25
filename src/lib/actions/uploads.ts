"use server";
import {auth} from "@/auth";
import {FEATURED_TAG_IMAGE_FOLDER, PRODUCT_IMAGE_FOLDER, PRODUCT_VIDEO_FOLDER} from "@/lib/config";
import {randomUUID} from "node:crypto";
import prisma from "@/lib/prisma";
import {PendingMediaSource, PendingMediaType} from "@prisma/client";
import {signUploadRequest} from "@/lib/cloudinary-utils";
import {allowedImages, allowedVideos} from "@/lib/filetypes";

export type UploadData = {
    resource_type: string
    allowed_formats: string
    folder: string
    id: string
    timestamp: number
    signature: string
}
type AuthorizeMediaUploadResult = {
    success: true
    uploadData: UploadData
} | {
    success: false,
    error: string
}

export async function authorizeFeaturedTagImageUpload(): Promise<AuthorizeMediaUploadResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    return _internalAuthorizeImageUpload(FEATURED_TAG_IMAGE_FOLDER)
}

export async function authorizeProductImageUpload(): Promise<AuthorizeMediaUploadResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    return _internalAuthorizeImageUpload(PRODUCT_IMAGE_FOLDER)
}

export async function authorizeProductVideoUpload(): Promise<AuthorizeMediaUploadResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    return _internalAuthorizeVideoUpload(PRODUCT_VIDEO_FOLDER)
}

export async function _internalAuthorizeVideoUpload(folder: string): Promise<AuthorizeMediaUploadResult> {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const id = randomUUID();
    const resource_type = "video";
    try {
        const formatsWithoutDot = Object.values(allowedVideos).flat().map(format => format.replace(".", ""));
        const allowed_formats = formatsWithoutDot.join(",");
        const signature = signUploadRequest(timestamp, folder, id, allowed_formats);
        await prisma.pendingMedia.create({
            data: {
                publicId: id,
                folder,
                type: PendingMediaType.VIDEO,
                source: PendingMediaSource.CLOUDINARY
            }
        })
        return {success: true, uploadData: {allowed_formats, resource_type, folder, id, timestamp, signature}};

    } catch (e) {
        console.error(e)
        return {success: false, error: "Internal error"}
    }
}

async function _internalAuthorizeImageUpload(folder: string): Promise<AuthorizeMediaUploadResult> {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const id = randomUUID();
    const resource_type = "image";
    try {
        const formatsWithoutDot = Object.values(allowedImages).flat().map(format => format.replace(".", ""));
        const allowed_formats = formatsWithoutDot.join(",");
        console.log(allowed_formats)
        const signature = signUploadRequest(timestamp, folder, id, allowed_formats);
        await prisma.pendingMedia.create({
            data: {
                publicId: id,
                folder,
                type: PendingMediaType.IMAGE,
                source: PendingMediaSource.CLOUDINARY
            }
        })
        return {success: true, uploadData: {resource_type, folder, id, timestamp, signature, allowed_formats}};

    } catch (e) {
        console.error(e)
        return {success: false, error: "Internal error"}
    }
}