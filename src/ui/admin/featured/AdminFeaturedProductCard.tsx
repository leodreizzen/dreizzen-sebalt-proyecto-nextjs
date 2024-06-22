import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import BaseFeaturedProductCard from "@/ui/cards/BaseFeaturedProductCard";

export default function AdminFeaturedProductCard({ product, className }: { product: ProductWithTagsAndCoverImage; className?: string }){
    return (
        <BaseFeaturedProductCard product={product} isPressable={false} className={className} showCartButton={false}/>
    )
}
