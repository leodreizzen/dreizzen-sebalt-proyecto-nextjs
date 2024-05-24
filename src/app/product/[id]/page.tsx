import { productPlaceholders, tagPlaceholders } from "@/data/placeholders";
import AddToCartButton from "@/ui/AddToCartButton";
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
        <main className="w-[1400px] mx-auto">
            <h1 className="text-3xl font-bold pt-5 pb-4 ">{product.name}</h1>
            <div className="w-full flex">
                <ProductInfoCarousel product={product} className="w-4/6 border-l border-t border-b rounded-l-xl  border-borders" />
                <div className="w-2/5 bg-content1 flex flex-col flex-grow justify-between">
                    <div>
                        <div className="overflow-clip w-full mx-auto aspect-video relative">
                            <Image src={product.coverImage.url} alt={product.coverImage.alt} fill />
                        </div>
                        {
                            product.shortDescription ? <p className="py-4 text-justify px-4">{product.shortDescription}</p> : null
                        }
                    </div>
                    <div className="flex gap-2 pb-4 flex-wrap px-3 items-center justify-center">
                        {product.tags.map(tag => (
                            <Chip key={tag.id} size="md" color="primary" className="text-white" >{tag.name}</Chip>
                        ))}
                    </div>

                </div>
            </div>
            <div className="mt-4 border border-borders w-4/6 flex justify-between items-center p-3 rounded-lg">
                <span>Comprar <strong>{product.name}</strong></span>
                <div className="flex items-center">
                    <p className="text-large pr-3">{formatPrice(product.currentPrice_cents)}</p>
                    <AddToCartButton />
                </div>
            </div>
            <h1 className="text-large mt-2"> Descripción </h1>
            <div className="bg-content1 p-2">
                {
                    textParagraphs.map((paragraph, index) => <p key={index} className="text-justify">{paragraph}</p>)
                }
            </div>
        </main>
    )
}