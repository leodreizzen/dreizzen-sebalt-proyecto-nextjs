"use client"

import { useRouter } from "next/navigation";
import { ProductWithTagsAndCoverImage } from "@/lib/definitions";
import BaseFeaturedProductCard from "@/ui/cards/BaseFeaturedProductCard";

export default function FeaturedProductCard({ product, className, imgSizes, priority }: { product: ProductWithTagsAndCoverImage; className?: string, imgSizes?: string, priority?: boolean }) {
    const router = useRouter();
    function handleCardPress() {
        router.push(`/product/${product.id}`)
    }
    return (
        <BaseFeaturedProductCard product={product} isPressable={true} onPress={handleCardPress} className={className} showCartButton={true} imgSizes={imgSizes} priority={priority}/>
    )
}
