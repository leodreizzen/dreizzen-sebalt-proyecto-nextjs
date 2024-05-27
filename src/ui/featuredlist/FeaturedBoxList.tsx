import FeaturedProductCard from "../cards/FeaturedProductCard";
import ListCard from "../cards/ListCard";
import { productPlaceholders } from "@/data/placeholders";

export default async function FeaturedBoxList({
    currentPage,
  }: {
    currentPage: number;
  }) {
    /* Cambiar por el fetch de la base de datos */
    let products = productPlaceholders.concat(productPlaceholders).concat(productPlaceholders).concat(productPlaceholders).concat(productPlaceholders).concat(productPlaceholders);
    products = products.map(product => ({ ...product }));
    products.forEach((product, index) => product.id = index + 1);
    if (currentPage === 1) products.splice(0, 6);
    else products.splice(6, 6);
  
    return (
            <div className = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 rounded-lg w-full p-6 items-center justify-center gap-6 h-full">
                {products.map(product => (<div key = {product.id} className = "flex flex-col">
                                            <FeaturedProductCard key={product.id} product = {product} className = "w-full h-full" />
                                          </div>
                ))}
            </div>
    );
  }