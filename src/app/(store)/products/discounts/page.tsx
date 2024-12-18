import { fetchAllTags, fetchFeaturedSales, fetchSearchPages, fetchTags } from "@/lib/data";
import FeaturedProductCard from "@/ui/cards/FeaturedProductCard";
import Pagination from "@/ui/pagination/pagination";
import SearchBoxBar from "@/ui/search/SearchBoxBar";
import SearchBoxFilters from "@/ui/search/SearchBoxFilters";
import SearchBoxList from "@/ui/search/SearchBoxList";
import { redirect } from "next/navigation";
import { fetchSearch } from "@/lib/data";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Sales",
    description: "Find our featured sales"
}

export default async function Page({ searchParams }: { searchParams: { q?: string; page?: string, filter?: string, priceRange?: string } }) {
    const currentPage = Number(searchParams?.page) || 1;
    const query = searchParams?.q || "";
    const filter = searchParams?.filter || "";

    const featuredSalesPromise = fetchFeaturedSales();
    const allTagsPromise = fetchAllTags();
    const [featuredSales, allTags] = await Promise.all([featuredSalesPromise, allTagsPromise]);
    let filterArray = filter.split(",").map((tag) => parseInt(tag));
    if (filter === "") filterArray = [];
    const filteredArray = filterArray.filter((tag) => allTags.map(genre => genre.id).includes(tag));
    if (filteredArray.toString() != filterArray.toString()) {
        redirect(`/products/discounts?filter=${filteredArray.join(",")}`);
    }

    const minPrice = 0;
    const maxPrice = 200;

    const priceRange = searchParams?.priceRange || "";
    let priceRangeArray = priceRange.split(',').map(price => parseInt(price));


    if (priceRangeArray.length != 2) {
        priceRangeArray = [minPrice, maxPrice];
    }

    const totalPagesPromise = fetchSearchPages(query, filterArray, priceRangeArray, true);
    const tagsPromise = fetchTags(query, filterArray, priceRangeArray, true);
    const productsPromise = fetchSearch(query, currentPage, filterArray, priceRangeArray, true);
    const [totalPages, tags, products] = await Promise.all([totalPagesPromise, tagsPromise, productsPromise]);

    const selectedTags = allTags.filter((tag) => filterArray.includes(tag.id));

    const hidden = totalPages === 0;
    return (
        <div className="items-center justify-center px-1">
            <h1 className="text-3xl font-bold mt-6 mb-3 text-center">Featured sales</h1>
            <div className="p-3 2xl:px-64">
                <div className="border-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-borders rounded-lg w-full p-6 xl:py-6 items-center justify-center gap-6 h-full">
                    {featuredSales.map((sale, index) => (<div key={sale.product.id} className="flex flex-col">
                                                <FeaturedProductCard key={sale.product.id} product = {sale.product} className="w-full full" priority={index == 0} imgSizes="(max-width: 449px) 78vw, (max-width: 639px) 84vw, (max-width: 767px) 87vw, (max-width: 1279px) 45vw, (max-width: 1535px) 30vw, 23vw" />
                                            </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center justify-center 2xl:w-3/4 mx-auto gap-6 mt-3 mb-3 p-0 border border-borders rounded-3xl">
                <h1 className="text-3xl font-bold text-center px-1 mt-4">All sales</h1>
                <SearchBoxBar placeholder="Buscar" />
                <div className="flex flex-col lg:flex-row w-full 2xl:w-3/4 border border-borders rounded-3xl">
                    <div className="p-6">
                        <SearchBoxFilters tags = {tags} selectedTags={selectedTags} />
                    </div>
                    <div className="flex flex-col justify-center w-full px-1">
                        <div className="w-full mr-4">
                            <SearchBoxList products={products} priority={featuredSales.length == 0}/>
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
        </div>
    )
}