"use client"
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import React, {useEffect, useState} from "react";
import AdminFeaturedProductCard from "@/ui/admin/featured/AdminFeaturedProductCard";
import AddFeaturedProductModal from "@/ui/admin/featured/products/AddFeaturedProductModal";
import {AwesomeButtonProgress} from "@leodreizzen/react-awesome-button";
import '@leodreizzen/react-awesome-button/dist/styles.css';
import AwesomeButtonStyles from '../buttonProgress.module.scss';
import {useToast} from "@/ui/shadcn/use-toast";
import SortableList from "@/ui/admin/featured/SortableList";
import {itemsDifferCheckOrder} from "@/ui/admin/featured/utils";
import {saveFeaturedProducts} from "@/lib/actions/featured";

export default function FeaturedProductsForm({className, featuredProducts: savedFeaturedProducts}: {
    featuredProducts: ProductWithTagsAndCoverImage[],
    className?: string
}) {
    const [products, setProducts] = useState(savedFeaturedProducts)
    const [previousSavedFeaturedProducts, setPreviousSavedFeaturedProducts] = useState(savedFeaturedProducts)
    const [modalOpen, setModalOpen] = useState(false);
    const [changed, setChanged] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const {toast} = useToast();

    useEffect(() => {
        setChanged(itemsDifferCheckOrder(savedFeaturedProducts, products))
    }, [products, savedFeaturedProducts]);

    useEffect(() => {
        if (itemsDifferCheckOrder(savedFeaturedProducts, products)) {
            setButtonEnabled(true)
        } else {
            if (itemsDifferCheckOrder(previousSavedFeaturedProducts, savedFeaturedProducts)) {
                const timeoutId = setTimeout(() => {
                    setPreviousSavedFeaturedProducts(products)
                    setButtonEnabled(false)
                }, 1000) // allow animation to finish
                return () => clearTimeout(timeoutId)
            }
            else
                setButtonEnabled(false)
        }
    }, [savedFeaturedProducts, previousSavedFeaturedProducts, products, setPreviousSavedFeaturedProducts, setButtonEnabled, setChanged])

    function handleAddPress() {
        setModalOpen(true);
    }

    function handleAddModalSubmit(product: ProductWithTagsAndCoverImage) {
        if (!products.find(p => p.id === product.id)) {
            setProducts([product, ...products])
        }
        setModalOpen(false);
    }

    function handleResetPress() {
        setProducts(savedFeaturedProducts);
    }

    function handleRemove(id: number) {
        setProducts(products.filter(p => p.id !== id))
    }

    async function handleSave(_: React.MouseEvent<Element, MouseEvent>, next: (endState?: (boolean | undefined), errorLabel?: (string | null | undefined)) => void) {
        if (changed) {
            const result = await saveFeaturedProducts(products);
            if (result.success) {
                next(true)
                setChanged(false);
                setTimeout(()=>{
                    setButtonEnabled(false)
                }, 1000) // allow animation to finish
            } else {
                toast({
                    title: "Error saving products",
                    description: result.error,
                    variant: "destructive",
                    duration: 5000
                })
                next(false, "Error")
            }
        } else
            next(false, "No changes")
    }

    return (
        <div className={clsx(className, "border border-borders rounded-xl p-2 @container")}>
            <div className="flex flex-col items-center w-5/6 mx-auto">
                <p className="w-full my-2 font-bold">Drag the cards to change their order in the home page</p>
                <SortableList className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-6 w-full auto-rows-[1fr]" items={products} onItemsOrderChange={p=>setProducts(p)} onAddPress={handleAddPress}>
                    {(product, index) => (
                            <AdminFeaturedProductCard product={product} removable imgSizes="(max-width: 639px) 68vw, (max-width: 674px) 63vw, (max-width: 913px) 33vw, (max-width: 1535px) 23vw, 25vw"
                                                      onRemove={() => handleRemove(product.id)} priority={index == 0}/>
                    )}
                </SortableList>

                <div className="flex gap-2 mt-4 items-center">
                    <Button color="danger" className="w-30 h-10" onPress={handleResetPress}
                            isDisabled={!changed}>Reset</Button>
                    <AwesomeButtonProgress type="primary" disabled={!buttonEnabled} onPress={handleSave}
                                           cssModule={AwesomeButtonStyles}>Save</AwesomeButtonProgress>
                </div>
            </div>
            <AddFeaturedProductModal isOpen={modalOpen} onSubmit={handleAddModalSubmit}
                                     onClose={() => setModalOpen(false)}/>
        </div>
    )
}