import AdminProductForm, {InitialDataType} from "@/ui/admin/products/add/AddProductForm";
import {fetchProduct, fetchProductCached} from "@/lib/data";
import {notFound} from "next/navigation";
import {Metadata} from "next";

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
        title: `Edit "${product.name}"`,
        description: `Edit product "${product.name}"`,
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


export default async function EditProductPage({params} : {params: {id: string}}){
    const {id: strId} = params;
    const id = parseInt(strId);

    const product = await fetchProduct(id);

    if (!product)
        notFound();

    const initialData: InitialDataType = {
        id: product.id,
        name: product.name,
        description: product.description,
        launchDate: product.launchDate,
        currentPrice: currentPrice(product) / 100,
        originalPrice: product.originalPrice_cents / 100,
        shortDescription: product.shortDescription || "",
        tags: product.tags.map(tag => ({...tag.tag, isNew: false})),
        coverImage: {...product.coverImage, isNew: false},
        images: product.descriptionImages.map(image => ({...image, isNew: false})),
        videos: product.videos.map(video => ({...video, isNew: false, thumbnail: video.thumbnail ?  {...video.thumbnail, isNew: false} : undefined})),
        isOnSale: currentPrice(product) != product.originalPrice_cents,
        developers: product.developers.map(developer => ({...developer, isNew: false})),
        publishers: product.publishers.map(publisher => ({...publisher, isNew: false}))
    }

    return (
        <AdminProductForm initialData={initialData}/>
    )
}