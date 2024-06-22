import FeaturedProductsForm from "@/ui/admin/featured/FeaturedProductsForm";
import {fetchFeaturedProducts} from "@/lib/data";

export default async function FeaturedProductsPage() {
    const featuredProducts = await fetchFeaturedProducts()
    const sortedProducts = featuredProducts.sort((a, b) => a.order - b.order).map(product => product.product)
    return (
        <div className="flex flex-col">
            <h1 className="font-bold text-large text-center">Featured products</h1>
            <FeaturedProductsForm featuredProducts={sortedProducts}/>
        </div>
    )
}