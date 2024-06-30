import FileDropzone from "@/ui/FileDropzone";
import ImageCropper from "@/ui/ImageCropper";
import React from "react";
import clsx from "clsx";

export function ImagePicker({className, file, onFileChange, alt, onAltChange, url}: {
    className?: string,
    file: File | null,
    url: string | null,
    onFileChange: (file: File | null) => void,
    alt: string,
    onAltChange: (alt: string) => void,
}) {

    function handleFileChange(file: File[]) {
        onFileChange(file[0]);
    }

    function handleCrop(blob: Blob) {
        const file = new File([blob], "image.png");
        onFileChange(file);
    }

    return <div className={clsx(className,"flex flex-col items-center gap-2")}>
        <div className="flex items-center justify-center w-full border-1 border-borders m-2">
            {!file && <FileDropzone drop={handleFileChange}/>}
            {file && url && <ImageCropper className="max-h-96" src={url} onCrop={handleCrop}/>}

        </div>
        {file &&
            <input type={"text"} placeholder={"Alt text"} value={alt} onChange={e => onAltChange(e.target.value)}
                   className={"border-1 border-borders rounded-2xl p-2 text-black"}/>}
    </div>
}