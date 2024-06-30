import {useState} from "react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {TagItem} from "@/ui/admin/products/add/AddProductForm";
import TagAutocompleteWithCreate from "@/ui/admin/products/add/TagAutoCompleteWithCreate";


function AddTagModalContent({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (company: TagItem) => void
}) {
    const [selectedTag, setSelectedTag] = useState<TagItem| null>(null)

    function handleTagChange(tag: TagItem | null) {
        setSelectedTag(tag);
    }

    function handleAdd() {
        if(selectedTag){
            onSubmit(selectedTag)
            onClose()
        }
    }

    return <>
        <ModalHeader onAbort={onClose}>Add tag</ModalHeader>
        <ModalBody>
            <TagAutocompleteWithCreate onValueChange={handleTagChange}/>
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={onClose}>Cancel</Button>
            <Button color="primary" onClick={handleAdd} isDisabled={selectedTag === null}>Add</Button>
        </ModalFooter>
    </>;
}

export default function AddFeaturedProductModal({className, isOpen, onClose, onSubmit}: {
    className?: string,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (tag: TagItem) => void
}) {

    return (
        <Modal className={clsx(className)} isOpen={isOpen} onClose={onClose} placement="center">
            <ModalContent>{
                (onClose) => (
                    <AddTagModalContent onClose={onClose} onSubmit={onSubmit}/>
                )
            }
            </ModalContent>
        </Modal>
    )
}