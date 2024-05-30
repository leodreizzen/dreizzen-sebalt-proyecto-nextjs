import { productPlaceholders, tagPlaceholders } from "@/lib/placeholders";
import SearchBoxBar from "@/ui/search/SearchBoxBar";
import SearchBoxFilters from "@/ui/search/SearchBoxFilters";
import SearchBoxList from "@/ui/search/SearchBoxList";
import Pagination from "@/ui/pagination/pagination";


export default function Page({ searchParams }: { searchParams: { query?: string; page?: string } }) {
    let products = productPlaceholders.concat(productPlaceholders).concat(productPlaceholders);
    products = products.map(product => ({ ...product }));
    products.forEach((product, index) => product.id = index + 1);
    const query = searchParams.query || "";
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = 2; /* TODO: Cambiar a obtener la cantidad de páginas en base a la base de datos */
    let hidden = false;

    /* if (totalPages === 0) hidden = true; */ /* Descomentar esto cuando este la conexión con la BD */

    return (
        <div className="flex flex-col items-center justify-center 2xl:w-3/4 mx-auto gap-6 mt-3 mb-3 p-0 border border-borders rounded-3xl">
                <h1 className="text-3xl font-bold text-center px-1 mt-4">Todos los descuentos</h1>
                <SearchBoxBar placeholder="Buscar" />
                <div className="flex flex-col lg:flex-row w-full 2xl:w-3/4 border border-borders rounded-3xl">
                    <div className="p-6">
                        <SearchBoxFilters genres = {tagPlaceholders} />
                    </div>
                    <div className="flex flex-col justify-center w-full px-1">
                        <div className="w-full mr-4">
                            <SearchBoxList currentPage={currentPage} query={query} />
                        </div>
                        <div className={hidden ? "hidden" : "flex justify-center mb-2"}>
                            <Pagination totalPages={totalPages} />
                        </div>
                    </div>
                </div>
        </div>
    )
}