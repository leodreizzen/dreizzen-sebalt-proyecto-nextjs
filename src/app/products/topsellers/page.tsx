import FeaturedBoxList from "@/ui/featuredlist/FeaturedBoxList";
import Pagination from "@/ui/pagination/pagination";

export default function Page({ searchParams }: { searchParams: { page?: string } }) {

    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = 2; /* TODO: Cambiar a obtener la cantidad de páginas en base a la base de datos */
    let hidden = false;

    /* if (totalPages === 0) hidden = true; */ /* Descomentar esto cuando este la conexión con la BD */

    return (
        <div className="items-center justify-center px-1">
            <h1 className="text-3xl font-bold mt-6 mb-3 text-center">Productos más vendidos</h1>
            <div className="p-3 2xl:px-64">
                <FeaturedBoxList currentPage={currentPage} />
                <div className={hidden ? "hidden" : "flex justify-center mt-2"}>
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    )
}