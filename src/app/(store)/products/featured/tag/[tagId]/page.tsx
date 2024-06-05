import { tagPlaceholders } from "@/lib/placeholders";
import FeaturedBoxList from "@/ui/featuredlist/FeaturedBoxList";
import Pagination from "@/ui/pagination/pagination";

export default function Page({ params: { tagId, page } }: { params: { tagId: string, page?: string } }) {
    const currentPage = Number(page) || 1;

    const totalPages = 2; /* TODO: Cambiar a obtener la cantidad de páginas en base a la base de datos */
    let hidden = false;

    /* if (totalPages === 0) hidden = true; */ /* Descomentar esto cuando este la conexión con la BD */

    const tags = tagPlaceholders;

    const tag = tags.find((tag) => tag.id === Number(tagId));

    return (
        <div className="items-center justify-center px-1">
            <h1 className="text-3xl font-bold mt-6 mb-3 text-center">Productos destacados del género {tag?.name.toLocaleLowerCase()}</h1>
            <div className="p-3 2xl:px-64">
                <FeaturedBoxList currentPage={currentPage} />
                <div className={hidden ? "hidden" : "flex justify-center mt-2"}>
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    )
}