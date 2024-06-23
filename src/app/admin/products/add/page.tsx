"use client"
import ImageUploaderModal from "@/ui/admin/products/add/ImageUploaderModal";
import React, {useState} from "react";
import ImageUploadCard from "@/ui/cards/ImageUploadCard";
import useHTMLTextEditor from "@/ui/admin/TextEditor";
import RAWGModal from "@/ui/admin/products/add/RAWGModal";

type ImageItem = {
    url: string,
    alt: string
}

export default function AdminProductsPage() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const {View: DescriptionView, getHtml} = useHTMLTextEditor();

    function handleImageAdd(url: string, alt: string) {
        setImages([...images, {url, alt}]);
    }

    function handleClose(index: number) {
        setImages(images.filter((_, i) => i !== index));
    }


    return (
        <div className={"justify-center items-center flex flex-col"}>
            <h1 className={"m-6 justify-center"}>Add products</h1>
            <div className={"border-1 border-borders w-full justify-center flex flex-col items-center p-2 rounded-xl"}>
                <div className={"flex flex-col gap-3 justify-start"}>
                    <input type={"text"} placeholder={"Product name"} className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                    <div className={"grid grid-cols-1 lg:grid-cols-2 gap-1"}>
                        <input type={"number"} placeholder={"Product original price"} className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                        <input type={"number"} placeholder={"Product current price"}  className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                    </div>
                    <input type={"text"} placeholder={"Product short description"} className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                </div>
                <h1 className={"m-2 justify-center"}>Game images</h1>
                <ImageUploaderModal onSubmit={handleImageAdd}/>
                <h1 className={"p-6"}>Images added</h1>
                <div
                    className={"grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 w-full auto-rows-[1fr] border-1 border-borders rounded-2xl p-6"}>
                    {images.map((img, index) => (
                        <ImageUploadCard imageUrl={img.url} key={index} onClose={handleClose} id={index}/>
                    ))}
                </div>
                <RAWGModal onSubmit={product => console.log(product)}/>
                <div className={"flex flex-col w-full p-6 border-1 border-borders mt-2 rounded-2xl"}>
                    <h1 className={"mb-3 justify-center"}>Product description</h1>
                    <DescriptionView className="w-full h-96"/>
                </div>
            </div>
        </div>
    )
}
