import { ProductWithTagsAndCoverImage } from "@/lib/definitions";
import ListCard from "@/ui/cards/ListCard";

export default async function SearchBoxList({
    products,
    imgSizes,
    priority,
  }: {
    products: ProductWithTagsAndCoverImage[];
    imgSizes?: string;
    priority?: boolean;}) {

    return (
        <div className = "w-full mt-2 mb-2 xl:px-6">
            {products.map((product, index) => (
                <ListCard key={product.id} product = {product} className = "items-center justify-center w-full gap-6 mt-3" priority={priority && index == 0}/>
            ))}
        </div>
    );
  }