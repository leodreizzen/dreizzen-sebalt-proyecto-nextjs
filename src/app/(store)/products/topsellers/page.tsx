import { fetchMostSold, fetchMostSoldPages } from "@/lib/data";
import FeaturedBoxList from "@/ui/featuredlist/FeaturedBoxList";
import Pagination from "@/ui/pagination/pagination";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Top sellers",
    description: "Find the most sold products"
}

export default async function TopSellersPage({ searchParams }: { searchParams: { page?: string } }) {

    const currentPage = searchParams.page ? Number(searchParams.page) : 1;

    const totalPagesPromise = fetchMostSoldPages();
    const productsPromise = fetchMostSold(currentPage);
    const [totalPages, products] = await Promise.all([totalPagesPromise, productsPromise]);

    let hidden = false;
    if (totalPages === 0) hidden = true;

    return (
        <div className="items-center justify-center px-1">
            <h1 className="text-3xl font-bold mt-6 mb-3 text-center">Top sellers</h1>
            <div className="p-3 2xl:px-[calc(35%-22rem)]">
                <FeaturedBoxList products={products} imgSizes="(max-width: 639px) 79vw, (max-width: 767px) 82vw, (max-width: 1279px) 44vw, (max-width: 1535px) 25vw, 20vw" priority/>
                <div className={hidden ? "hidden" : "flex justify-center mt-2"}>
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    )
}