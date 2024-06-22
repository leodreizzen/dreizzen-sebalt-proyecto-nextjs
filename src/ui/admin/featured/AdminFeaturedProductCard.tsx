import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import BaseFeaturedProductCard from "@/ui/cards/BaseFeaturedProductCard";
import {forwardRef, Ref} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

function AdminFeaturedProductCard({ product, className }: { product: ProductWithTagsAndCoverImage; className?: string }, ref: Ref<HTMLDivElement> | undefined){
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: product.id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <BaseFeaturedProductCard product={product} isPressable={false} className={className} showCartButton={false}/>
        </div>
    )
}

export default forwardRef(AdminFeaturedProductCard);