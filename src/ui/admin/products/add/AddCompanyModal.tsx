import {useState} from "react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import CompanyAutocomplete from "@/ui/admin/products/add/CompanyAutocomplete";
import {CompanyItem} from "@/ui/admin/products/add/AddProductForm";


function AddCompanyModalContent({onClose, onSubmit, type}: {
    onClose: () => void,
    onSubmit: (company: CompanyItem) => void
    type: "developer" | "publisher"
}) {
    const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null)

    function handleCompanyChange(product: CompanyItem | null) {
        setSelectedCompany(product);
    }

    function handleAdd() {
        if(selectedCompany){
            onSubmit(selectedCompany)
            onClose()
        }
    }

    return <>
        <ModalHeader onAbort={onClose}>Add {type}</ModalHeader>
        <ModalBody>
            <CompanyAutocomplete onValueChange={handleCompanyChange}/>
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={onClose}>Cancel</Button>
            <Button color="primary" onClick={handleAdd} isDisabled={selectedCompany === null}>Add</Button>
        </ModalFooter>
    </>;
}

export default function AddFeaturedProductModal({className, isOpen, onClose, onSubmit, type}: {
    className?: string,
    isOpen: boolean,
    type: "developer" | "publisher",
    onClose: () => void,
    onSubmit: (company: CompanyItem) => void
}) {

    return (
        <Modal className={clsx(className)} isOpen={isOpen} onClose={onClose} placement="center">
            <ModalContent>{
                (onClose) => (
                    <AddCompanyModalContent onClose={onClose} onSubmit={onSubmit} type={type}/>
                )
            }
            </ModalContent>
        </Modal>
    )
}