import { featuredTagsPlaceholders, productPlaceholders } from "@/lib/placeholders";
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
        <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12">
          <div>
            <h2 className="text-center text-large pb-2">Destacados</h2>
          </div>
          <div className="sm:border border-borders px-2 pt-4 rounded-3xl ">
            <FeaturedProductsCarousel products={productPlaceholders} className="mx-auto lg:w-11/12 xl:w-10/12 2xl:w-9/12" />
          </div>
          <div className="flex flex-col mt-10 px-3 ">
            <h2 className="text-center pb-1 text-large">Géneros destacados</h2>
            <div className="flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-2 lg:gap-4 border border-borders px-4 sm:px-8 md:px-10 pb-4 pt-5 rounded-3xl">
              {featuredTagsPlaceholders.map((genre) =>
                <GenreCard key={genre.tag.id} genre={genre} className="w-full self-center max-w-[28rem] sm:w-auto sm:max-w-full" />
              )}
            </div>
          </div>
          <div className="p-2 mt-8">
            <h2 className="text-center pb-2 text-large">Más vendidos</h2>
            <div className="xs:border border-borders rounded-3xl p-4">
              <div className="mx-auto gap-3 flex flex-col items-center rounded-3xl">
                {
                  topSellers.map(product =>
                    <ListCard className="w-full" product={product} key={product.id} />
                  )
                }
                <span className="px-16 w-full">
                  <Button as={Link} className="w-full bg-content1 text-white border border-borders" href="/products/topsellers">Ver más</Button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
