import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import ProductAutocomplete from "@/ui/admin/featured/products/ProductAutocomplete";
import {ProductSaleWithProduct, ProductWithTagsAndCoverImage} from "@/lib/definitions";
import {useState} from "react";
import AdminFeaturedProductCard from "@/ui/admin/featured/AdminFeaturedProductCard";
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import SaleAutocomplete from "@/ui/admin/featured/sales/SaleAutocomplete";

function AddFeaturedSaleModalContent({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (product: ProductSaleWithProduct) => void

}) {
    const [selectedSale, setSelectedSale] = useState<ProductSaleWithProduct | null>(null)

    function handleSaleChange(sale: ProductSaleWithProduct | null) {
        setSelectedSale(sale);
    }

    function handleAdd() {
        if(selectedSale)
            onSubmit(selectedSale)
    }

    return <>
        <ModalHeader onAbort={onClose}>Add featured sale</ModalHeader>
        <ModalBody>
            <SaleAutocomplete onValueChange={handleSaleChange}/>
            {
                selectedSale && (
                    <AdminFeaturedProductCard product={selectedSale.product}/>
                )
            }
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={onClose}>Cancel</Button>
            <Button color="primary" onClick={handleAdd} isDisabled={selectedSale === null}>Add</Button>
        </ModalFooter>
    </>;
}

export default function AddFeaturedSaleModal({className, isOpen, onClose, onSubmit}: {
    className?: string,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (product: ProductSaleWithProduct) => void
}) {

    return (
        <Modal className={clsx(className)} isOpen={isOpen} onClose={onClose} placement="center">
            <ModalContent>{
                (onClose) => (
                    <AddFeaturedSaleModalContent onClose={onClose} onSubmit={onSubmit}/>
                )
            }
            </ModalContent>
        </Modal>
    )
}
