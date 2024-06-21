import {fetchProductPages, fetchProducts} from "@/lib/data";
import ProductTable from "@/ui/admin/products/ProductTable";
import SearchBoxBar from "@/ui/search/SearchBoxBar";
import Pagination from "@/ui/pagination/pagination";

export default async function AdminProductsPage({ searchParams }: { searchParams: { page?: string, q?: string } }){
    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
    const query = searchParams.q || ""

    const products = await fetchProducts(currentPage, query)

    const totalPages = await fetchProductPages(query);

    let hidden = false;

    if (totalPages === 0) hidden = true;

    return (
        <div className={"justify-center items-center flex flex-col"}>
            <h1 className={"text-white mb-2 text-2xl"}>All products</h1>
            <p className={"text-white mb-2"}>
                Here you can see all the products in the store.
            </p>
            <div className={"flex flex-col w-full justify-center items-center"}>
                <div className={"mb-2"}>
                    <SearchBoxBar placeholder={"Search products"}/>
                </div>
                <ProductTable products={products}/>
                <div className={hidden ? "hidden" : "flex justify-center mb-2 mt-2"}>
                    <Pagination totalPages={totalPages}/>
                </div>
                <div className={hidden ? "flex justify-center mb-2" : "hidden"}>
                    <p>No hay resultados.</p>
                </div>
            </div>
        </div>
    )
}