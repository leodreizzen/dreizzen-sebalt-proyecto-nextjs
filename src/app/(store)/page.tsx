import FeaturedProductsCarousel from "@/ui/carousels/featured/FeaturedProductsCarousel";
import GenreCard from "@/ui/cards/GenreCard";
import ListCard from "@/ui/cards/ListCard";
import {Button} from "@nextui-org/button";
import Link from "next/link";
import {fetchFeaturedProducts, fetchFeaturedTags, fetchMostSold} from "@/lib/data";

export default async function Home() {
    const topSellers = await fetchMostSold(1);
    const featuredProducts = await fetchFeaturedProducts();
    const featuredTags = await fetchFeaturedTags();

    return (
        <main className="w-full flex flex-col items-center pt-4">
            <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12">
                {featuredProducts.length > 0 &&
                    <>
                        <div>
                            <h2 className="text-center text-large pb-2">Featured</h2>
                        </div>

                        <div className="sm:border border-borders px-2 pt-4 rounded-3xl mb-4">
                            <FeaturedProductsCarousel products={featuredProducts}
                                                      className="mx-auto lg:w-11/12 xl:w-10/12 2xl:w-9/12 mb-10"/>
                        </div>
                    </>
                }
                <div className="flex flex-col px-3 ">
                    <h2 className="text-center pb-1 text-large">Featured tags</h2>
                    <div
                        className="flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-2 lg:gap-4 border border-borders px-4 sm:px-8 md:px-10 pb-4 pt-5 rounded-3xl">
                        {featuredTags.map(tag => <GenreCard key={tag.order} genre={tag}/>)}
                    </div>
                </div>
                <div className="p-2 mt-8">
                    <h2 className="text-center pb-2 text-large">Top sellers</h2>
                    <div className="xs:border border-borders rounded-3xl p-4">
                        <div className="mx-auto gap-3 flex flex-col items-center rounded-3xl">
                            {
                                topSellers.map(product =>
                                    <ListCard className="w-full" product={product} key={product.id}/>
                                )
                            }
                            <span className="px-16 w-full">
                  <Button as={Link} className="w-full bg-content1 text-white border border-borders select-text"
                          href="/products/topsellers">See more</Button>
                </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
