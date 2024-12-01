import {z} from "zod";
import DOMPurify from "isomorphic-dompurify";

export const ProductImageToSaveModel = z.union([
    z.object({
        type: z.literal("file"),
        isNew: z.literal(true),
        publicId: z.string(),
        folder: z.string(),
        alt: z.string().min(1)
    }),
    z.object({
        type: z.literal("url"),
        isNew: z.literal(true),
        url: z.string().min(1),
        alt: z.string().min(1)
    }),
    z.object({
        isNew: z.literal(false),
        id: z.number()
    })
])
export const VideoToSaveModel = z.union([
    z.object({
        isNew: z.literal(false),
        id: z.number()
    }),
    z.object({
        isNew: z.literal(true),
        sourceId: z.string(),
        source: z.enum(["YouTube", "SteamCdn", "Cloudinary"]),
        thumbnail: ProductImageToSaveModel.optional(),
        alt: z.string().min(1)
    }),
])
export const CompanyModel = z.union([
    z.object({
        isNew: z.literal(false),
        id: z.number(),
    }),
    z.object({
        isNew: z.literal(true),
        name: z.string().min(1),
    }),
])
export const TagModel = z.union([
    z.object({
        isNew: z.literal(false),
        id: z.number()
    }),
    z.object({
        isNew: z.literal(true),
        name: z.string().min(1),
    }),
])
export const ProductToAddModel = z.object({
    name: z.string().min(1),
    description: z.string().min(1).transform(description => DOMPurify.sanitize(description)),
    current_price_cents: z.number().int().positive(),
    original_price_cents: z.number().int().positive(),
    shortDescription: z.string().optional(),
    launchDate: z.string().date("Invalid date"),
    developers: z.array(CompanyModel),
    publishers: z.array(CompanyModel),
    coverImage: ProductImageToSaveModel,
    images: z.array(ProductImageToSaveModel),
    videos: z.array(VideoToSaveModel),
    tags: z.array(TagModel)
})
export type ProductVideoToSave = z.infer<typeof VideoToSaveModel>
export type ProductToAddServer = z.infer<typeof ProductToAddModel>
export type ProductImageToSave = z.infer<typeof ProductImageToSaveModel>
export const ProductToEditModel = ProductToAddModel.extend({
    id: z.number().int()
})
export type ProductToEditServer = z.infer<typeof ProductToEditModel>