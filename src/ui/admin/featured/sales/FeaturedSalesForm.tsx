"use client"
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {ProductSaleWithProduct} from "@/lib/definitions";
import React, {useEffect, useState} from "react";
import AdminFeaturedProductCard from "@/ui/admin/featured/AdminFeaturedProductCard";
import {saveFeaturedSales} from "@/lib/actions";
import {AwesomeButtonProgress} from "@leodreizzen/react-awesome-button";
import '@leodreizzen/react-awesome-button/dist/styles.css';
import AwesomeButtonStyles from '../buttonProgress.module.scss';
import {useToast} from "@/ui/shadcn/use-toast";
import {itemsDifferIgnoreOrder} from "@/ui/admin/featured/utils";
import {IoMdAddCircle} from "react-icons/io";
import AddFeaturedSaleModal from "@/ui/admin/featured/sales/AddFeaturedSaleModal";
import {MAX_FEATURED_SALES} from "@/lib/config";

export default function FeaturedSalesForm({className, featuredSales: savedFeaturedSales}: {
    featuredSales: ProductSaleWithProduct[],
    className?: string
}) {
    const [sales, setSales] = useState(savedFeaturedSales)
    const [previousSavedFeaturedSales, setPreviousSavedFeaturedSales] = useState(savedFeaturedSales)
    const [modalOpen, setModalOpen] = useState(false);
    const [changed, setChanged] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const {toast} = useToast();

    useEffect(() => {
        setChanged(itemsDifferIgnoreOrder(savedFeaturedSales, sales))

    }, [sales, savedFeaturedSales]);

    useEffect(() => {
        if (itemsDifferIgnoreOrder(savedFeaturedSales, sales)) {
            setButtonEnabled(true)
        } else {
            if (itemsDifferIgnoreOrder(previousSavedFeaturedSales, savedFeaturedSales)) {
                const timeoutId = setTimeout(() => {
                    setPreviousSavedFeaturedSales(sales)
                    setButtonEnabled(false)
                }, 1000) // allow animation to finish
                return () => clearTimeout(timeoutId)
            }
            else
                setButtonEnabled(false)
        }
    }, [savedFeaturedSales, previousSavedFeaturedSales, sales, setPreviousSavedFeaturedSales, setButtonEnabled, setChanged])

    function handleAddPress() {
        setModalOpen(true);
    }

    function handleAddModalSubmit(sale: ProductSaleWithProduct) {
        if (!sales.find(s => s.id === sale.id)) {
            setSales([sale, ...sales])
        }
        setModalOpen(false);
    }

    function handleResetPress() {
        setSales(savedFeaturedSales);
    }

    function handleRemove(id: number) {
        setSales(sales.filter(p => p.id !== id))
    }

    async function handleSave(_: React.MouseEvent<Element, MouseEvent>, next: (endState?: (boolean | undefined), errorLabel?: (string | null | undefined)) => void) {
        if (changed) {
            const result = await saveFeaturedSales(sales);
            if (result.success) {
                next(true)
                setChanged(false);
                setTimeout(()=>{
                    setButtonEnabled(false)
                }, 1000) // allow animation to finish
            } else {
                toast({
                    title: "Error saving sales",
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
                <div className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-6 w-full auto-rows-[1fr]">
                    {sales.length < MAX_FEATURED_SALES && <Button onPress={handleAddPress}
                                                                  className={clsx("border border-borders rounded-2xl flex flex-col items-center justify-center bg-transparent [&>svg]:max-w-none", sales.length === 0 ? "h-60 sm:h-44 2xl:h-64" : "!h-[revert]")}>
                        <IoMdAddCircle className="h-1/2 w-1/2 text-foreground"/>
                    </Button>
                    }
                    {sales.map((sale, index) => (
                            <AdminFeaturedProductCard product={sale.product} removable key={sale.id}
                                                      onRemove={() => handleRemove(sale.id)}/>
                    ))}
                </div>

                <div className="flex gap-2 mt-4 items-center">
                    <Button color="danger" className="w-30 h-10" onPress={handleResetPress}
                            isDisabled={!changed}>Reset</Button>
                    <AwesomeButtonProgress type="primary" disabled={!buttonEnabled} onPress={handleSave}
                                           cssModule={AwesomeButtonStyles}>Save</AwesomeButtonProgress>
                </div>
            </div>
            <AddFeaturedSaleModal isOpen={modalOpen} onSubmit={handleAddModalSubmit}
                                     onClose={() => setModalOpen(false)}/>
        </div>
    )
}