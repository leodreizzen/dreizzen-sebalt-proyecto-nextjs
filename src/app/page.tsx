"use client"
import Image from "next/image";
import ProductInfoCarousel from "@/ui/carousels/ProductInfoCarousel";
import { productPlaceholders } from "@/data/placeholders";

import CloudinaryPlayer from "@/ui/video/CloudinaryPlayer";
import ReactPlayer from "react-player";

export default function Home() {
  return (
     <>
        <ProductInfoCarousel className="w-[800px] h-[600px]" product={productPlaceholders[0]} />
      </>
  );
}
