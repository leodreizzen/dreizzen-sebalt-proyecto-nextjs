"use client"

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import { formatPrice } from "@/util/formatUtils";
import { ProductDTO } from "@/data/DTO";
import clsx from "clsx";
import { Chip } from "@nextui-org/chip";
import AddToCartButton from "../AddToCartButton";
import { useRouter } from "next/navigation";

export default function FeaturedProductCard({ product, className }: { product: ProductDTO, className?: string }) {
    const router = useRouter();
    function handleCardPress() {
        router.push(`/product/${product.id}`)
    }
    
    return (
        <>
        <div className={clsx("gap-3", className)}>
        <Card className={"w-full h-full"} onPress={handleCardPress} isPressable isFooterBlurred>
            <CardBody className="gap-3 aspect-video">
                <Image src={product.coverImage.url} alt={product.coverImage.alt} fill={true}/>
            </CardBody>
            <CardFooter className="bg-content-1 border-default-600 dark:border-default-100 h-1/6">
                <div className="flex flex-grow gap-2 items-center">
                    <div className="flex flex-col justify-start items-start">
                        <div className="flex gap-2">
                            <Chip size="md" color="primary" className="text-white">Deportes</Chip>
                            <Chip size="md" color="primary" className="text-white">Futbol</Chip>
                            <Chip size="md" color="primary" className="text-white">Femenino</Chip>
                        </div>
                        <p className="text-white font-bold text-4xl mt-1">{product.name}</p>
                    </div>
                </div>
                <p className="text-white mr-4 text-large">{formatPrice(product.currentPrice_cents)}</p>
                <AddToCartButton/>

            </CardFooter>
       </Card>
       </div>
       </>
    )
}
