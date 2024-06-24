import { fetchMostSold, fetchMostSoldPages } from "@/lib/data";
import FeaturedBoxList from "@/ui/featuredlist/FeaturedBoxList";
import Pagination from "@/ui/pagination/pagination";

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {

    const currentPage = searchParams.page ? Number(searchParams.page) : 1;


    const totalPages = await fetchMostSoldPages();
    let hidden = false;

    if (totalPages === 0) hidden = true;

    const products = await fetchMostSold(currentPage);

    return (
        <div className="items-center justify-center px-1">
            <h1 className="text-3xl font-bold mt-6 mb-3 text-center">Productos más vendidos</h1>
            <div className="p-3 2xl:px-64">
                <FeaturedBoxList products={products} />
                <div className={hidden ? "hidden" : "flex justify-center mt-2"}>
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    )
}