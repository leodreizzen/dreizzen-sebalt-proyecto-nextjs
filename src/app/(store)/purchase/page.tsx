import {fetchCartProducts} from "@/lib/data";
import PurchaseForm from "@/ui/purchase/PurchaseForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Purchase",
    description: "Finish your purchase"
}

export default async function Page() {
    const cartItems = await fetchCartProducts()
    const amount_cents = cartItems.reduce((acc, item) => acc + item.currentPrice_cents, 0)

    return (
        <PurchaseForm amount_cents={amount_cents}/>
    )
}
