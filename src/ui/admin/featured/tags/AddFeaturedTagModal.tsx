import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {useState} from "react";
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {TagAndImage} from "@/lib/clientActions";
import {Tag} from "@prisma/client";
import TagAutocomplete from "@/ui/admin/featured/tags/TagAutocomplete";
import {ImagePicker} from "@/ui/admin/ImagePicker";
import AdminFeaturedTagCard from "@/ui/admin/featured/tags/AdminFeaturedTagCard";

enum Step {
    INPUT,
    PREVIEW
}

function AddFeaturedProductModalContent({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (product: TagAndImage) => void

}) {
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [imageAlt, setImageAlt] = useState<string>("")
    const [step, setStep] = useState<Step>(Step.INPUT);

    function handleTagChange(tag: Tag | null) {
        setSelectedTag(tag);
    }

    function handleAdd() {
        if (selectedTag && file && imageUrl && imageAlt !== "")
            onSubmit({tag: selectedTag, image: {isNew: true, file: file, url: imageUrl, alt: imageAlt}})
    }

    function handleImageReset() {
        setImageUrl(null)
        setImageAlt("")
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

    return <>
        <ModalHeader onAbort={onClose}>Add featured product</ModalHeader>
        <ModalBody className="flex flex-col gap-0">
            {step === Step.INPUT && <>
                <TagAutocomplete onValueChange={handleTagChange} value={selectedTag}/>
                {
                    selectedTag && (
                        <ImagePicker file={file} url={imageUrl} alt={imageAlt} onFileChange={handleFileChange}
                                     onAltChange={setImageAlt}/>
                    )
                }</>}
            {
                step === Step.PREVIEW && selectedTag && imageUrl && (
                    <>
                        <p className="font-bold text-center">Preview</p>
                        <AdminFeaturedTagCard tag={
                            {
                                tag: selectedTag,
                                image: {url: imageUrl, alt: imageAlt}
                            }
                        }/>
                    </>
                )
            }
        </ModalBody>
        <ModalFooter className="flex justify-between">
            <div>
                {step === Step.INPUT && imageUrl &&
                    <Button color="warning" onClick={handleImageReset}>Change image</Button>
                }
            </div>
            <div className="flex gap-2">
                <Button color="danger" onClick={onClose}>Cancel</Button>
                {step === Step.INPUT &&
                    <>
                        <Button color="primary" onClick={() => setStep(Step.PREVIEW)}
                                isDisabled={selectedTag === null || imageUrl === null || imageAlt === ""}>Next</Button>
                    </>
                }
                {step === Step.PREVIEW &&
                    <>

                        <Button color="default" onClick={() => setStep(Step.INPUT)}>Back</Button>
                        <Button color="primary" onClick={handleAdd} isDisabled={selectedTag === null}>Add</Button>
                    </>
                }
            </div>
        </ModalFooter>
    </>
        ;
}

export default function AddFeaturedTagModal({
                                                className, isOpen, onClose, onSubmit
                                            }: {
    className?: string,
    isOpen:boolean,
    onClose:() => void,
    onSubmit: (product: TagAndImage) => void
}) {

    return (
        <Modal className={clsx(className)} isOpen={isOpen} onClose={onClose} placement="center">
            <ModalContent>{
                (onClose) => (
                    <AddFeaturedProductModalContent onClose={onClose} onSubmit={onSubmit}/>
                )
            }
            </ModalContent>
        </Modal>
    )
}
