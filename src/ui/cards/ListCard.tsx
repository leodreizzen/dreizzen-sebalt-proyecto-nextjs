"use client"

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { ProductDTO } from "@/data/DTO";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { formatPrice } from "@/util/formatUtils";
import { useRouter } from "next/navigation";
import { usePress } from "@react-aria/interactions";
import { useRef } from "react";
import { clsx } from "clsx";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";

export default function ListCard({ product, className }: {product: ProductDTO, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const {pressProps} = usePress({
        ref,
        onPress: handleCartPress
    })

    function handleCartPress(){
        alert("Added to cart")
    }


    const router = useRouter();

    function handleCardPress() {
        router.push(`/product/${product.id}`)
    }

    /*"border-none bg-white dark:bg-white max-w-[610px]"*/

    return(
        <div className={clsx(className)}>
        <Card
        isPressable
        className= {clsx("border-none bg-content-1 dark:bg-content1 max-w-[610px] text-white", className)} 
        shadow="sm"
        onPress={handleCardPress}
        >
            <CardBody className="items-center justify-center">
            <div className="grid flex grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                <div className="relative col-span-2 md:col-span-3">
                    <Image
                        alt = {product.coverImage.alt}
                        className="object-cover rounded-lg"
                        src={product.coverImage.url}
                        width = {150}
                        height = {150}
                    />
                </div>
                <div className="col-span-2 md:col-span-4">
                    <p className="text-sm md:text-md font-bold text-left">{product.name}</p>
                </div>
                <div className="col-span-1 md:col-span-4">
                    <p className="text-sm md:text-md font-bold text-right">{formatPrice(product.currentPrice_cents)}</p>
                </div>
                <div className="col-span-1 md:col-span-1">
                    <div className="flex bg-green-300 p-2 hover:bg-green-400 active:bg-green-600 rounded-lg items-center justify-center" {...pressProps} ref={ref}>
                        <ShoppingCartIcon className="text-black pr-1" />
                    </div>
                </div>
            </div>
            </CardBody>
        </Card>
        </div>
    )
}