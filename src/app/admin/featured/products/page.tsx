import FeaturedProductsForm from "@/ui/admin/featured/products/FeaturedProductsForm";
import {fetchFeaturedProducts, fetchFeaturedSales} from "@/lib/data";

export default async function FeaturedProductsAdminPage() {
    const featuredProducts = await fetchFeaturedProducts()
    const sortedProducts = featuredProducts.sort((a, b) => a.order - b.order).map(product => product.product)
    return (
        <div className="flex flex-col">
            <h1 className="font-bold text-large text-center">Featured products</h1>
            <FeaturedProductsForm featuredProducts={sortedProducts}/>
        </div>
    )
}