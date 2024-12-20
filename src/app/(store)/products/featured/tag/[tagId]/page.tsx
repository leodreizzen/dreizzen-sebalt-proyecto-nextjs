import { fetchByGenre, fetchGenrePages, fetchTagName } from "@/lib/data";
import FeaturedBoxList from "@/ui/featuredlist/FeaturedBoxList";
import Pagination from "@/ui/pagination/pagination";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {cache} from "react";
import capitalize from "capitalize";

type Props = {
    params: Promise<{ tagId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const fetchTagNameCached = cache(fetchTagName);

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const tagId = (await params).tagId;
    const tag = await fetchTagNameCached(parseInt(tagId));
    if (!tag)
        notFound();
    return {
        title: capitalize.words(tag.name),
        description: `Find products for tag "${capitalize.words(tag.name)}"`,
    }
}

export default async function Page({ params: { tagId }, searchParams }: { params: { tagId: string }, searchParams: { page?: string } }) {

    const currentPage = searchParams.page ? Number(searchParams.page) : 1;


    const totalPages = await fetchGenrePages(Number(tagId));
    let hidden = false;

    if (totalPages === 0) hidden = true;

    const productsPromise = fetchByGenre(Number(tagId), currentPage);
    const tagPromise = fetchTagName(Number(tagId));

    const [products, tag] = await Promise.all([productsPromise, tagPromise]);

    return (
        <div className="items-center justify-center px-1">
            <h1 className="text-3xl font-bold mt-6 mb-3 text-center">Products with tag {tag?.name.toLocaleLowerCase()}</h1>
            <div className="p-3 2xl:px-[calc(35%-22rem)] xl:px-32">
                <FeaturedBoxList products={products} imgSizes="(max-width: 639px) 79vw, (max-width: 767px) 82vw, (max-width: 1279px) 44vw, (max-width: 1535px) 25vw, 20vw" priority/>
                <div className={hidden ? "hidden" : "flex justify-center mt-2"}>
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    )
}