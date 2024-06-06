import FeaturedProductCard from "../cards/FeaturedProductCard";
import { ProductWithTagsAndCoverImage } from "@/lib/definitions";

export default function FeaturedBoxList({
    products
  }: {
    products: ProductWithTagsAndCoverImage[];
  }) {

  
    return (
            <div className = "border-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-borders rounded-lg w-full p-6 xl:py-6 items-center justify-center gap-6 h-full">
                {products.map(product => (<div key = {product.id} className = "flex flex-col">
                                            <FeaturedProductCard key={product.id} product = {product} className = "w-full h-full" />
                                          </div>
                ))}
            </div>
    );
  }