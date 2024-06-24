import MarqueeOnOverflow from "@/ui/MarqueeOnOverflow";
import {formatPrice} from "@/util/formatUtils"
import {Button} from "@nextui-org/button";
import Image from "next/image"
import Link from "next/link";
import clsx from "clsx";
import {BsCartX} from "react-icons/bs";
import {fetchCartProducts} from "@/lib/data";
import {ProductWithCoverImage} from "@/lib/definitions";
import RemoveFromCartPageButton from "@/ui/video/RemoveFromCartPageButton";
import {Link as NextUILink} from "@nextui-org/link";
export default async function CartPage({}) {
    const products = await fetchCartProducts()
    return (
        <main className="flex flex-col items-center min-h-full">
            <h1 className="text-center text-3xl font-bold my-3 h-full">Cart</h1>
            {products.length > 0 ?
                <CartWithItemsPage products={products} className="w-full sm:w-10/12 gap-4 mb-4 sm:px-4"/>
                : <EmptyCartPage className="w-full sm:w-10/12 gap-4 mb-4 sm:px-4"/>
            }


        </main>
    )
}

function CartWithItemsPage({products, className}: { products: ProductWithCoverImage[], className?: String }) {
    const total = products.reduce((acc, product) => acc + product.currentPrice_cents, 0);

    return (
        <div className={clsx("flex flex-col", className)}>
            <div className="w-full gap-4 flex flex-col border border-borders p-4 sm:rounded-lg">
                {
                    products.map(
                        product => (
                            <div
                                className="border border-borders grid grid-cols-[auto_auto] xs:grid-cols-[auto_1fr_auto_auto] grid-flow-row grid-rows-[auto_min-content_min-content] xs:grid-rows-1 xs:h-16 sm:h-20 pr-2 py-2 xs:py-0  sm:rounded-lg overflow-clip"
                                key={product.id}>
                                <div
                                    className="max-xs:w-5/12 xs:h-full max-xs:col-span-2 max-xs:rounded-xl max-xs:overflow-clip  max-xs:justify-self-center">
                                    <Link href={`/product/${product.id}`} className="size-full aspect-video relative inline-block">
                                        <Image src={product.coverImage.url} alt={product.coverImage.alt} fill/>
                                    </Link>
                                </div>
                                <div
                                    className="flex items-center min-w-0 mx-2 max-xs:mt-1 max-xs:col-span-2 max-xs:justify-self-center">
                                    <MarqueeOnOverflow direction="horizontal"
                                                       animation={["animate-marqueeX", "animate-marqueeX2"]}>
                                        <NextUILink color="foreground" as={Link} href={`/product/${product.id}`}><span
                                            className="ml-1 mr-1 align-middle text-nowrap">{product.name}</span></NextUILink>
                                    </MarqueeOnOverflow>
                                </div>
                                <div className="flex items-center xs:mr-1  max-xs:justify-self-end">
                                    <p>{formatPrice(product.currentPrice_cents)}</p>
                                </div>
                                <RemoveFromCartPageButton productId={product.id}/>
                            </div>
                        )
                    )
                }
            </div>
            <div className="flex self-end text-lg items-center mx-3">
                <span>Total:</span>
                <span className="pl-2 pr-4">{formatPrice(total)}</span>
                <Button as={Link} href="/purchase"
                        className="font-bold bg-transparent text-foreground border-foreground border" size="md"
                >Buy now</Button>
            </div>
        </div>
    )
}

function EmptyCartPage({className}: { className?: String }) {
    return (
        <div className={clsx(className, "flex flex-col items-center h-full")}>
            <div className="aspect-square w-1/5">
                <BsCartX className="size-full"/>
            </div>
            <p className="pt-3 text-center">Your cart is empty. Add products to buy them.</p>
            <Button as={Link} href="/" className="text-center bg-primary text-foreground mt-2">Choose products</Button>
        </div>
    )
}