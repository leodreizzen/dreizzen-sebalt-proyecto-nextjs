"use client"
import ImageUploaderModal from "@/ui/admin/products/add/ImageUploaderModal";
import React, {useState} from "react";
import ImageUploadCard from "@/ui/cards/ImageUploadCard";
import useHTMLTextEditor from "@/ui/admin/TextEditor";
import RAWGModal from "@/ui/admin/products/add/RAWGModal";
import AddCompanyForm from "@/ui/admin/products/add/AddCompanyForm";
import VideoUploaderModal from "@/ui/admin/products/add/VideoUploaderModal";
import CompanyChip from "@/ui/admin/products/add/CompanyChip";
import {Textarea} from "@nextui-org/input";
import {Switch} from "@nextui-org/switch";
import {Button} from "@nextui-org/button";
import {DateInput} from "@nextui-org/date-input";

type ImageItem = {
    url: string,
    alt: string
}

type VideoItem = {
    url: string,
    thumbnail: string,
    alt: string
}

type CompanyExistent = {
    isNew: false,
    name: string,
    id: number,
}

type CompanyCreate = {
    isNew: true,
    name: string,
}

export type CompanyItem = CompanyExistent | CompanyCreate

export default function AdminProductsPage() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [isOnSale, setIsOnSale] = useState<boolean>(false);
    const [publishers, setPublishers] = useState<CompanyItem[]>([]);
    const [developers, setDevelopers] = useState<CompanyItem[]>([]);
    const {View: DescriptionView, getHtml} = useHTMLTextEditor();

    function handleImageAdd(url: string, alt: string) {
        setImages([...images, {url, alt}]);
    }

    function handleVideoAdd(url: string, alt: string, thumbnail: string) {
        setVideos([...videos, {url, alt, thumbnail}]);
    }

    function handleImageClose(index: number) {
        setImages(images.filter((_, i) => i !== index));
    }

    function handleVideoClose(index: number) {
        setVideos(videos.filter((_, i) => i !== index));
    }

    function handlePublisherAdd(company: CompanyItem) {
        setPublishers([...publishers, company]);
    }

    function handleDeveloperAdd(company: CompanyItem) {
        setDevelopers([...developers, company]);
    }

    function handlePublisherDelete(index: number) {
        setPublishers(publishers.filter((_, i) => i !== index));
    }

    function handleDeveloperDelete(index: number) {
        setDevelopers(developers.filter((_, i) => i !== index));
    }


    return (
        <div className={"justify-center items-center flex flex-col gap-3 mx-auto xl:w-3/4"}>
            <div className="flex justify-between w-full">
                <h1 className={"m-2 justify-center text-2xl font-bold"}>Add products</h1>
                <div className="flex gap-4">
                    <RAWGModal className="" onSubmit={product => console.log(product)}/>
                    <Button color="primary">Save</Button>
                </div>
            </div>
            <div
                className={"border-1 border-borders w-full flex flex-col items-center rounded-xl gap-6 px-8 pb-8 pt-6"}>
                <div
                    className={"flex flex-col lg:grid grid-rows-[repeat(5,auto)] lg:grid-rows-[repeat(3,auto)] lg:grid-cols-2 grid-flow-col gap-3 justify-start w-full gap-x-8"}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="product_name_input">Product name</label>
                        <input id="product_name_input" type={"text"} placeholder={"Product name"}
                               className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                    </div>
                    <div className="flex flex-col gap-2 col-start-2">
                        <label htmlFor="launch_date">Launch date</label>
                        <DateInput id="launch_date" aria-label="Launch date"
                               className="flex-grow text-black rounded-2xl"></DateInput>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="original_price">Original price</label>
                        <input id="original_price" type={"number"} placeholder={"Product original price"}
                               className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] grid-rows-[repeat(2,auto)] col-start-2 gap-x-3 md:gap-x-4 lg:gap-x-2">
                        <Switch size={"sm"} isSelected={isOnSale} onValueChange={setIsOnSale} className="row-start-2 !flex-row-reverse gap-x-2 max-lg:!flex-col-reverse gap-y-2">
                            <p className={"text-white"}>On sale</p>
                        </Switch>

                        <label htmlFor="current_price" className="col-start-2">Current price</label>
                        <input id="current_price" type={"number"} disabled={!isOnSale}
                               className={"border-1 border-borders rounded-2xl p-2 text-black row-start-2 min-w-0"}/>


                    </div>
                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="short_description" className="col-start-2">Short description</label>
                        <Textarea
                            id="short_description"
                            placeholder="Enter your short description"
                            className="max-w-full col-span-2"
                        />
                    </div>
                </div>
                <div
                    className={"flex flex-col gap-2 items-center border-1 border-borders p-2 rounded-2xl justify-center w-full"}>
                    <div className={"flex flex-row items-center"}>
                        <h1 className={"m-2 justify-center text-xl"}>Publishers</h1>
                        <div className="flex justify-end">
                            <AddCompanyForm onSubmit={handlePublisherAdd} type={"publisher"}/>
                        </div>
                    </div>
                    <div className={"grid grid-cols-1 lg:grid-cols-2 gap-2"}>
                        {publishers.length === 0 && <CompanyChip className={"invisible"} name={""} onClose={() => {
                        }}/>}
                        {publishers.map((company, index) => (
                            <CompanyChip key={index} name={company.name} onClose={() => handlePublisherDelete(index)}/>
                        ))}
                    </div>
                </div>
                <div
                    className={"flex flex-col gap-2 items-center border-1 border-borders p-2 rounded-2xl justify-center w-full"}>
                    <div className={"flex flex-row items-center"}>
                        <h1 className={"m-2 justify-center text-xl"}>Developers</h1>
                        <AddCompanyForm onSubmit={handleDeveloperAdd} type={"developer"}/>
                    </div>
                    <div className={"grid grid-cols-1 lg:grid-cols-2 gap-2 items-center"}>
                        {developers.length === 0 && <CompanyChip className={"invisible"} name={""} onClose={() => {
                        }}/>}
                        {developers.map((company, index) => (
                            <CompanyChip key={index} name={company.name} onClose={() => handleDeveloperDelete(index)}/>
                        ))}
                    </div>
                </div>
                <div
                    className={"flex flex-col border-1 border-borders items-center justify-center rounded-2xl w-full p-4"}>
                    <h1 className={"justify-center text-xl"}>Game images</h1>
                    <div
                        className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full auto-rows-[1fr] rounded-2xl p-3"}>
                        <ImageUploaderModal onSubmit={handleImageAdd}/>
                        {images.map((img, index) => (
                            <ImageUploadCard imageUrl={img.url} key={index} onClose={handleImageClose} id={index}/>
                        ))}
                    </div>
                </div>
                <div
                    className={"flex flex-col border-1 border-borders items-center justify-center rounded-2xl w-full p-4"}>
                    <h1 className={"justify-center text-xl"}>Game videos</h1>
                    <div
                        className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full auto-rows-[1fr] rounded-2xl p-3"}>
                        <VideoUploaderModal onSubmit={handleVideoAdd}/>
                        {videos.map((video, index) => (
                            <ImageUploadCard imageUrl={video.thumbnail} key={index} onClose={handleVideoClose}
                                             id={index}/>
                        ))}
                    </div>
                </div>
                <div className={"flex flex-col w-full p-6 border-1 border-borders mt-2 rounded-2xl items-center"}>
                    <h1 className={"mb-3 justify-center text-xl"}>Product description</h1>
                    <DescriptionView className="w-full h-96"/>
                </div>
            </div>
        </div>
    )
}
