import FileDropzone from "@/ui/FileDropzone";
import ImageCropper from "@/ui/ImageCropper";
import React from "react";
import clsx from "clsx";

export function ImagePicker({className, imageUrl, onImageUrlChange, alt, onAltChange}: {
    className?: string,
    imageUrl: string | null,
    onImageUrlChange: (url: string | null) => void,
    alt: string,
    onAltChange: (alt: string) => void,
}) {

    function handleFileChange(file: File[]) {
        onImageUrlChange(URL.createObjectURL(file[0]));
    }

    function handleCrop(blob: Blob) {
        const file = new File([blob], "image.png");
        onImageUrlChange(URL.createObjectURL(file));
    }

    return <div className={clsx(className,"flex flex-col items-center gap-2")}>
        <div className="flex items-center justify-center w-full border-1 border-borders m-2">
            {!imageUrl && <FileDropzone drop={handleFileChange}/>}
            {imageUrl && <ImageCropper className="max-h-96" src={imageUrl} onCrop={handleCrop}/>}

        </div>
        {imageUrl &&
            <input type={"text"} placeholder={"Alt text"} value={alt} onChange={e => onAltChange(e.target.value)}
                   className={"border-1 border-borders rounded-2xl p-2 text-black"}/>}
    </div>
}