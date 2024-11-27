"use client"

import {Card, CardFooter} from "@nextui-org/card";
import Image from "next/image";
import {formatPrice} from "@/util/formatUtils";
import clsx from "clsx";
import {Chip} from "@nextui-org/chip";
import AddToCartButton from "../AddToCartButton";
import MarqueeOnOverflow from "../MarqueeOnOverflow";
import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import {PressEvent} from "react-aria";
import {forwardRef, Ref} from "react";
import {currentPrice} from "@/util/productUtils";

function BaseFeaturedProductCard({product, className, isPressable, onPress, showCartButton, imgSizes, priority}: {
    product: ProductWithTagsAndCoverImage;
    className?: string,
    isPressable: boolean,
    showCartButton: boolean
    onPress?: ((e: PressEvent) => void) | undefined,
    imgSizes?: string
    priority?: boolean
}, ref: Ref<HTMLDivElement> | undefined) {
    return (
        <div className={clsx("gap-3 @container", className)} ref={ref}>
            <Card className={"w-full h-full"} onPress={onPress} isPressable={isPressable}>
                <div className="gap-3 aspect-video h-full w-full select-none relative">
                    <Image src={product.coverImage.url} alt={product.coverImage.alt} fill={true} sizes={imgSizes} priority={priority}/>
                </div>
                <CardFooter className="bg-black/60 border-default-600 dark:border-default-100 h-1/6 p-3 px-5 bg-content1">
                    <div className="flex flex-grow gap-2 items-center min-w-0 mr-1">
                        <div className="flex flex-col justify-start items-start min-w-0 flex-grow">
                            <div className="flex flex-wrap gap-2 h-[30px] overflow-y-hidden mt-1 flex-grow">
                                {product.tags.map((tag) => (
                                    <Chip key={tag.order} size="md" color="primary"
                                          className="text-white text-tiny @2xl:text-sm">{tag.tag.name}</Chip>
                                ))}
                            </div>
                            <div className="w-full oveflow-clip flex-grow @2xl:mt-1">
                                <MarqueeOnOverflow className="w-full" direction="horizontal"
                                                   animation={["animate-marqueeX", "animate-marqueeX2"]}>
                                    <p className="text-white font-bold text-large @sm:text-xl @md:text-2xl @xl:text-3xl text-start text-nowrap mx-1 pb-[0.1rem]">{product.name}</p>
                                </MarqueeOnOverflow>
                            </div>
                        </div>
                    </div>
                    <p className="text-white mr-4 sm:text-medium">{
                        <s>{product.originalPrice_cents != currentPrice(product) ?
                            <s>{formatPrice(product.originalPrice_cents)}<br/></s> : null}</s>}{formatPrice(currentPrice(product))}</p>
                    {showCartButton && <AddToCartButton className="text-black pr-1 flex-shrink-0" product={product}
                                                        textClassName="hidden @lg:block"/>}
                </CardFooter>
            </Card>
        </div>

    )
}

export default forwardRef(BaseFeaturedProductCard);