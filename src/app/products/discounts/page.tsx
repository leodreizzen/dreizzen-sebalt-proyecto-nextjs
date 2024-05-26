import { productPlaceholders, tagPlaceholders } from "@/data/placeholders";
import FeaturedProductCard from "@/ui/cards/FeaturedProductCard";
import ListCard from "@/ui/cards/ListCard";
import Pagination from "@/ui/pagination/pagination";
import SearchBoxBar from "@/ui/search/SearchBoxBar";
import SearchBoxFilters from "@/ui/search/SearchBoxFilters";
import SearchBoxList from "@/ui/search/SearchBoxList";

export default function Page({ searchParams } : { searchParams: { query?: string; page?: string } }) {
    const products = productPlaceholders.concat(productPlaceholders).concat(productPlaceholders);
    const query = searchParams.query || "";
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = 2; /* TODO: Cambiar a obtener la cantidad de páginas en base a la base de datos */
    let hidden = false;

    /* if (totalPages === 0) hidden = true; */ /* Descomentar esto cuando este la conexión con la BD */

    return (
        <div className = "items-center justify-center p-6 px-0 sm:px-6">
            <h1 className = "text-3xl font-bold mb-6 text-center">Descuentos destacados</h1>
            <div className = "border-2 border-borders rounded-lg p-6 h-full w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center justify-center gap-6 h-full">
                {products.map(product => (
                    <FeaturedProductCard key={product.id} product = {product} className = "w-full h-[400px]" />
                ))}
            </div>
            <div className = "flex flex-col items-center justify-center gap-6 mt-3 px-0 mx-auto border border-borders rounded-3xl p-6">
                <h1 className = "text-3xl font-bold text-center">Todos los descuentos</h1>
                <SearchBoxBar placeholder = "Buscar" />
                <div className = "flex flex-col lg:flex-row w-full lg:w-3/4 border border-borders rounded-3xl p-6">
                    <SearchBoxFilters genres = {tagPlaceholders} />
                    <div className = "flex flex-col justify-center w-full">
                        <div className = "w-full">
                            <SearchBoxList currentPage = {currentPage} query = {query} />
                        </div>
                        <div className= {hidden ? "hidden" : "flex justify-center"}>
                            <Pagination totalPages = {totalPages} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}