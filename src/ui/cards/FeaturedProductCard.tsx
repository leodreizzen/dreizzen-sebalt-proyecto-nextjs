"use client"

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";
import { formatPrice } from "@/util/formatUtils";
import { ProductDTO } from "@/data/DTO";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import {usePress} from "@react-aria/interactions";
import { useRef } from "react";

export default function FeaturedProductCard({ product, className }: { product: ProductDTO, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const {pressProps} = usePress({
        ref,
        onPress: handleCartPress
    })
    const router = useRouter();

    function handleCartPress(){
        alert("Added to cart")
    }

    function handleCardPress() {
        router.push(`/product/${product.id}`)
    }

    //TODO: Agregar chips por género.
    return (
        <>
        <div className={clsx("gap-3", className)}>
        <Card className={clsx(className)} onPress={handleCardPress} isPressable >
            <CardBody className="gap-3">
                <Image src={product.coverImage.url} alt={product.coverImage.alt} fill={true}/>
            </CardBody>
            <CardFooter className="bg-content-1 border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-2 items-center">
                    <div className="flex flex-col">
                        <p className="text-white font-bold text-xl">{product.name}</p>
                    </div>
                </div>
                <p className="text-white mr-4">{formatPrice(product.currentPrice_cents)}</p>
                <div className="flex bg-green-300 p-2 hover:bg-green-400 active:bg-green-600 rounded-lg items-center" {...pressProps} ref={ref}>
                    <ShoppingCartIcon className="text-black pr-1" />
                    <p className="text-sm">Agregar al carrito</p>
                </div>
            </CardFooter>
       </Card>
       </div>
       </>
    )
}
