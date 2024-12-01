import {fetchProductPages, fetchProducts} from "@/lib/data";
import ProductTable from "@/ui/admin/products/ProductTable";
import SearchBoxBar from "@/ui/search/SearchBoxBar";
import Pagination from "@/ui/pagination/pagination";
import {Button} from "@nextui-org/button";
import Link from "next/link";
import {Metadata} from "next";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata({searchParams}: Props): Promise<Metadata> {
    const q = (await searchParams).q
    if (q && q.length > 0)
        return {
            title: "Products",
            description: `Manage products - search by "${q}"`,
        }
    return {
        title: "Products",
        description: "Manage products",
    }
}

export default async function AdminProductsPage({searchParams}: { searchParams: { page?: string, q?: string } }) {
    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
    const query = searchParams.q || ""

    const productsPromise = fetchProducts(currentPage, query);
    const totalPagesPromise = fetchProductPages(query);

    const [products, totalPages] = await Promise.all([productsPromise, totalPagesPromise]);

    let hidden = false;

    if (totalPages === 0) hidden = true;


    return (
        <div className={"justify-center items-center flex flex-col"}>
            <h1 className={"text-white mb-2 text-2xl"}>All products</h1>
            <p className={"text-white mb-2"}>
                Here you can manage all the products in the store.
            </p>
            <div className={"flex flex-col w-full justify-center items-center"}>
                <div className={"mb-2 flex flex-col justify-center items-center"}>
                    <SearchBoxBar placeholder={"Search products"}/>
                    <Link href={"/admin/products/add"}>
                        <Button className={"mt-2"}>Add product</Button>
                    </Link>
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