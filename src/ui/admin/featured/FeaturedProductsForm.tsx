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

export default function FeaturedProductsForm({className, featuredProducts: savedFeaturedProducts}: {
    featuredProducts: ProductWithTagsAndCoverImage[],
    className?: string
}) {
    const [products, setProducts] = useState(savedFeaturedProducts)
    const [modalOpen, setModalOpen] = useState(false);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        setChanged(products.length !== savedFeaturedProducts.length || products.some((product, index) => product.id !== savedFeaturedProducts[index].id))
    }, [products])

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

    async function handleSave() {
        if(changed) {
            const result = await setFeaturedProducts(products);
            if(result.success){
                setChanged(false);
            }
        }
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
                                <AdminFeaturedProductCard product={product} key={product.id}/>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
                <div className="flex gap-2 mt-2">
                    <Button color="danger" className="mt-2 w-30" onPress={handleResetPress} isDisabled={!changed}>Reset</Button>
                    <Button color="primary" className="mt-2 w-30" isDisabled={!changed} onClick={handleSave}>Save</Button>
                </div>
            </div>
            <AddFeaturedProductModal isOpen={modalOpen} onSubmit={handleAddModalSubmit}
                                     onClose={() => setModalOpen(false)}/>
        </div>
    )
}