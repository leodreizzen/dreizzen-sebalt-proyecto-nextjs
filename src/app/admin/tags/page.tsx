import {fetchTagsAdminPages, fetchTagsAdmin} from "@/lib/data";
import Pagination from "@/ui/pagination/pagination";
import TagTable from "@/ui/admin/tags/TagTable";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Tags",
    description: "Manage tags",
}

export default async function AdminPurchasesPage({searchParams}: {searchParams: { page?: string, q?: string }}){
    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
    const tagsPromise = fetchTagsAdmin(currentPage)
    const totalPagesPromise = fetchTagsAdminPages();

    const [tags, totalPages] = await Promise.all([tagsPromise, totalPagesPromise]);

    return (
        <div>
            <div className={"justify-center items-center flex flex-col"}>
                <h1 className={"text-white mb-2 text-2xl"}>Tags</h1>
                <div className={"flex flex-col w-full justify-center items-center"}>
                    <TagTable tags={tags} />
                    <div className={tags.length === 0 ? "hidden" : "flex justify-center mb-2 mt-4"}>
                        <Pagination totalPages={totalPages}/>
                    </div>
                    <div className={tags.length === 0 ? "flex justify-center mb-2" : "hidden"}>
                        <p>No results found.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}