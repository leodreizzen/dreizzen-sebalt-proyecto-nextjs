import {fetchProducts} from "@/lib/data";
import ProductTable from "@/ui/admin/products/ProductTable";

export default async function AdminProductsPage({ searchParams }: { searchParams: { page?: string } }){
    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1

    const products = await fetchProducts(currentPage)

    return (
        <div className={"justify-center items-center flex flex-col"}>
            <h1 className={"text-white mb-2"}>Admin Products</h1>
            <div className={"flex flex-col w-full justify-center items-center"}>
                <ProductTable products={products} />
            </div>
        </div>
    )
}