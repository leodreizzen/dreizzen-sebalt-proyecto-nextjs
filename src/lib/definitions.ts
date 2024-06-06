import { Company, Image, Product, Tag, Video, Purchase, InvoiceData, ProductTag, FeaturedTag, ProductSale } from "@prisma/client";

export type ShoppingCart = number[];

export interface ProductWithTags extends Product{
    tags: ProductTagWithTag[]
}

export interface ProductTagWithTag extends ProductTag{
    tag: Tag
}

export interface FeaturedSaleWithProduct extends ProductSale{
    product: ProductWithTagsAndCoverImage
}

export interface ProductWithCoverImage extends Product{
    coverImage: Image
}

export interface FeaturedTagWithTagAndImage extends FeaturedTag{
    tag: Tag
    image: Image
}

export interface ProductWithTagsAndCoverImage extends ProductWithTags, ProductWithCoverImage{}

export interface FeaturedProductWithProduct{
    product: ProductWithTagsAndCoverImage
}

export interface FeaturedProductWithProductAndOrder extends FeaturedProductWithProduct {
    order: number
}

export interface ProductWithMedia extends ProductWithCoverImage{
    descriptionImages: Image[]
    videos: Video[]
}

export interface ProductWithcCompanies extends Product{
    developer: Company
    publisher: Company
}

export interface PurchaseWithInvoiceData extends Purchase{
    invoiceData: InvoiceData
}