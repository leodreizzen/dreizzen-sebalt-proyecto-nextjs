import { productPlaceholders } from "@/data/placeholders"
import MarqueeOnOverflow from "@/ui/MarqueeOnOverflow";
import { formatPrice } from "@/util/formatUtils"
import { Button } from "@nextui-org/button";
import Image from "next/image"
import Link from "next/link";
import { CiCircleRemove } from "react-icons/ci";

export default function Page({ }) {
    let products = productPlaceholders.concat(productPlaceholders).concat(productPlaceholders)
    products = products.map((p, index) => ({ ...p, id: index + 1 }))
    const total = products.reduce((acc, p) => acc + p.currentPrice_cents, 0)

    async function removeItem() {
        "use server"
        console.log("Removed from cart")
    }

    return (
        <main className="flex flex-col items-center">
            <h1 className="text-center text-3xl font-bold my-3">Carrito</h1>
            <div className="flex flex-col w-10/12 gap-4 mb-4">
                <div className="w-full gap-4 flex flex-col border border-borders p-4 rounded-lg">
                    {
                        products.map(
                            product => (
                                <div className="border border-borders grid grid-cols-[auto_1fr_auto_auto] grid-flow-row grid-rows-1 h-20 pr-2 rounded-lg overflow-clip" key={product.id}>
                                    <div className="relative h-full aspect-video">
                                        <Link href={`/product/${product.id}`}><Image src={product.coverImage.url} alt={product.coverImage.alt} fill /></Link>
                                    </div>
                                    <div className="flex items-center min-w-0 mx-2">
                                        <MarqueeOnOverflow direction="horizontal" animation={["animate-marqueeX", "animate-marqueeX2"]}>
                                            <Link href={`/product/${product.id}`}><span className="ml-1 mr-1 align-middle text-nowrap">{product.name}</span></Link>
                                        </MarqueeOnOverflow>
                                    </div>
                                    <div className="flex items-center mr-2">
                                        <p>{formatPrice(product.currentPrice_cents)}</p>
                                    </div>
                                    <form action={removeItem} className="self-center">
                                        <Button type="submit" className="flex items-center text-red-600 hover:text-red-400 active:text-red-300 h-10 w-10 min-w-0 min-h-0 bg-transparent px-0 self-center ">
                                            <CiCircleRemove className="h-10 w-10" />
                                        </Button>
                                    </form>
                                </div>
                            )
                        )
                    }
                </div>
                <div className="flex self-end text-lg items-center">
                    <span>Total:</span>
                    <span className="pl-2 pr-4">{formatPrice(total)}</span>
                    <Button as={Link} href="/purchase" className="font-bold bg-transparent text-foreground border-foreground border" size="md">Comprar ahora</Button>
                </div>
            </div>
        </main>
    )
}