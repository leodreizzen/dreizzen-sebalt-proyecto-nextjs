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
import {createProductClient, editProductClient} from "@/lib/clientActions";
import {useToast} from "@/ui/shadcn/use-toast";
import {useRouter} from "next/navigation";
import AddTagForm from "@/ui/admin/products/add/AddTagForm";
import {ActionResult} from "next/dist/server/app-render/types";
import {AwesomeButtonProgress} from "@leodreizzen/react-awesome-button";
import AwesomeButtonStyles from "@/ui/admin/products/add/buttonProgress.module.scss";

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
    thumbnail?: ExistingImage,
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

export type InitialDataType = {
    id: number,
    name: string,
    launchDate: Date | null,
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

export type CompanyItem = CompanyExistent | CompanyCreate

export default function AdminProductForm({initialData}: {
    initialData?: InitialDataType
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
            launchDate: initialData.launchDate ? new CalendarDate(initialData.launchDate.getFullYear(), initialData.launchDate.getMonth() + 1, initialData.launchDate.getDate()) : null,
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

    type ValidationResult = {
        success: true, data: {
            inputsState: {
                name: string,
                launchDate: CalendarDate,
                originalPrice: number,
                currentPrice: number | null,
                shortDescription: string,
            },
            coverImage: ImageItem
        }
    } | {
        success: false, error: string
    }

    function validateData(): ValidationResult {
        if (!inputsState.name)
            return {success: false, error: "Name is required"}
        if (!inputsState.launchDate)
            return {success: false, error: "Launch date is required"}
        if (!coverImage)
            return {success: false, error: "Cover image is required"}
        if (!inputsState.originalPrice)
            return {success: false, error: "Original price is required"}
        if (isOnSale && (!inputsState.currentPrice || inputsState.currentPrice >= inputsState.originalPrice))
            return {
                success: false,
                error: "If product is on sale, current price is required and must be lower than original price"
            }
        const a = inputsState.launchDate
        return {
            success: true,
            data: {
                inputsState: {
                    name: inputsState.name,
                    launchDate: inputsState.launchDate,
                    originalPrice: inputsState.originalPrice,
                    currentPrice: inputsState.currentPrice,
                    shortDescription: inputsState.shortDescription
                }, coverImage: coverImage
            }
        }
    }


    async function onSavePress(
        _: React.MouseEvent<Element, MouseEvent>,
        next: (endState?: (boolean | undefined), errorLabel?: (string | null | undefined)) => void
    ) {
        const validationResult = validateData();
        if (!validationResult.success) {
            toast({
                title: "Error",
                description: validationResult.error,
                variant: "destructive",
                duration: 5000
            })
            next(false, "Invalid data");
            return
        }

        const {inputsState: validatedInputsState, coverImage: validatedCoverImage} = validationResult.data

        let html: string | null = null
        try {
            html = await getHtml();
        } catch (e) {
            console.error(e)
            toast({
                title: "Error",
                description: "Error getting description. Please try again later",
                variant: "destructive",
                duration: 5000
            })
            next(false, "Invalid data");
            return
        }

        if (!html) {
            toast({
                title: "Error",
                description: "Description is required",
                variant: "destructive",
                duration: 5000
            })
            next(false, "Invalid data");
            return
        }
        const htmlDocument = new DOMParser().parseFromString(html, "text/html");
        const text = htmlDocument.body.textContent;
        const imgs = htmlDocument.querySelectorAll("img");
        if ((!text || text.length == 0) && imgs.length == 0) {
            toast({
                title: "Error",
                description: "Description is required",
                variant: "destructive",
                duration: 5000
            })
            next(false, "Invalid data");
            return
        }

        let result;
        if (!initialData) {
            result = await createProductClient({
                original_price_cents: Math.floor(validatedInputsState.originalPrice * 100),
                current_price_cents: Math.floor((isOnSale && validatedInputsState.currentPrice) ? validatedInputsState.currentPrice * 100 : validatedInputsState.originalPrice * 100),
                publishers: publishers,
                developers: developers,
                name: validatedInputsState.name,
                launchDate: validatedInputsState.launchDate.toString(),
                shortDescription: validatedInputsState.shortDescription,
                description: html,
                coverImage: validatedCoverImage,
                images: images,
                videos: videos,
                tags: tags
            })
        } else
            result = await editProductClient({
                id: initialData.id,
                original_price_cents: Math.floor(validatedInputsState.originalPrice * 100),
                current_price_cents: Math.floor((isOnSale && validatedInputsState.currentPrice) ? validatedInputsState.currentPrice * 100 : validatedInputsState.originalPrice * 100),
                publishers: publishers,
                developers: developers,
                name: validatedInputsState.name,
                launchDate: validatedInputsState.launchDate.toString(),
                shortDescription: validatedInputsState.shortDescription,
                description: html,
                coverImage: validatedCoverImage,
                images: images,
                videos: videos,
                tags: tags
            })
        if (result.success) {
            next(true);
            setTimeout(() => {
                router.push("/admin/products");
            }, 1000) // allow animation to finish
        } else {
            next(false, "Error");
            toast({
                title: "Error saving tags",
                description: result.error,
                variant: "destructive",
                duration: 5000
            })
        }

    }

    function handleTagDelete(index: number) {
        setTags(tags.filter((_, i) => i !== index))
    }

    return (
        <div className={"@container justify-center flex flex-col gap-3 mx-auto xl:w-3/4 items-center pt-2"}>
            <div className="flex flex-col @md:flex-row justify-between w-full @md:items-end gap-y-2">
                <h1 className={"mx-2 justify-center text-2xl font-bold text-center"}>{initialData ? "Edit product" : "Add product"}</h1>
                <div className="flex gap-4 justify-center w-full @sm:w-[revert]">
                    <RAWGModal className="" onSubmit={handleRawgSubmit}/>
                    <AwesomeButtonProgress type="primary" onPress={onSavePress} loadingLabel="Saving..."
                                           cssModule={AwesomeButtonStyles}>Save</AwesomeButtonProgress>
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
                                   className="flex-grow !text-black rounded-2xl"
                                   classNames={{segment: "!text-black"}}></DateInput>
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
                            <p className={"text-white select-text"}>On sale</p>
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
                            <CompanyChip key={index} name={company.name} onClose={() => handleTagDelete(index)}/>
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
                            <ImageUploadCard
                                imageUrl={video.thumbnail?.url || "https://static-00.iconduck.com/assets.00/image-x-generic-symbolic-icon-512x512-39rql7k5.png"}
                                key={index}
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
