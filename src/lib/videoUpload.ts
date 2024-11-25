import {ProductUploadVideoResult} from "@/lib/clientActions";
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set")
}
const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_API_KEY not set")
}
const cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY

import {v4 as uuidv4} from "uuid";
import {UploadData} from "@/lib/actions/uploads";


import {ProductImageToSave} from "@/lib/actions/products/models";
export async function uploadVideo(videoFile: File, thumbnail: ProductImageToSave, alt: string, uploadData: UploadData): Promise<ProductUploadVideoResult>{
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(videoFile.size / chunkSize);
    let currentChunk = 0;
    const uniqueID = uuidv4()
    const uploadChunk = async (start: number, end: number): Promise<any> => {
        const formData = new FormData();
        formData.append('file', videoFile.slice(start, end));
        formData.append("api_key", cloudinaryApiKey)
        formData.append("public_id", uploadData.id)
        formData.append("timestamp", uploadData.timestamp.toString())
        formData.append("signature", uploadData.signature)
        formData.append("allowed_format", uploadData.allowed_formats)
        formData.append("folder", uploadData.folder)
        const contentRange = `bytes ${start}-${end - 1}/${videoFile.size}`;

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Range': contentRange,
                        "X-Unique-Upload-Id": uniqueID
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Chunk upload failed.');
            }

            currentChunk++;

            if (currentChunk < totalChunks) {
                const nextStart = currentChunk * chunkSize;
                const nextEnd = Math.min(nextStart + chunkSize, videoFile.size);
                return await uploadChunk(nextStart, nextEnd);
            } else {
                const fetchResponse = await response.json();
                return fetchResponse;
            }
    };

    const start = 0;
    const end = Math.min(chunkSize, videoFile.size);
    try{
        const response = await uploadChunk(start, end);
        return {success: true, video: {isNew: true, source: "Cloudinary", sourceId: response.public_id, alt: alt, thumbnail: thumbnail}}
    }
    catch (e){
        console.error(e)
        return {success: false, error: "Error uploading video"}
    }
}