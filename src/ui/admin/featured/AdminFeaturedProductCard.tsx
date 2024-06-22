import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import BaseFeaturedProductCard from "@/ui/cards/BaseFeaturedProductCard";
import RemoveCardButton from "@/ui/admin/RemoveCardButton";

export default function AdminFeaturedProductCard({ product, className, removable, onRemove=()=>{} }: { product: ProductWithTagsAndCoverImage; className?: string, removable?: boolean, onRemove?: ()=>void}){
    return (
        <div className="relative">
            {removable && <div className="absolute top-0 right-0 z-10">
                <RemoveCardButton className="mr-3 mt-3 w-10" onPress={onRemove}/>
            </div>}
            <BaseFeaturedProductCard product={product} isPressable={false} className={className} showCartButton={false}/>
        </div>
    )
}
