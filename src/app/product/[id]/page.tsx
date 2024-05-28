import { productPlaceholders, tagPlaceholders } from "@/data/placeholders";
import AddToCartButton from "@/ui/AddToCartButton";
import FadeOnOverflowY from "@/ui/FadeOnOverflowY";
import MarqueeOnOverflow from "@/ui/MarqueeOnOverflow";
import ProductInfoCarousel from "@/ui/carousels/product_info/ProductInfoCarousel";
import { formatPrice } from "@/util/formatUtils";
import { Chip } from "@nextui-org/chip";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
    const { id: strId } = params;
    const id = parseInt(strId);
    const product = productPlaceholders.find(product => product.id === id);
    if (!product)
        notFound();
    const textParagraphs = product.description.split("\n");

    return (
        <main className="sm:w-10/12 md:w-full lg:w-11/12 xl:w-10/12 2xl:w-8/12 mx-auto p-2">
            <h1 className="text-3xl font-bold text-center md:text-start md:pt-5 md:pb-2 lg:pb-3 ">{product.name}</h1>
            <div className="w-full flex flex-col-reverse md:flex-row items-center md:items-stretch">
                <ProductInfoCarousel product={product} className=" w-full md:w-8/12 border md:border-r-0 rounded-xl md:rounded-r-none border-borders" />
                <div className="w-full md:w-4/12 mt-2 pt-2 md:pt-0 mb-4 md:mb-0 md:mt-0 bg-content1 flex flex-col flex-grow justify-between rounded-xl md:rounded-l-none overflow-clip">
                    <div className="flex-grow flex flex-col overflow-hidden">
                        <div className="overflow-clip w-8/12 md:w-full mt-2 md:mt-0 mx-auto aspect-video relative">
                            <Image src={product.coverImage.url} alt={product.coverImage.alt} fill />
                        </div>
                        <div className="md:min-h-0 flex-grow md:basis-0 md:mb-4 inline-block text-ellipsis">
                            {
                                product.shortDescription ?
                                    <FadeOnOverflowY className="h-full overflow-hidden">
                                    <p className="py-4 text-justify px-4 h-full basis-0">{product.shortDescription}</p>
                                    </FadeOnOverflowY>
                                : null
                            }
                        </div>
                    </div>
                    <div className="px-2">
                        <MarqueeOnOverflow direction="horizontal" animation={["animate-marqueeSlowX", "animate-marqueeSlowX2"]} className="w-full justify-center">
                            <div className="flex gap-2 pb-4 pl-2 flex-nowrap items-center justify-center">
                                {product.tags.map(tag => (
                                    <Chip key={tag.id} size="md" color="primary" className="text-white" >{tag.name}</Chip>
                                ))}
                            </div>
                        </MarqueeOnOverflow>
                    </div>
                </div>
            </div>
            <div className="mt-4 border border-borders w-full md:w-4/6 flex justify-between items-center p-3 rounded-lg">
                <span>Comprar <strong>{product.name}</strong></span>
                <div className="flex flex-shrink-0 flex-grow items-center justify-end">
                    <p className="text-large pr-3">{formatPrice(product.currentPrice_cents)}</p>
                    <AddToCartButton className="flex-shrink-0" />
                </div>
            </div>
            <h1 className="text-large mt-5 md:mt-2"> Descripción </h1>
            <div className="bg-content1 p-2">
                {
                    textParagraphs.map((paragraph, index) => <p key={index} className="text-justify">{paragraph}</p>)
                }
            </div>
        </main>
    )
}