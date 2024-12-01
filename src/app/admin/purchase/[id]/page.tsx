import {notFound} from "next/navigation";
import {fetchPurchase} from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import MarqueeOnOverflow from "@/ui/MarqueeOnOverflow";
import {Link as NextUILink} from "@nextui-org/link";
import {formatPrice} from "@/util/formatUtils";
import {FaExclamationTriangle} from "react-icons/fa";
import {Metadata} from "next";

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata({params}: Props): Promise<Metadata> {
    const id = (await params).id;
    if (!id || !parseInt(id))
        notFound();
    return {
        title: `Purchase #${id}`,
        description: `View purchase details for purchase #${id}`
    }

}

export default async function PurchasePage({params}: { params: { id: string } }) {
    const {id: strId} = params;
    const id = parseInt(strId);
    const purchase = await fetchPurchase(id);
    if (!purchase)
        notFound();
    const total = purchase.products.reduce((acc, product) => acc + product.currentPrice_cents, 0);
    return (
        <main className="@container pb-2">
            <div className="w-full @md:w-11/12 @lg:w-10/12 @2xl:w-9/12 @3xl:w-8/12 mx-auto @sm:p-2">
                <h1 className="text-3xl font-bold text-center @md:text-start @md:pt-5 @md:pb-2 @lg:pb-3 ">Purchase
                    details</h1>
                <div className={"flex flex-col gap-3"}>
                    <div className="flex flex-col gap-4 rounded-xl p-4 bg-content1">
                        <div className="flex flex-row gap-2">
                            <p className=""><b>Purchase ID:</b> {purchase.id}</p>
                        </div>
                        <div className="flex flex-row gap-2">
                            <p className=""><b>Invoice ID:</b> {purchase.invoiceData.id}</p>
                        </div>
                        <h1 className="text-xl font-bold">Invoice data</h1>
                        <div
                            className="grid grid-cols-1 @xl:grid-cols-2 gap-4 rounded-xl bg-content1 border-1 border-borders p-2">
                            <div className="flex flex-row gap-2">
                                <p><b>ID:</b> {purchase.invoiceData.customerId}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p><b>First name:</b> {purchase.invoiceData.firstName}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p><b>Last name:</b> {purchase.invoiceData.lastName}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p><b>Email:</b> {purchase.invoiceData.email}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p><b>Country:</b> {purchase.invoiceData.country}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p><b>State:</b> {purchase.invoiceData.state}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p><b>City:</b> {purchase.invoiceData.city}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p><b>Address first line:</b> {purchase.invoiceData.address1}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p><b>Address second line:</b> {purchase.invoiceData.address2}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full gap-4 flex flex-col border border-borders p-4 rounded-xl">
                        <h1 className="text-center text-3xl font-bold my-3 h-full">Products</h1>
                        {
                            purchase.products.map(
                                purchaseItem => (
                                    <div className="@container" key={purchaseItem.productId}>
                                        <div
                                            className="border border-borders grid grid-cols-1 @xs:grid-cols-[auto_1fr_auto_auto] gap-x-2 grid-flow-row grid-rows-[auto_min-content_min-content] @xs:grid-rows-1 @xs:h-16 @sm:h-20 pr-2 py-2 @xs:py-0 @sm:rounded-lg overflow-clip">
                                            <div
                                                className="w-6/12 @xs:w-[revert] h-full rounded-xl @xs:rounded-none overflow-clip justify-self-center">
                                                <Link href={`/product/${purchaseItem.productId}`}
                                                      className="size-full aspect-video relative inline-block">
                                                    <Image src={purchaseItem.product.coverImage.url} className="select-none"
                                                           alt={purchaseItem.product.coverImage.alt} fill/>
                                                </Link>
                                            </div>
                                                <MarqueeOnOverflow direction="horizontal"
                                                                   animation={["animate-marqueeX", "animate-marqueeX2"]} className="w-full @xs:w-revert items-center justify-center mt-1 @xs:mt-0">
                                                    <NextUILink color="foreground" as={Link}
                                                                href={`/product/${purchaseItem.productId}`}><span
                                                        className="ml-1 mr-1 align-middle text-nowrap">{purchaseItem.product.name}</span></NextUILink>
                                                </MarqueeOnOverflow>
                                            <div className="flex items-center @xs:mr-1 justify-self-center @xs:justify-self-end">
                                                <p>{formatPrice(purchaseItem.currentPrice_cents)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                    <div className="flex flex-col">
                    <div className="flex self-center @xs:self-end text-lg items-center mx-3">
                        <span>Total:</span>
                        <span className="pl-2 pr-4">{formatPrice(total)}</span>
                    </div>
                    <div className="flex self-center @xs:self-end text-lg items-center mx-3">
                        {purchase.paymentId ? <span className="pl-2 pr-4">Payment ID: {purchase.paymentId}</span> :
                            <span className="flex items-center gap-x-2"><FaExclamationTriangle/> The payment is pending approval</span>}
                    </div>
                    </div>
                </div>
            </div>
        </main>
    )
}