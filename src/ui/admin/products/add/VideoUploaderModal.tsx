import React, {useState} from "react";
import {Button} from "@nextui-org/button";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import clsx from "clsx";
import FileDropzone from "@/ui/FileDropzone";
import {Radio, RadioGroup} from "@nextui-org/radio";
import {generateVideoThumbnails} from "@rajesh896/video-thumbnails-generator";
import {NewVideo} from "@/ui/admin/products/add/AddProductForm";
import {allowedVideos} from "@/lib/filetypes";

function VideoUploaderModalContent({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (video: NewVideo) => void,
}) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [alt, setAlt] = useState<string>("");
    const [radioValue, setRadioValue] = useState<"file" | "youtube">("file");


    async function handleAdd() {
        if (videoUrl && alt !== "") {
            const thumbnail = await obtainThumbnail(videoUrl)
            if (radioValue === "file" && videoFile)
                onSubmit({
                    isNew: true,
                    type: "file",
                    file: videoFile,
                    thumbnail: {isNew: true, type: "file", file: base64ToFile(thumbnail, "thumbnail.jpg"), url: thumbnail, alt: `Thumbnail for ${alt}`},
                    alt: alt,
                })
            else {
                onSubmit({isNew: true, type: "url", source: "YouTube", url: videoUrl, thumbnail: {isNew: true, type:"url", url: thumbnail, alt: `Thumbnail for ${alt}`}, alt})
            }
            onClose();
        }
    }

    async function obtainThumbnail(videoUrl: string) {
        if (radioValue === "youtube") {
            const videoId = videoUrl.split("v=")[1];
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        } else {
            if (radioValue === "file" && videoFile) {
                const screenshots = await generateVideoThumbnails(videoFile, 1, "jpg")
                return screenshots[0];
            } else {
                return "";
            }
        }
    }

    function handleFileChange(file: File) {
        setVideoUrl(URL.createObjectURL(file));
        setVideoFile(file);
    }

    function onAltChange(alt: string) {
        setAlt(alt);
    }

    function handleValueChange(value: string) {
        if (value === "file" || value === "youtube")
            setRadioValue(value)
        else
            throw new Error("Invalid radio button value")
    }

    function base64ToFile(data: string, filename: string) {
        const byteString = atob(data.split(',')[1]);
        // separate out the mime component
        const mimeString = data.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new File([new Blob([ab], {type: mimeString})], filename);
    }

    return (
        <>
            <ModalHeader onAbort={onClose}>Add video</ModalHeader>
            <ModalBody>
                {!videoUrl &&
                    <RadioGroup label={"Select the video source"} value={radioValue} onValueChange={handleValueChange}>
                        <Radio value={"file"}>File</Radio>
                        <Radio value={"youtube"}>Youtube</Radio>
                    </RadioGroup>}
                <div className={"flex flex-col items-center gap-2"}>
                    <div className="flex items-center justify-center w-full border-1 border-borders m-2">
                        {radioValue === "file" && !videoUrl && <FileDropzone drop={handleFileChange} accept={allowedVideos}/>}
                        {radioValue === "youtube" && <input type={"text"} placeholder={"Youtube URL"}
                                                            onChange={e => setVideoUrl(e.target.value)}
                                                            className={"border-1 border-borders rounded-2xl p-2 text-black"}/>}
                    </div>
                    {videoUrl &&
                        <input type={"text"} placeholder={"Alt text"} value={alt}
                               onChange={e => onAltChange(e.target.value)}
                               className={"border-1 border-borders rounded-2xl p-2 text-black"}/>}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose} color={"danger"}>Cancel</Button>
                <Button color={"primary"} disabled={videoUrl === null || alt === null} onClick={() => {
                    handleAdd().catch(console.error)
                }}> Add</Button>
            </ModalFooter>
        </>
    )

}

export default function VideoUploaderModal({onSubmit, className}: {
    onSubmit: (video: NewVideo) => void,
    className?: string,
}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div
            className={clsx(className, "flex flex-col border-1 border-borders rounded-2xl p-6 items-center justify-center aspect-video")}>
            <Button onClick={onOpen}>Upload video</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <VideoUploaderModalContent onClose={onClose} onSubmit={onSubmit}/>
                    )
                    }
                </ModalContent>
            </Modal>
        </div>
    )
}