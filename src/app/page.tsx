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
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur dolore, eos at deleniti quam, magni quae natus atque tempora, nesciunt sapiente distinctio! Vitae enim nisi nostrum aperiam impedit quam harum.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur architecto ipsam totam, asperiores vero labore molestiae obcaecati laboriosam accusamus aspernatur veniam dolorem mollitia, delectus quos nisi ex quo saepe nemo.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia ad animi harum est. Commodi beatae qui, ipsum obcaecati unde odit eligendi quibusdam praesentium cupiditate repudiandae corporis accusantium error dolor dolore?
      </>
  );
}
