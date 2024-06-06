import { removeFromCart } from "@/lib/actions";
import MarqueeOnOverflow from "@/ui/MarqueeOnOverflow";
import { formatPrice } from "@/util/formatUtils"
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";
import Image from "next/image"
import Link from "next/link";
import { MdRemoveCircleOutline } from "react-icons/md";
import clsx from "clsx";
import { BsCartX } from "react-icons/bs";
import {fetchCartProducts} from "@/lib/data";
import {ProductWithCoverImage} from "@/lib/definitions";

export default async function Page({ }) {
    const products = await fetchCartProducts()
    return (
        <main className="flex flex-col items-center min-h-full">
            <h1 className="text-center text-3xl font-bold my-3 h-full">Carrito</h1>
            {products.length > 0 ?
                <CartWithItemsPage products={products} className="w-full sm:w-10/12 gap-4 mb-4 sm:px-4" />
                : <EmptyCartPage className="w-full sm:w-10/12 gap-4 mb-4 sm:px-4" />
            }


        </main>
    )
}

function CartWithItemsPage({ products, className }: { products: ProductWithCoverImage[], className?: String }) {
    const total = products.reduce((acc, product) => acc + product.currentPrice_cents, 0);

    async function handleCartRemove(productId: number) {
        "use server"
        await removeFromCart(productId);
        redirect("/cart");
    }

    return (
        <div className={clsx("flex flex-col", className)}>
            <div className="w-full gap-4 flex flex-col border border-borders p-4 sm:rounded-lg">
                {
                    products.map(
                        product => (
                            <div className="border border-borders grid grid-cols-[auto_auto] xs:grid-cols-[auto_1fr_auto_auto] grid-flow-row grid-rows-[auto_min-content_min-content] xs:grid-rows-1 xs:h-16 sm:h-20 pr-2 py-2 xs:py-0  sm:rounded-lg overflow-clip" key={product.id}>
                                <div className="relative max-xs:w-5/12 xs:h-full aspect-video max-xs:col-span-2 max-xs:rounded-xl max-xs:overflow-clip  max-xs:justify-self-center">
                                    <Link href={`/product/${product.id}`}><Image src={product.coverImage.url} alt={product.coverImage.alt} fill /></Link>
                                </div>
                                <div className="flex items-center min-w-0 mx-2 max-xs:mt-1 max-xs:col-span-2 max-xs:justify-self-center">
                                    <MarqueeOnOverflow direction="horizontal" animation={["animate-marqueeX", "animate-marqueeX2"]}>
                                        <Link href={`/product/${product.id}`}><span className="ml-1 mr-1 align-middle text-nowrap">{product.name}</span></Link>
                                    </MarqueeOnOverflow>
                                </div>
                                <div className="flex items-center xs:mr-1  max-xs:justify-self-end">
                                    <p>{formatPrice(product.currentPrice_cents)}</p>
                                </div>
                                <form action={handleCartRemove.bind(null, product.id)} className="self-center">
                                    <Button type="submit" className="flex items-center text-red-600 hover:text-red-400 active:text-red-300 w-7 h-7 max-sm:ml-1 xs:h-10 xs:w-10 min-w-0 min-h-0 bg-transparent px-0 self-center ">
                                        <MdRemoveCircleOutline className="h-10 w-10" />
                                    </Button>
                                </form>
                            </div>
                        )
                    )
                }
            </div>
            <div className="flex self-end text-lg items-center mx-3">
                <span>Total:</span>
                <span className="pl-2 pr-4">{formatPrice(total)}</span>
                <Button as={Link} href="/purchase" className="font-bold bg-transparent text-foreground border-foreground border" size="md">Comprar ahora</Button>
            </div>
        </div>
    )
}

function EmptyCartPage({ className }: { className?: String }) {
    return (
        <div className={clsx(className, "flex flex-col items-center h-full")}>
            <div className="aspect-square w-1/5">
                <BsCartX className="size-full" />
            </div>
            <p className="pt-3 text-center">Tu carrito está vacío. Agrega productos para comprarlos</p>
            <Button as={Link} href="/" className="text-center bg-primary text-foreground mt-2">Elegir productos</Button>
        </div>
    )
}