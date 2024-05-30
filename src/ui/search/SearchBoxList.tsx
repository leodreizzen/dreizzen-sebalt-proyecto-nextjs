import { productPlaceholders } from "@/lib/placeholders";
import ListCard from "@/ui/cards/ListCard";

export default async function SearchBoxList({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
    /* Cambiar por el fetch de la base de datos */
    let products = productPlaceholders.concat(productPlaceholders).concat(productPlaceholders);
    products = products.map(product => ({ ...product }));
    products.forEach((product, index) => product.id = index + 1);
    if (currentPage === 1) products.splice(0, 3);
    else products.splice(3, 3);
  
    return (
        <div className = "w-full mt-2 mb-2 xl:px-6">
            {products.map(product => (
                <ListCard key={product.id} product = {product} className = "items-center justify-center w-full gap-6 mt-3"/>
            ))}
        </div>
    );
  }