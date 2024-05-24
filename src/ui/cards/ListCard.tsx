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
import { Chip } from "@nextui-org/chip";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";

export default function ListCard({ product, className }: { product: ProductDTO, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const { pressProps } = usePress({
        ref,
        onPress: handleCartPress
    })

    function handleCartPress() {
        alert("Added to cart")
    }

    const router = useRouter();

    function handleCardPress() {
        router.push(`/product/${product.id}`)
    }

    return (
        <div className={clsx("h-20", className)}>
            <Card
                
                isPressable
                className={clsx("size-full border-solid border-borders border-1 rounded-lg bg-content-1 dark:bg-content-1 text-white")}
                shadow="sm"
                onPress={handleCardPress}
            >
                <CardBody className="px-0 pr-2 py-0 size-full flex overflow-clip flex-row">
                    <div className="relative col-span-4 md:col-span-3 h-full aspect-video">
                        <Image
                            alt={product.coverImage.alt}
                            className="object-cover rounded-none"
                            src={product.coverImage.url}
                            fill
                        />
                    </div>
                    <div className="flex justify-between h-full flex-grow ml-2 gap-1">
                        <div className="flex flex-col my-auto gap-1">
                            <div className="flex flex-wrap overflow-clip gap-x-2 overflow-y-hidden h-5">
                                <Chip size="sm" color="primary" className="text-white" classNames={{ base: "py-0 h-5", content: "text-tiny" }}>Deportes</Chip>
                                <Chip size="sm" color="primary" className="text-white" classNames={{ base: "py-0 h-5", content: "text-tiny" }}>Futbol</Chip>
                                <Chip size="sm" color="primary" className="text-white" classNames={{ base: "py-0 h-5", content: "text-tiny" }}>Femenino</Chip>
                            </div>
                            <p className="text-tiny sm:text-medium font-bold text-left">{product.name}</p>
                        </div>
                        <div className="flex items-center">
                            <div className="col-span-3 md:col-span-3 mr-2">
                                <p className="text-tiny md:text-md font-bold text-right">{formatPrice(product.currentPrice_cents)}</p>
                            </div>
                            <div className="flex bg-green-300 p-2 hover:bg-green-400 active:bg-green-600 rounded-lg items-center justify-center " {...pressProps} ref={ref}>
                                <ShoppingCartIcon className="text-black pr-1" />
                            </div>

                        </div>
                    </div>

                </CardBody>
            </Card>
        </div>
    )
}