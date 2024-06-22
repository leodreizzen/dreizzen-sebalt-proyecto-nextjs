import React, {useState} from "react";
import Image from "next/image";
import {Button} from "@nextui-org/button";
import {Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, useDisclosure} from "@nextui-org/modal";
import clsx from "clsx";
import FileDropzone from "@/ui/FileDropzone";
import ImageCropper from "@/ui/ImageCropper";


function ImageUploaderModalContent({onClose, onUpload}: {
    onClose: () => void,
    onUpload: (file: File) => void,
}) {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    function handleFileChange(file: File[]) {
        setFile(file[0]);
        setImageUrl(URL.createObjectURL(file[0]));
    }

    async function handleUpload() {
        if (file) {
            onUpload(file);
        }
    }

    function handleCrop(blob: Blob) {
        const file = new File([blob], "image.png");
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
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
                    {imageUrl &&
                        <Image src={imageUrl} width={200} height={200} alt={"Image uploaded"}/>}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose} color={"danger"}>Cancel</Button>
                <Button color={"primary"} disabled={imageUrl == null} onClick={() => {
                    handleUpload().then(onClose)
                }}> Add</Button>
            </ModalFooter>
        </>
    )

}

export default function ImageUploader({onUpload, className}: {
    onUpload: (file: File) => void,
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