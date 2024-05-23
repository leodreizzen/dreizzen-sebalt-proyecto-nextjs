import { featuredTagsPlaceholders, productPlaceholders } from "@/data/placeholders";
import FeaturedProductsCarousel from "@/ui/carousels/featured/FeaturedProductsCarousel";
import GenreCard from "@/ui/cards/GenreCard";
import ListCard from "@/ui/cards/ListCard";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function Home() {
  let topSellers = productPlaceholders.concat(productPlaceholders).concat(productPlaceholders).concat(productPlaceholders)
  topSellers = topSellers.map(product => ({ ...product }))
  topSellers.forEach((product, index) => product.id = index + 1)

  return (
    <main className="w-full flex flex-col items-center pt-4">
      <div className="w-[1150px]">
        <div>
          <h2 className="text-center text-large pb-2">Destacados</h2>
        </div>
        <div className="border-borders px-2 pt-4 rounded-3xl border">
          <FeaturedProductsCarousel products={productPlaceholders} className="w-full h-[550px] mx-auto" />
        </div>
        <div className="flex flex-col mt-10  ">
          <h2 className="text-center pb-1 text-large">Géneros destacados</h2>
          <div className="grid grid-cols-3 gap-4 justify-between border border-borders px-10 pb-4 pt-2 rounded-3xl">
            {featuredTagsPlaceholders.map((genre) =>
              <GenreCard key={genre.tag.id} genre={genre} className="h-[200px]" />
            )}
          </div>
        </div>
      </div>
      <div className="border-borders py-2 mt-8 ">
        <h2 className="text-center pb-2 text-largeS">Más vendidos</h2>
        <div className="mx-auto border border-borders flex flex-col items-center rounded-3xl">
          {
            topSellers.map(product =>
              <ListCard className="w-full" product={product} key={product.id} />
            )
          }
          <span className="px-16 w-full">
            <Button as={Link} className="w-full" href="/products/topsellers">Ver más</Button>
          </span>
        </div>
      </div>
    </main>
  );
}
