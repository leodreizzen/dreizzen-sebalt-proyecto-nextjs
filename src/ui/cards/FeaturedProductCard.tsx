"use client"

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { formatPrice } from "@/util/formatUtils";
import { ProductDTO } from "@/lib/DTO";
import clsx from "clsx";
import { Chip } from "@nextui-org/chip";
import AddToCartButton from "../AddToCartButton";
import { useRouter } from "next/navigation";
import MarqueeOnOverflow from "../MarqueeOnOverflow";

export default function FeaturedProductCard({ product, className }: { product: ProductDTO, className?: string }) {
    const router = useRouter();
    function handleCardPress() {
        router.push(`/product/${product.id}`)
    }
    return (
        <>
            <div className={clsx("gap-3 @container", className)}>
                <Card className={"w-full h-full"} onPress={handleCardPress} isPressable isFooterBlurred>
                    <CardBody className="gap-3 aspect-video">
                        <Image src={product.coverImage.url} alt={product.coverImage.alt} fill={true} />
                    </CardBody>
                    <CardFooter className="bg-content-1 border-default-600 dark:border-default-100 h-1/6 p-3 px-5">
                        <div className="flex flex-grow gap-2 items-center min-w-0 mr-1">
                            <div className="flex flex-col justify-start items-start min-w-0 flex-grow">
                                <div className="flex flex-wrap gap-2 h-[30px] overflow-y-hidden mt-1 flex-grow">
                                    <Chip size="md" color="primary" className="text-white text-tiny @2xl:text-sm">Deportes</Chip>
                                    <Chip size="md" color="primary" className="text-white text-tiny @2xl:text-sm">Futbol</Chip>
                                    <Chip size="md" color="primary" className="text-white text-tiny @2xl:text-sm">Femenino</Chip>
                                </div>
                                <div className="w-full oveflow-clip flex-grow @2xl:mt-1">
                                    <MarqueeOnOverflow className="w-full" direction="horizontal" animation={["animate-marqueeX", "animate-marqueeX2"]}>
                                        <p className="text-white font-bold text-large @sm:text-xl @md:text-2xl @xl:text-3xl text-start text-nowrap mx-1 pb-[0.1rem]">{product.name}</p>
                                    </MarqueeOnOverflow>
                                </div>
                            </div>
                        </div>
                        <p className="text-white mr-4 sm:text-large">{formatPrice(product.currentPrice_cents)}</p>
                        <AddToCartButton className="text-black pr-1 flex-shrink-0" product={product} textClassName="hidden @lg:block" />
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}
