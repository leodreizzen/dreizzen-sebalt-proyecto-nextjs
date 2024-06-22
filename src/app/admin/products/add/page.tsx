"use client"
import ImageUploader from "@/ui/admin/products/add/ImageUploader";
import React, {useState} from "react";
import ImageUploadCard from "@/ui/cards/ImageUploadCard";


export default function AdminProductsPage() {
    const [images, setImages] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    function handleUpload(file: File) {
        setFiles([...files, file]);
        const url = URL.createObjectURL(file);
        setImages([...images, url]);
    }

    function handleClose(index: number) {
        setImages(images.filter((_, i) => i !== index));
        setFiles(files.filter((_, i) => i !== index));
    }


    return (
        <div className={"justify-center items-center flex flex-col"}>
            <h1 className={"m-6 justify-center"}>Add products</h1>
            <div className={"border-1 border-borders w-full justify-center flex flex-col items-center p-2 rounded-xl"}>
                <div className={"flex flex-col gap-3 justify-start"}>
                    <input type={"text"} placeholder={"Product name"} className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                    <div className={"flex flex-row gap-1"}>
                        <input type={"number"} placeholder={"Product original price"} className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                        <input type={"number"} placeholder={"Product current price"}  className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                    </div>
                    <input type={"text"} placeholder={"Product short description"} className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                </div>
                <h1 className={"m-2 justify-center"}>Game images</h1>
                <ImageUploader onUpload={handleUpload}/>
                <h1 className={"p-6"}>Images added</h1>
                <div
                    className={"grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 w-full auto-rows-[1fr] border-1 border-borders rounded-2xl p-6"}>
                    {images.map((url, index) => (
                        <ImageUploadCard imageUrl={url} key={index} onClose={handleClose} id={index}/>
                    ))}
                </div>
            </div>
        </div>
    )
}