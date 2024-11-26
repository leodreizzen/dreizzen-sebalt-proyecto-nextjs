import {fetchProduct, fetchProductCached} from "@/lib/data";
import AddToCartButton from "@/ui/AddToCartButton";
import FadeOnOverflowY from "@/ui/FadeOnOverflowY";
import MarqueeOnOverflow from "@/ui/MarqueeOnOverflow";
import ProductInfoCarousel from "@/ui/carousels/product_info/ProductInfoCarousel";
import {formatPrice} from "@/util/formatUtils";
import {Chip} from "@nextui-org/chip";
import Image from "next/image";
import {notFound} from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import {Company} from "@prisma/client";
import pluralize from "pluralize"
import {GoDotFill} from "react-icons/go";
import Link from "next/link";

import type {Metadata} from 'next'
import {currentPrice} from "@/util/productUtils";

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const id = (await params).id;
    const product = await fetchProductCached(parseInt(id));
    if (!product)
        notFound();
    return {
        title: product.name,
        description: `Buy ${product.name} on Vapor`,

        openGraph: {
            images: [
                {
                    url: product.coverImage.url,
                    alt: product.coverImage.alt
                }
            ]
        }
    }
}

export default async function ProductInfoPage({params}: { params: { id: string } }) {
    const {id: strId} = params;
    const id = parseInt(strId);
    const product = await fetchProduct(id);
    if (!product)
        notFound();
    const sanitizedDescription = DOMPurify.sanitize(product.description);
    return (
        <main className="w-full sm:w-10/12 md:w-full lg:w-11/12 xl:w-10/12 2xl:w-8/12 mx-auto p-2">
            <h1 className="text-3xl font-bold text-center md:text-start md:pt-5 md:pb-2 lg:pb-3 ">{product.name}</h1>
            <div className="w-full flex flex-col-reverse md:flex-row items-center md:items-stretch">
                <ProductInfoCarousel product={product}
                                     className=" w-full md:w-8/12 border md:border-r-0 rounded-xl md:rounded-r-none border-borders"/>
                <div
                    className="w-full md:w-4/12 mt-2 pt-2 md:pt-0 mb-4 md:mb-0 md:mt-0 bg-content1 flex flex-col flex-grow justify-between rounded-xl md:rounded-l-none overflow-clip">
                    <div className="flex-grow flex flex-col overflow-hidden">
                        <div className="overflow-clip w-8/12 md:w-full mt-2 md:mt-0 mx-auto aspect-video relative select-none">
                            <Image src={product.coverImage.url} alt={product.coverImage.alt} fill/>
                        </div>
                        <div className="md:min-h-0 flex-grow md:basis-0 md:mb-4 inline-block text-ellipsis">
                            {
                                product.shortDescription ?
                                    <FadeOnOverflowY className="h-full overflow-hidden">
                                        <p className="py-4 text-justify px-4 h-full basis-0">{product.shortDescription}</p>
                                    </FadeOnOverflowY>
                                    : null
                            }
                        </div>
                    </div>
                    <div className="px-2">
                        <MarqueeOnOverflow direction="horizontal"
                                           animation={["animate-marqueeSlowX", "animate-marqueeSlowX2"]}
                                           className="w-full justify-center">
                            <div className="flex mt-3 gap-2 pb-3 pl-2 flex-nowrap items-center justify-center">
                                {product.tags.map(tag => (
                                    <Chip key={tag.tag.id} size="md" color="primary"
                                          className="text-white hover:bg-primary-500 active:bg-primary-400" as={Link} href={`/products/search?filter=${tag.tagId}`}>{tag.tag.name}</Chip>
                                ))}
                            </div>
                        </MarqueeOnOverflow>
                    </div>
                </div>
            </div>
            <div
                className="mt-4 border border-borders w-full md:w-4/6 flex max-sm:flex-col max-sm:gap-2 justify-between items-center p-3 rounded-lg">
                <span>Buy <strong>{product.name}</strong></span>
                <div className="flex flex-shrink-0 flex-grow items-center justify-end">
                    <div className="flex flex-col items-end pr-3">
                        {product.originalPrice_cents !== currentPrice(product) && <span className="text-small/4 text-gray-400"><s>{formatPrice(product.originalPrice_cents)}</s></span>}
                        <span className="text-large/5">{formatPrice(currentPrice(product))}</span>
                    </div>

                    <AddToCartButton className="flex-shrink-0" product={product}/>
                </div>
            </div>
            <div
                className="grid grid-cols-1 md:grid-cols-[66.666667%] lg:grid-cols-[66.666667%_33.333333%] grid-rows-[auto_auto_auto] lg:grid-rows-[auto_auto] grid-flow-col">
                <h1 className="text-large mt-4"> Description </h1>
                <div className="bg-content1 p-2" dangerouslySetInnerHTML={{__html: sanitizedDescription}}/>
                <div className="w-full lg:px-4 lg:row-start-2 flex row-start-1 max-lg:col-start-1 max-lg:mt-3">
                    <div className="flex w-full justify-center max-lg:border border-borders max-lg:rounded-lg">
                        <div
                            className="lg:mx-auto grid grid-cols-[max-content_max-content] sm:grid-cols-[auto_1fr] gap-x-2 lg:bg-content1 h-fit w-fit sm:w-full lg:w-fit p-3 gap-y-3">
                            <strong>Release date: </strong> <span>{product.launchDate.toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"})}</span>
                            {product.publishers.length > 0 && <CompanyList name="Publisher" companies={product.publishers}/>}
                            {product.developers.length > 0 && <CompanyList name="Developer" companies={product.developers}/>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

function CompanyList({name, companies}: { name: string, companies: Company[] }) {
    return (
        <>
            <strong>{pluralize(name, companies.length)}:</strong>
            {
                companies.length > 1 ? (
                    <ul>
                        {
                            companies.map(company => (
                                <li key={company.id} className="flex items-center">
                                    <GoDotFill className="scale-75"/>
                                    <span>{company.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                ) : <span> {companies[0].name}</span>
            }
        </>)
}

