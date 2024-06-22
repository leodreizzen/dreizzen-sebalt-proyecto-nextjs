import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import ProductAutocomplete from "@/ui/admin/featured/ProductAutocomplete";
import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import {useState} from "react";
import AdminFeaturedProductCard from "@/ui/admin/featured/AdminFeaturedProductCard";
import {Button} from "@nextui-org/button";

function AddFeaturedProductModalContent({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (product: ProductWithTagsAndCoverImage) => void

}) {
    const [selectedProduct, setSelectedProduct] = useState<ProductWithTagsAndCoverImage | null>(null)

    function handleProductChange(product: ProductWithTagsAndCoverImage | null) {
        setSelectedProduct(product);
    }

    function handleAdd() {
        if(selectedProduct)
            onSubmit(selectedProduct)
    }

    return <>
        <ModalHeader onAbort={onClose}>Add featured product</ModalHeader>
        <ModalBody>
            <ProductAutocomplete onValueChange={handleProductChange}/>
            {
                selectedProduct && (
                    <AdminFeaturedProductCard product={selectedProduct}/>
                )
            }
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={onClose}>Cancel</Button>
            <Button color="primary" onClick={handleAdd} isDisabled={selectedProduct === null}>Add</Button>
        </ModalFooter>
    </>;
}

export default function AddFeaturedProductModal({className, isOpen, onClose, onSubmit}: {
    className?: string,
    isOpen: boolean,
    onClose: (product: ProductWithTagsAndCoverImage | null) => void,
    onSubmit: (product: ProductWithTagsAndCoverImage) => void
}) {

    return (
        <Modal isOpen={isOpen} onClose={onClose.bind(null, null)} placement="center">
            <ModalContent>{
                (onClose) => (
                    <AddFeaturedProductModalContent onClose={onClose} onSubmit={onSubmit}/>
                )
            }
            </ModalContent>
        </Modal>
    )
}
