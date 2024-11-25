import {fetchPurchases, fetchPurchasesPages} from "@/lib/data";
import Pagination from "@/ui/pagination/pagination";
import PurchaseTable from "@/ui/admin/purchases/PurchaseTable";

export const metadata = {
    title: "Purchases",
    description: "View purchases",
}

export default async function AdminPurchasesPage({searchParams}: {searchParams: { page?: string, q?: string }}){
    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
    const purchases = await fetchPurchases(currentPage)
    const totalPages = await fetchPurchasesPages();
    return (
        <div>
            <div className={"justify-center items-center flex flex-col"}>
                <h1 className={"text-white mb-2 text-2xl"}>Purchases</h1>
                <div className={"flex flex-col w-full justify-center items-center"}>
                    <PurchaseTable purchases={purchases}/>
                    <div className={purchases.length === 0 ? "hidden" : "flex justify-center mb-2 mt-4"}>
                        <Pagination totalPages={totalPages}/>
                    </div>
                    <div className={purchases.length === 0 ? "flex justify-center mb-2" : "hidden"}>
                        <p>No results found.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}