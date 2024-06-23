import React, {useState} from "react";
import {Button} from "@nextui-org/button";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import clsx from "clsx";
import FileDropzone from "@/ui/FileDropzone";
import {Radio, RadioGroup} from "@nextui-org/radio";
import {generateVideoThumbnails} from "@rajesh896/video-thumbnails-generator";

function VideoUploaderModalContent({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (url: string, alt: string, thumbnail: string) => void,
}) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [alt, setAlt] = useState<string>("");
    const [radioValue, setRadioValue] = useState<string>("file");


    async function handleAdd() {
        if (videoUrl && alt !== "") {
            const thumbnail = await obtainThumbnail(videoUrl)
            onSubmit(videoUrl, alt, thumbnail);
            onClose();
        }
    }

    async function obtainThumbnail(videoUrl: string) {
        if (radioValue === "youtube"){
            const videoId = videoUrl.split("v=")[1];
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        else {
            if (radioValue === "file" && videoFile) {
                const screenshots = await generateVideoThumbnails(videoFile, 1, "jpg")
                return screenshots[0];
            }
            else {
                return "";
            }
        }
    }

    function handleFileChange(file: File[]) {
        setVideoUrl(URL.createObjectURL(file[0]));
        setVideoFile(file[0]);
    }

    function onAltChange(alt: string) {
        setAlt(alt);
    }

    return (
        <>
            <ModalHeader onAbort={onClose}>Add video</ModalHeader>
            <ModalBody>
                {!videoUrl && <RadioGroup label={"Select the video source"} value={radioValue} onValueChange={setRadioValue}>
                    <Radio value={"file"}>File</Radio>
                    <Radio value={"youtube"}>Youtube</Radio>
                </RadioGroup>}
                <div className={"flex flex-col items-center gap-2"}>
                    <div className="flex items-center justify-center w-full border-1 border-borders m-2">
                        {radioValue === "file" && !videoUrl && <FileDropzone drop={handleFileChange}/>}
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
    onSubmit: (url: string, alt: string, thumbnail: string) => void,
    className?: string,
}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div className={clsx(className, "flex flex-col border-1 border-borders rounded-2xl p-6 items-center justify-center aspect-video")}>
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