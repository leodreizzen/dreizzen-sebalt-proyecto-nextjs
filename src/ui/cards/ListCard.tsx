"use client"

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { formatPrice } from "@/util/formatUtils";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Chip } from "@nextui-org/chip";
import AddToCartButton from "../AddToCartButton";
import MarqueeOnOverflow from "../MarqueeOnOverflow";
import { ProductWithTagsAndCoverImage } from "@/lib/definitions";

export default function ListCard({ product, className }: { product: ProductWithTagsAndCoverImage, className?: string }) {
    const router = useRouter();

    function handleCardPress() {
        router.push(`/product/${product.id}`)
    }

    return (
        <div className={clsx("@container", className)}>
            <Card
                isPressable
                className={clsx("size-full border-solid border-borders border-1 rounded-lg bg-content-1 dark:bg-content-1 text-white @2xs:h-20")}
                shadow="sm"
                onPress={handleCardPress}
            >
                <CardBody className="px-0 py-0 size-full flex overflow-clip flex-col @2xs:flex-row items-center">
                    <div className="relative col-span-4 md:col-span-3 w-7/12 @2xs:w-[revert] @2xs:h-full aspect-video mt-2 mb-1 @2xs:my-0">
                        <Image
                            alt={product.coverImage.alt}
                            className="object-cover rounded-lg select-none"
                            src={product.coverImage.url}
                            fill
                        />
                    </div>
                    <div className="flex-grow ml-2 min-w-0 grid grid-cols-[1fr_auto] grid-rows-[1fr_min-content_min-content] grid-flow-col p-1 @xs:p-0 @xd:ml-0 @xs:mr-2">
                        <div className="self-end flex flex-wrap overflow-clip gap-x-2 overflow-y-hidden h-5 mb-1 justify-center @xs:justify-start @xs:row-span-2">
                            {product.tags.map((tag) => (
                                <Chip key={tag.order} size="sm" color="primary" className="text-white" classNames={{ base: "py-0 h-5", content: "text-tiny" }}>{tag.tag.name}</Chip>
                            ))}
                        </div>
                        <MarqueeOnOverflow animation={["animate-marqueeX", "animate-marqueeX2"]} direction="horizontal" className="row-start-2 @xs:row-start-3 justify-center @xs:justify-start @xs:items-center @xs:mr-2">
                            <p className="text-tiny sm:text-medium font-bold text-nowrap">{product.name}</p>
                        </MarqueeOnOverflow>
                        <div className="flex items-center flex-shrink-0 row-start-3 justify-center @xs:row-start-2 @xs:row-span-2 @xs:items-center">
                            <div className="col-span-3 md:col-span-3 mr-2">
                                <p className="text-tiny md:text-md font-bold text-right">{<s>{ product.originalPrice_cents != product.currentPrice_cents ? <s>{formatPrice(product.originalPrice_cents)}<br /></s> : null }</s>}{formatPrice(product.currentPrice_cents)}</p>
                            </div>
                            <AddToCartButton className="text-black hidden @xs:flex mr-1" textClassName="hidden @xl:block" product={product}/>
                        </div>
                    </div>

                </CardBody>
            </Card>
        </div>
    )
}