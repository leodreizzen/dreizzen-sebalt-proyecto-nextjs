import { ProductWithTagsAndCoverImage } from "@/lib/definitions";
import ListCard from "@/ui/cards/ListCard";

export default async function SearchBoxList({
    products
  }: {
    products: ProductWithTagsAndCoverImage[];}) {

    return (
        <div className = "w-full mt-2 mb-2 xl:px-6">
            {products.map(product => (
                <ListCard key={product.id} product = {product} className = "items-center justify-center w-full gap-6 mt-3"/>
            ))}
        </div>
    );
  }