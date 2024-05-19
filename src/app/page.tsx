import ProductInfoCarousel from "@/ui/carousels/product_info/ProductInfoCarousel";
import { productPlaceholders } from "@/data/placeholders";
import FeaturedProductsCarousel from "@/ui/carousels/featured/FeaturedProductsCarousel";
import GenreCard from "@/ui/cards/GenreCard";
import FeaturedProductCard from "@/ui/cards/FeaturedProductCard";

export default function Home() {
  return (
      <>
        {/*<ProductInfoCarousel className="w-[800px] h-[600px]" product={productPlaceholders[0]} />*/}
        <FeaturedProductsCarousel products={productPlaceholders} className="w-[800px] h-[600px]"/>

      </>
  );
}
