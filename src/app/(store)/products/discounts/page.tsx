import { fetchFeaturedSales, fetchSalePages, fetchSearch, fetchSearchPages, fetchTags } from "@/lib/data";
import { productPlaceholders, tagPlaceholders } from "@/lib/placeholders";
import FeaturedProductCard from "@/ui/cards/FeaturedProductCard";
import Pagination from "@/ui/pagination/pagination";
import SearchBoxBar from "@/ui/search/SearchBoxBar";
import SearchBoxFilters from "@/ui/search/SearchBoxFilters";
import SearchBoxList from "@/ui/search/SearchBoxList";

export default async function Page({ searchParams }: { searchParams: { query?: string; page?: string, filter?: string, priceRange?: string } }) {
    const featuredSales = await fetchFeaturedSales();
    const currentPage = Number(searchParams?.page) || 1;
    const query = searchParams?.query || "";
    const filter = searchParams?.filter || "";
    let filterArray = filter.split(",").map((tag) => parseInt(tag));
    if (filter === "") filterArray = [];
    const priceRange = searchParams?.priceRange || "";
    let priceRangeArray = priceRange.split(',').map(price => parseInt(price));
    if (priceRangeArray.length != 2) {
        priceRangeArray = [10, 30];
    }

    const totalPages = await fetchSearchPages(query, filterArray, priceRangeArray, true);
    let hidden = false;

    if (totalPages === 0) hidden = true;

    const tags = await fetchTags();

    return (
        <div className="items-center justify-center px-1">
            <h1 className="text-3xl font-bold mt-6 mb-3 text-center">Descuentos destacados</h1>
            <div className="p-3 2xl:px-64">
                <div className="border-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border-borders rounded-lg w-full p-6 xl:py-6 items-center justify-center gap-6 h-full">
                    {featuredSales.map((sale) => (<div key={sale.product.id} className="flex flex-col">
                                                <FeaturedProductCard key={sale.product.id} product = {sale.product} className="w-full h-full" />
                                            </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center justify-center 2xl:w-3/4 mx-auto gap-6 mt-3 mb-3 p-0 border border-borders rounded-3xl">
                <h1 className="text-3xl font-bold text-center px-1 mt-4">Todos los descuentos</h1>
                <SearchBoxBar placeholder="Buscar" />
                <div className="flex flex-col lg:flex-row w-full 2xl:w-3/4 border border-borders rounded-3xl">
                    <div className="p-6">
                        <SearchBoxFilters genres = {tags} />
                    </div>
                    <div className="flex flex-col justify-center w-full px-1">
                        <div className="w-full mr-4">
                            <SearchBoxList currentPage={currentPage} query={query} filters={filterArray} priceRange={priceRangeArray} onSale={true}/>
                        </div>
                        <div className={hidden ? "hidden" : "flex justify-center mb-2"}>
                            <Pagination totalPages={totalPages} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}