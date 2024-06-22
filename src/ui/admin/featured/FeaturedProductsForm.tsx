"use client"
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import React, {useEffect, useState} from "react";
import AdminFeaturedProductCard from "@/ui/admin/featured/AdminFeaturedProductCard";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {IoMdAddCircle} from "react-icons/io";

import AddFeaturedProductModal from "@/ui/admin/featured/AddFeaturedProductModal";
import {setFeaturedProducts} from "@/lib/actions";
import Draggable from "@/ui/Draggable";
import {AwesomeButtonProgress} from "@leodreizzen/react-awesome-button";
import '@leodreizzen/react-awesome-button/dist/styles.css';
import AwesomeButtonStyles from './buttonProgress.module.scss';
import {useToast} from "@/ui/shadcn/use-toast";

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
    function productsDiffer(p1: { id: number }[], p2: { id: number }[]): boolean {
        return p1.length !== p2.length || p1.some((product, index) => product.id !== p2[index].id)
    }

    useEffect(() => {
        if (productsDiffer(savedFeaturedProducts, products)) {
            setChanged(true)
            setButtonEnabled(true)
        } else {
            setChanged(false)
            if (productsDiffer(previousSavedFeaturedProducts, products)) {
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

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if (!over) return;
        if (active.id !== over.id) {
            setProducts((featured) => {
                const oldIndex = featured.findIndex(f => f.id === active.id);
                const newIndex = featured.findIndex(f => f.id === over.id);
                if (oldIndex === undefined || newIndex === undefined) return featured;

                return arrayMove(featured, oldIndex, newIndex);
            });
        }
    }

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

    async function handleSave(_: React.MouseEvent<Element, MouseEvent>, next: (endState?: (boolean | undefined), errorLabel?: (string | null | undefined)) => void) {
        if (changed) {
            const result = await setFeaturedProducts(products);
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
        <div className={clsx(className, "border border-borders rounded-xl p-2")}>
            <div className="flex flex-col items-center w-5/6 mx-auto">
                <p className="w-full my-2 font-bold">Drag the cards to change their order in the home page</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full auto-rows-[1fr]">
                    <Button onPress={handleAddPress}
                            className="border border-borders rounded-2xl flex flex-col items-center !h-[revert] justify-center bg-transparent [&>svg]:max-w-none">
                        <IoMdAddCircle className="h-1/2 w-1/2 text-foreground"/>
                    </Button>
                    <DndContext onDragEnd={handleDragEnd}>
                        <SortableContext items={products.map(p => ({...p, id: p.id}))}>
                            {products.map((product) => (
                                <Draggable id={product.id} key={product.id}>
                                    <AdminFeaturedProductCard product={product}/>
                                </Draggable>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
                <div className="flex gap-2 mt-2 items-center">
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