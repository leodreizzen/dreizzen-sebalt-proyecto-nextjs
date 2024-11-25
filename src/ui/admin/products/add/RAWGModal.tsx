import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {useState} from "react";
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {RAWGGame} from "@/app/api/internal/admin/rawg-game/types";
import RAWGAutocomplete from "@/ui/admin/products/add/RAWGAutocomplete";

function RAWGModalContent({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (product: RAWGGame) => void

}) {
    const [selectedProduct, setSelectedProduct] = useState<RAWGGame | null>(null)

    function handleProductChange(product: RAWGGame | null) {
        setSelectedProduct(product);
    }

    function handleAdd() {
        if(selectedProduct){
            onSubmit(selectedProduct)
            onClose()
        }
    }


    return <>
        <ModalHeader onAbort={onClose}>Import from RAWG</ModalHeader>
        <ModalBody>
            <RAWGAutocomplete onValueChange={handleProductChange}/>
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={onClose}>Cancel</Button>
            <Button color="primary" onClick={handleAdd} isDisabled={selectedProduct === null}>Add</Button>
        </ModalFooter>
    </>;
}

export default function RAWGModal({className, onSubmit}: {
    className?: string,
    onSubmit: (product: RAWGGame) => void
}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();


    return (
        <>
            <Button onClick={onOpen}>Choose from RAWG</Button>
            <Modal className={clsx(className)} isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>{
                    (onClose) => (
                        <RAWGModalContent onClose={onClose} onSubmit={onSubmit}/>
                    )
                }
                </ModalContent>
            </Modal>
        </>
    )
}


