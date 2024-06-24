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
import {CalendarDate} from "@internationalized/date";
import {RAWGGame} from "@/app/api/internal/admin/rawg-game/types";
import {createProductClient} from "@/lib/clientActions";
import {useToast} from "@/ui/shadcn/use-toast";
import {useRouter} from "next/navigation";
import AddTagForm from "@/ui/admin/products/add/AddTagForm";

export type ExistingImage = {
    isNew: false,
    id: number,
    url: string
}

export type UrlImage = {
    isNew: true
    type: "url"
    url: string,
    alt: string
}

export type ExistingTag = {
    isNew: false,
    id: number,
    name: string
}

export type NewTag = {
    isNew: true,
    name: string
}

export type TagItem = ExistingTag | NewTag

export type FileImage = {
    isNew: true
    type: "file"
    file: File
    url: string,
    alt: string
}
export type NewImage = UrlImage | FileImage

export type ImageItem = ExistingImage | NewImage

type ExistingVideo = {
    isNew: false,
    id: number
    thumbnail: ExistingImage,
}

type FileVideo = {
    isNew: true,
    type: "file",
    thumbnail: FileImage,
    file: File,
    alt: string
}

type URLVideo = {
    isNew: true,
    type: "url",
    source: "YouTube" | "SteamCdn"
    thumbnail: UrlImage,
    url: string,
    alt: string
}

export type NewVideo = FileVideo | URLVideo

export type VideoItem = ExistingVideo | NewVideo

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

