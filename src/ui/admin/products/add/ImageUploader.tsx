import React, {useState} from "react";
import Image from "next/image";
import {Button} from "@nextui-org/button";
import {Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, useDisclosure} from "@nextui-org/modal";
import clsx from "clsx";
import FileDropzone from "@/ui/FileDropzone";
import ImageCropper from "@/ui/ImageCropper";


function ImageUploaderModalContent({onClose, onUpload}: {
    onClose: () => void,
    onUpload: (file: File, alt: string) => void,
}) {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [alt, setAlt] = useState<string | null>(null);

    function handleFileChange(file: File[]) {
        setFile(file[0]);
        setImageUrl(URL.createObjectURL(file[0]));
    }

    async function handleUpload() {
        if (file && alt) {
            onUpload(file, alt);
        }
    }

    function handleCrop(blob: Blob) {
        const file = new File([blob], "image.png");
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
    }

    function handleAltChange(event: React.ChangeEvent<HTMLInputElement>) {
        setAlt(event.target.value);
    }

    return (
        <>
            <ModalHeader onAbort={onClose}>Add image</ModalHeader>
            <ModalBody>
                <div className={"flex flex-col items-center gap-4"}>
                    <div className="flex items-center justify-center w-full border-1 border-borders m-2">
                        {!imageUrl && <FileDropzone drop={handleFileChange}/>}
                        {imageUrl && <ImageCropper src={imageUrl} onCrop={handleCrop}/>}

                    </div>
                    {imageUrl && <input type={"text"} placeholder={"Alt text"} onChange={handleAltChange} className={"border-1 border-borders rounded-2xl p-2 text-black"}/>}
                    {imageUrl &&
                        <Image src={imageUrl} width={200} height={200} alt={"Image uploaded"}/>}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose} color={"danger"}>Cancel</Button>
                <Button color={"primary"} disabled={imageUrl === null || alt === null} onClick={() => {
                    handleUpload().then(onClose)
                }}> Add</Button>
            </ModalFooter>
        </>
    )

}

export default function ImageUploader({onUpload, className}: {
    onUpload: (file: File, alt:string) => void,
    className?: string,
}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div className={clsx(className, "border-1 border-borders rounded-2xl p-6")}>
            <Button onClick={onOpen}>Upload image</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <ImageUploaderModalContent onClose={onClose} onUpload={onUpload}/>
                    )
                    }
                </ModalContent>
            </Modal>
        </div>
    )
}