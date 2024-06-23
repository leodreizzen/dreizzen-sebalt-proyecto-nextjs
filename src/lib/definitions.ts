import {
    Company,
    FeaturedProduct,
    FeaturedTag,
    Image,
    InvoiceData,
    Product,
    ProductSale,
    ProductTag,
    Purchase,
    PurchaseItem,
    Tag,
    Video
} from "@prisma/client";

export function removeReadOnlyForNumArray(arr: readonly number[]): number[] {
    return arr as number[]
}
export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;


export type ShoppingCart = number[];

export interface ProductWithTags extends Product{
    tags: ProductTagWithTag[]
}

export interface ProductTagWithTag extends ProductTag{
    tag: Tag
}

export interface AdminProduct extends ProductWithTagsAndCoverImage {
    purchases: PurchaseItem[]
}

export interface ProductSaleWithProduct extends ProductSale{
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
    publishers: Company[],
    developers: Company[],
    descriptionImages: Image[]
}

export interface VideoWithThumbnail extends Video{
    thumbnail: Image | null
}

export interface FeaturedProductWithProduct extends FeaturedProduct{
    product: ProductWithTagsAndCoverImage
}

export interface FeaturedProductSaleWithProduct extends ProductSale{
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

export interface PurchaseWithItemsAndInvoiceData extends PurchaseWithInvoiceData{
    products: PurchaseItem[]
}

export enum PurchaseError {
    VALIDATION_ERROR,
    PAYMENT_REJECTED_BAD_FILLED,
    PAYMENT_REJECTED_CALL_AUTHORIZE,
    PAYMENT_REJECTED_GENERIC,
    PURCHASE_FAILED,
    DUPLICATE_PURCHASE
}

export type PurchaseResult = {
    success: true,
    purchaseId: number
} | {
    success: false,
    error: PurchaseError
}
export type AdminOperationResult = { success: true } | { success: false, error: string }