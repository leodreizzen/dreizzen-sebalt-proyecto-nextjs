import SearchBoxBar from "@/ui/search/SearchBoxBar";
import SearchBoxFilters from "@/ui/search/SearchBoxFilters";
import SearchBoxList from "@/ui/search/SearchBoxList";
import Pagination from "@/ui/pagination/pagination";
import {notFound, redirect} from "next/navigation";
import { fetchSearch, fetchAllTags, fetchSearchPages, fetchTags } from "@/lib/data";
import type {Metadata} from "next";
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({searchParams}: Props): Promise<Metadata> {
   const q = (await searchParams).q;
   if(q && q.length > 0) {
         return {
              title: `Search "${q}"`,
              description: `Search products for "${q}"`
         }
   }
   else
        return {
            title: `Search`,
            description: `Search products`
        }
}

 
export default async function Page({ searchParams }: { searchParams: { q?: string; page?: string, filter?: string, priceRange?: string, onSale?: string } }) {
    const currentPage = Number(searchParams?.page) || 1;
    const query = searchParams?.q || "";
    const filter = searchParams?.filter || "";
    const sale = searchParams?.onSale || "";

    let saleBoolean
    if (sale != "") {
        saleBoolean = sale === "true"
    } else {
        saleBoolean = false
    }

    const allTags = await fetchAllTags();

    let filterArray = filter.split(",").map((tag) => parseInt(tag));
    if (filter === "") filterArray = [];
    const filteredArray = filterArray.filter((tag) => allTags.map(genre => genre.id).includes(tag));
    if (filteredArray.toString() != filterArray.toString()) {
        redirect(`/products/discounts?filter=${filteredArray.join(",")}`);
    }

    const priceRange = searchParams?.priceRange || "";
    let priceRangeArray = priceRange.split(',').map(price => parseInt(price));

    const minPrice = 0;
    const maxPrice = 200;

    if (priceRangeArray.length != 2) {
        priceRangeArray = [minPrice, maxPrice];
    }


    const totalPages = await fetchSearchPages(query, filterArray, priceRangeArray, saleBoolean);
    let hidden = false;

    if (totalPages === 0) hidden = true;

    const tags = await fetchTags(query, filterArray, priceRangeArray, saleBoolean);

    const selectedTags = allTags.filter((tag) => filterArray.includes(tag.id));

    const products = await fetchSearch(query, currentPage, filterArray, priceRangeArray, saleBoolean);

    return (
        <div className="flex flex-col items-center justify-center 2xl:w-3/4 mx-auto gap-6 mt-3 mb-3 p-0 border border-borders rounded-3xl">
                <h1 className="text-3xl font-bold text-center px-1 mt-4">Search results</h1>
                <SearchBoxBar placeholder="Buscar" />
                <div className="flex flex-col lg:flex-row w-full 2xl:w-3/4 border border-borders rounded-3xl">
                    <div className="p-6">
                        <SearchBoxFilters tags = {tags} selectedTags={selectedTags} />
                    </div>
                    <div className="flex flex-col justify-center w-full px-1">
                        <div className="w-full mr-4">
                            <SearchBoxList products={products} />
                        </div>
                        <div className={hidden ? "hidden" : "flex justify-center mb-2"}>
                            <Pagination totalPages={totalPages} />
                        </div>
                        <div className={hidden ? "flex justify-center mb-2" : "hidden"}>
                            <p>No results.</p>
                        </div>
                    </div>
                </div>
        </div>
    )
}