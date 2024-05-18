"use client"

import ProductInfoCarousel from "@/ui/carousels/ProductInfoCarousel";
import { productPlaceholders } from "@/data/placeholders";

export default function Home() {
  return (
     <>
        <ProductInfoCarousel className="w-[800px] h-[600px]" product={productPlaceholders[0]} />
      </>
  );
}
