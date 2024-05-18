"use client"

import ProductInfoCarousel from "@/ui/carousels/ProductInfoCarousel";
import { productPlaceholders } from "@/data/placeholders";
import GenreCard from "@/ui/cards/GenreCard";
import FeaturedProductCard from "@/ui/cards/FeaturedProductCard";

export default function Home() {
  return (
      <>
        <ProductInfoCarousel className="w-[800px] h-[600px] col-span-12 sm:col-span-7" product={productPlaceholders[0]}/>
        <GenreCard/>
        <FeaturedProductCard className="w-[550px] h-[300px] col-span-12 sm:col-span-7" product={productPlaceholders[0]}/>
      </>
  );
}
