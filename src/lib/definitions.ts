import { Company, Image, Product, Tag, Video, Purchase, InvoiceData, ProductTag, FeaturedTag, ProductSale, VideoSource } from "@prisma/client";

export function removeReadOnlyForNumArray(arr: readonly number[]): number[] {
    return arr as number[]
}

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

export interface ProductForDetail extends ProductWithTagsAndCoverImage{
    videos: VideoWithThumbnail[],
    descriptionImages: Image[]
}

export interface VideoWithThumbnail extends Video{
    thumbnail: Image | null
}

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

export enum PurchaseError {
    VALIDATION_ERROR,
    PAYMENT_REJECTED_BAD_FILLED,
    PAYMENT_REJECTED_CALL_AUTHORIZE,
    PAYMENT_REJECTED_GENERIC,
    PURCHASE_FAILED
}

export type PurchaseResult = {
    success: true,
    purchaseId: number
} | {
    success: false,
    error: PurchaseError
}