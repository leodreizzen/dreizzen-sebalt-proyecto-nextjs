import {fetchFeaturedSales} from "@/lib/data";
import FeaturedSalesForm from "@/ui/admin/featured/sales/FeaturedSalesForm";

export default async function AdminFeaturedSalesPage() {
    const featuredSales = await fetchFeaturedSales()
    return (
        <div className="flex flex-col">
            <h1 className="font-bold text-large text-center">Featured products</h1>
            <FeaturedSalesForm featuredSales={featuredSales}/>
        </div>
    )
}