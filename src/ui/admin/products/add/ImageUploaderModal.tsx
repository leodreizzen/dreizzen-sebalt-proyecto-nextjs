import React, {useState} from "react";
import {Button} from "@nextui-org/button";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import clsx from "clsx";
import {ImagePicker} from "@/ui/admin/ImagePicker";

function ImageUploaderModalContent({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (url: string, alt: string) => void,
}) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [alt, setAlt] = useState<string>("");


    function handleAdd() {
        if (imageUrl && alt !== "") {
            onSubmit(imageUrl, alt);
            onClose();
        }
    }

    function handleFileChange(newFile: File | null) {
        setFile(newFile)
        if (newFile) {
            if(imageUrl)
                URL.revokeObjectURL(imageUrl)
            const url = URL.createObjectURL(newFile)
            setImageUrl(url)
        } else {
            setImageUrl(null)
        }
    }

    return (
        <>
            <ModalHeader onAbort={onClose}>Add image</ModalHeader>
            <ModalBody>
                <ImagePicker file={file} onFileChange={handleFileChange} alt={alt}
                             onAltChange={setAlt} url={imageUrl}/>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose} color={"danger"}>Cancel</Button>
                <Button color={"primary"} disabled={imageUrl === null || alt === null} onClick={() => {
                    handleAdd()
                }}> Add</Button>
            </ModalFooter>
        </>
    )

}

export default function ImageUploaderModal({onSubmit, className}: {
    onSubmit: (url: string, alt: string) => void,
    className?: string,
}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div className={clsx(className, "border-1 border-borders rounded-2xl p-6")}>
            <Button onClick={onOpen}>Upload image</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <ImageUploaderModalContent onClose={onClose} onSubmit={onSubmit}/>
                    )
                    }
                </ModalContent>
            </Modal>
        </div>
    )
}