export default function AdminProductForm({initialData}: {
    initialData?: {
        name: string,
        launchDate: CalendarDate | null,
        originalPrice: number | null,
        currentPrice: number | null,
        shortDescription: string,
        description: string,
        tags: TagItem[],
        coverImage: ImageItem
        images: ImageItem[],
        videos: VideoItem[],
        isOnSale: boolean,
        publishers: CompanyItem[],
        developers: CompanyItem[],
    }
}) {
    const [images, setImages] = useState<ImageItem[]>(initialData?.images ?? []);
    const [videos, setVideos] = useState<VideoItem[]>(initialData?.videos ?? []);
    const [isOnSale, setIsOnSale] = useState<boolean>(initialData ? (initialData.currentPrice !== initialData.originalPrice) : false);
    const [publishers, setPublishers] = useState<CompanyItem[]>(initialData?.publishers ?? []);
    const [developers, setDevelopers] = useState<CompanyItem[]>(initialData?.developers ?? []);
    const [tags, setTags] = useState<TagItem[]>(initialData?.tags ?? []);
    const [coverImage, setCoverImage] = useState<ImageItem | null>(initialData?.coverImage ?? null);
    const {View: DescriptionView, getHtml, setHtml} = useHTMLTextEditor(initialData?.description);
    const [inputsState, setInputsState] = useState<
        {
            name: string,
            launchDate: CalendarDate | null,
            originalPrice: number | null,
            currentPrice: number | null,
            shortDescription: string,
        }
    >(initialData ? {
            name: initialData.name,
            launchDate: initialData.launchDate,
            originalPrice: initialData.originalPrice,
            currentPrice: initialData.currentPrice,
            shortDescription: initialData.shortDescription,
        } :
        {
            name: "",
            launchDate: null,
            originalPrice: null,
            currentPrice: null,
            shortDescription: ""
        })
    const {toast} = useToast()
    const router = useRouter();

    function handleImageAdd(image: FileImage) {
        setImages([...images, image]);
    }

    function handleVideoAdd(video: NewVideo) {
        setVideos([...videos, video]);
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

    function handleProductNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputsState({...inputsState, name: e.target.value});
    }

    function handleDateChange(date: CalendarDate) {
        setInputsState({...inputsState, launchDate: date});
    }

    function handleTagAdd(tag: TagItem) {
        setTags([...tags, tag]);
    }

    function handleOriginalPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        let newPrice: number | null = parseFloat(e.target.value);
        if (isNaN(newPrice) || newPrice < 0)
            newPrice = null;
        setInputsState({...inputsState, originalPrice: newPrice});
    }

    function handleCurrentPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        let newPrice: number | null = parseFloat(e.target.value);
        if (isNaN(newPrice) || newPrice < 0)
            newPrice = null;
        setInputsState({...inputsState, currentPrice: newPrice});

    }

    function handleShortDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputsState({...inputsState, shortDescription: e.target.value});
    }

    async function handleRawgSubmit(rawgData: RAWGGame) {
        const date = new Date(rawgData.released);
        setInputsState({
            ...inputsState,
            name: rawgData.name,
            launchDate: rawgData.released ? new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate()) : null,
        })
        setPublishers(rawgData.publishers.map(publisher => ({isNew: true, name: publisher.name})));
        setDevelopers(rawgData.developers.map(developer => ({isNew: true, name: developer.name})));
        setCoverImage({isNew: true, type: "url", url: rawgData.background_image, alt: rawgData.name});
        setImages(rawgData.screenshots.map((screenshot) => ({
            isNew: true,
            type: "url",
            url: screenshot.image,
            alt: rawgData.name
        })));
        setVideos(rawgData.movies.map((movie) => ({
            isNew: true,
            type: "url",
            source: "SteamCdn",
            url: movie.video,
            alt: rawgData.name,
            thumbnail: {isNew: true, type: "url", url: movie.preview, alt: rawgData.name}
        })));
        setTags(rawgData.genres.map(genre => ({isNew: true, name: genre.name})));
        await setHtml(rawgData.description);
    }

    function handleCoverImageAdd(image: FileImage) {
        setCoverImage(image);
    }

    function handleCoverImageClose() {
        setCoverImage(null);
    }

    async function onSavePress() {
        if (!inputsState.name || !inputsState.launchDate || !inputsState.shortDescription || !coverImage || !inputsState.originalPrice || isOnSale && ( !inputsState.currentPrice || inputsState.currentPrice > inputsState.originalPrice)){
            toast({
                title: "Error",
                description: "Check your data",
                variant: "destructive",
                duration: 5000
            })
            return
        }
        let html: string | null = null
        try{
            html = await getHtml();
        } catch(e){
            console.error(e)
            return
        }

        if(!html)
            return

        if (!initialData) {
            const result = await createProductClient({
                original_price_cents: Math.floor(inputsState.originalPrice * 100),
                current_price_cents: Math.floor((isOnSale && inputsState.currentPrice) ? inputsState.currentPrice * 100 : inputsState.originalPrice * 100),
                publishers: publishers,
                developers: developers,
                name: inputsState.name,
                launchDate: inputsState.launchDate.toString(),
                shortDescription: inputsState.shortDescription,
                description: html,
                coverImage: coverImage!,
                images: images as NewImage[],
                videos: videos as NewVideo[],
                tags: []
            })
            if (result.success)
                router.push("/admin/products")
            else
                toast({
                    title: "Error saving tags",
                    description: result.error,
                    variant: "destructive",
                    duration: 5000
                })

        }


    }

    return (
        <div className={"justify-center items-center flex flex-col gap-3 mx-auto xl:w-3/4"}>
            <div className="flex justify-between w-full">
                <h1 className={"m-2 justify-center text-2xl font-bold"}>Add products</h1>
                <div className="flex gap-4">
                    <RAWGModal className="" onSubmit={handleRawgSubmit}/>
                    <Button color="primary" onPress={onSavePress}>Save</Button>
                </div>
            </div>
            <div
                className={"border-1 border-borders w-full flex flex-col items-center rounded-xl gap-6 px-8 pb-8 pt-6"}>
                <div
                    className={"flex flex-col lg:grid grid-rows-[repeat(5,auto)] lg:grid-rows-[repeat(3,auto)] lg:grid-cols-2 grid-flow-col gap-3 justify-start w-full gap-x-8"}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="product_name_input">Product name</label>
                        <input id="product_name_input" type={"text"} placeholder={"Product name"}
                               value={inputsState.name} onChange={handleProductNameChange}
                               className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                    </div>
                    <div className="flex flex-col gap-2 col-start-2">
                        <label htmlFor="launch_date">Launch date</label>
                        <DateInput id="launch_date" aria-label="Launch date" value={inputsState.launchDate}
                                   onChange={handleDateChange}
                                   className="flex-grow !text-black rounded-2xl"></DateInput>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="original_price">Original price</label>
                        <input id="original_price" type={"number"} placeholder={"Product original price"}
                               value={inputsState.originalPrice ?? ""} onChange={handleOriginalPriceChange}
                               className={"border-1 border-borders rounded-2xl p-2 text-black"}/>
                    </div>
                    <div
                        className="grid grid-cols-[auto_1fr] grid-rows-[repeat(2,auto)] col-start-2 gap-x-3 md:gap-x-4 lg:gap-x-2">
                        <Switch size={"sm"} isSelected={isOnSale} onValueChange={setIsOnSale}
                                className="row-start-2 !flex-row-reverse gap-x-2 max-lg:!flex-col-reverse gap-y-2">
                            <p className={"text-white"}>On sale</p>
                        </Switch>

                        <label htmlFor="current_price" className="col-start-2">Current price</label>
                        <input id="current_price" type={"number"} disabled={!isOnSale}
                               value={inputsState.currentPrice ?? ""} onChange={handleCurrentPriceChange}
                               className={"border-1 border-borders rounded-2xl p-2 text-black row-start-2 min-w-0"}/>


                    </div>
                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="short_description" className="col-start-2">Short description</label>
                        <Textarea
                            value={inputsState.shortDescription}
                            onChange={handleShortDescriptionChange}
                            id="short_description"
                            placeholder="Enter your short description"
                            className="max-w-full col-span-2"
                        />
                    </div>
                </div>
                <div
                    className={"flex flex-col gap-2 items-center border-1 border-borders p-2 rounded-2xl justify-center w-full"}>
                    <div className={"flex flex-row items-center"}>
                        <h1 className={"m-2 justify-center text-xl"}>Tags</h1>
                        <div className="flex justify-end">
                            <AddTagForm onSubmit={handleTagAdd}/>
                        </div>
                    </div>
                    <div className={"grid grid-cols-1 lg:grid-cols-2 gap-2"}>
                        {tags.length === 0 && <CompanyChip className={"invisible"} name={""} onClose={() => {
                        }}/>}
                        {tags.map((company, index) => (
                            <CompanyChip key={index} name={company.name} onClose={() => handlePublisherDelete(index)}/>
                        ))}
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
                    <h1 className={"justify-center text-xl"}>Cover Image</h1>
                    <div
                        className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full auto-rows-[1fr] rounded-2xl p-3"}>
                        {!coverImage && <ImageUploaderModal onSubmit={handleCoverImageAdd}/>}
                        {coverImage && <ImageUploadCard imageUrl={coverImage.url} onClose={handleCoverImageClose}/>}

                    </div>
                </div>
                <div
                    className={"flex flex-col border-1 border-borders items-center justify-center rounded-2xl w-full p-4"}>
                    <h1 className={"justify-center text-xl"}>Game images</h1>
                    <div
                        className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full auto-rows-[1fr] rounded-2xl p-3"}>
                        <ImageUploaderModal onSubmit={handleImageAdd}/>
                        {images.map((img, index) => (
                            <ImageUploadCard imageUrl={img.url} key={index} onClose={() => handleImageClose(index)}/>
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
                            <ImageUploadCard imageUrl={video.thumbnail.url} key={index}
                                             onClose={() => handleVideoClose(index)}
                            />
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
