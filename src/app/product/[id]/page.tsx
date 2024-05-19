import { productPlaceholders } from "@/data/placeholders";
import ProductInfoCarousel from "@/ui/carousels/product_info/ProductInfoCarousel";
import { notFound } from "next/navigation";

export default function Page({params}: {params: {id: string}}){
    const {id: strId} = params;
    const id = parseInt(strId);
    const produt = productPlaceholders.find(product => product.id === id);
    if (!produt)
        notFound();
    else
        return <ProductInfoCarousel product={produt} className="w-[800px] h-[600px]"/>
    
}