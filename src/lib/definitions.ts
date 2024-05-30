import { Company, Image, Product, Tag, Video, Purchase, InvoiceData } from "@prisma/client";

export type ShoppingCart = number[];

export interface ProductWithTags extends Product{
    tags: Tag[]
}

export interface ProductWithCoverImage extends Product{
    coverImage: Image
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