import {fetchFeaturedSales} from "@/lib/data";
import FeaturedSalesForm from "@/ui/admin/featured/sales/FeaturedSalesForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Featured sales",
    description: "Manage featured sales"
}

export default async function AdminFeaturedSalesPage() {
    const featuredSales = await fetchFeaturedSales()
    return (
        <div className="flex flex-col">
            <h1 className="font-bold text-large text-center">Featured sales</h1>
            <FeaturedSalesForm featuredSales={featuredSales}/>
        </div>
    )
}