"use server"
import {addToSessionCart, clearSessionCart, removeFromSessionCart} from "@/lib/session-data";
import {AdminOperationResult, ArrayElement, ShoppingCart} from "./definitions";
import {revalidatePath, revalidateTag} from "next/cache";
import {auth, signIn} from "@/auth";
import {AuthError} from "next-auth";
import {CallbackRouteError} from "@auth/core/errors";
import {$Enums, PendingMediaType, Product, ProductSale, VideoSource} from "@prisma/client";
import {z} from "zod";
import prisma from "@/lib/prisma";
import {
    FEATURED_TAG_IMAGE_FOLDER,
    MAX_FEATURED_SALES,
    MAX_FEATURED_TAGS,
    PRODUCT_IMAGE_FOLDER,
    PRODUCT_VIDEO_FOLDER
} from "@/lib/config";
import {v2 as cloudinaryV2} from "cloudinary";
import {randomUUID} from "node:crypto";
import PendingMediaSource = $Enums.PendingMediaSource;
import {redirect} from "next/navigation";

if (!process.env.CLOUDINARY_API_SECRET)
    throw new Error("Missing CLOUDINARY_API_SECRET")

const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set")
}
const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME


function revalidateCart() {
    revalidatePath("/cart");
    revalidatePath("/purchase");
    revalidateTag("cart");
}

export async function addToCart(productId: number): Promise<ShoppingCart> {
    const cart = await addToSessionCart(productId);
    revalidateCart();
    return cart;
}

export async function removeFromCart(productId: number): Promise<ShoppingCart> {
    const cart = await removeFromSessionCart(productId);
    revalidateCart();
    return cart;
}

export async function clearCart(): Promise<void> {
    await clearSessionCart();
    revalidateCart();
}

export async function authenticate(_: string | undefined, formData: FormData): Promise<string | undefined> {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            if (error instanceof CallbackRouteError && (error.cause?.err as {
                code?: string
            })?.code === "credentials") {
                return 'Usuario o contraseña incorrectos';
            } else {
                return 'Ocurrió un error. Intente de nuevo más tarde';
            }
        }
        throw error;
    }
}

export async function saveFeaturedProducts(_formProducts: Product[]): Promise<AdminOperationResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }

    const productsData = z.array(z.object({
        id: z.number()
    })).safeParse(_formProducts);

    if (!productsData.success)
        return {
            success: false,
            error: "Invalid products"
        }
    else {
        try {
            const res: AdminOperationResult = await prisma.$transaction(async tx => {
                    const validProducts = await tx.product.findMany({
                        where: {
                            id: {
                                in: productsData.data.map(p => p.id)
                            }
                        }
                    });
                    if (validProducts.length !== productsData.data.length)
                        return {
                            success: false,
                            error: "Invalid products"
                        }
                    await tx.featuredProduct.deleteMany({});
                    await tx.featuredProduct.createMany({
                        data: productsData.data.map((p, index) => ({
                            productId: p.id,
                            order: index
                        }))
                    })
                    return {success: true}
                }
                , {isolationLevel: "Serializable"})
            if (res.success) {
                revalidatePath("/admin/featured/products");
                revalidatePath("/");
            }
            return res;
        } catch (e) {
            console.error(e)
            return {
                success: false,
                error: "Internal error"
            }
        }
    }
}

export async function saveFeaturedSales(_formSales: ProductSale[]): Promise<AdminOperationResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }

    const salesData = z.array(z.object({
        id: z.number()
    })).safeParse(_formSales);

    if (!salesData.success)
        return {
            success: false,
            error: "Invalid sales"
        }
    else {
        if (salesData.data.length > MAX_FEATURED_SALES) {
            return {
                success: false,
                error: `Too many featured sales. The maximum is ${MAX_FEATURED_SALES}`
            }
        }
        try {
            const res: AdminOperationResult = await prisma.$transaction(async tx => {
                    const validSales = await tx.productSale.findMany({
                        where: {
                            id: {
                                in: salesData.data.map(p => p.id)
                            }
                        }
                    });
                    if (validSales.length !== salesData.data.length)
                        return {
                            success: false,
                            error: "Invalid sales"
                        }
                    await tx.productSale.updateMany({
                        data: {
                            isFeatured: false
                        },
                        where: {
                            isFeatured: true
                        }
                    })
                    await tx.productSale.updateMany({
                        data: {
                            isFeatured: true
                        },
                        where: {
                            id: {
                                in: salesData.data.map(p => p.id)
                            }
                        }
                    })
                    return {success: true}
                }
                , {isolationLevel: "Serializable"})
            if (res.success) {
                revalidatePath("/admin/featured/sales");
                revalidatePath("/products/discounts");
            }
            return res;
        } catch (e) {
            console.error(e)
            return {
                success: false,
                error: "Internal error"
            }
        }
    }
}

export type UploadData = {
    resource_type: string
    folder: string
    id: string
    timestamp: number
    signature: string
}


type AuthorizeMediaUploadResult = {
    success: true
    uploadData: UploadData
} | {
    success: false,
    error: string
}


export async function authorizeFeaturedTagImageUpload(): Promise<AuthorizeMediaUploadResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    return _internalAuthorizeImageUpload(FEATURED_TAG_IMAGE_FOLDER)
}

export async function authorizeProductImageUpload(): Promise<AuthorizeMediaUploadResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    return _internalAuthorizeImageUpload(PRODUCT_IMAGE_FOLDER)
}

export async function authorizeProductVideoUpload(): Promise<AuthorizeMediaUploadResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    return _internalAuthorizeVideoUpload(PRODUCT_VIDEO_FOLDER)
}

export async function _internalAuthorizeVideoUpload(folder: string): Promise<AuthorizeMediaUploadResult> {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const id = randomUUID();
    const resource_type = "video";
    try {
        const signature = cloudinaryV2.utils.api_sign_request({
            timestamp: timestamp,
            folder: folder,
            public_id: id
        }, CLOUDINARY_API_SECRET);

        await prisma.pendingMedia.create({
            data: {
                publicId: id,
                folder,
                type: PendingMediaType.VIDEO,
                source: PendingMediaSource.CLOUDINARY
            }
        })
        return {success: true, uploadData: {resource_type, folder, id, timestamp, signature}};

    } catch (e) {
        console.error(e)
        return {success: false, error: "Internal error"}
    }
}

async function _internalAuthorizeImageUpload(folder: string): Promise<AuthorizeMediaUploadResult> {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const id = randomUUID();
    const resource_type = "image";
    try {
        const signature = cloudinaryV2.utils.api_sign_request({
            timestamp: timestamp,
            folder: folder,
            public_id: id
        }, CLOUDINARY_API_SECRET);

        await prisma.pendingMedia.create({
            data: {
                publicId: id,
                folder,
                type: PendingMediaType.IMAGE,
                source: PendingMediaSource.CLOUDINARY
            }
        })
        return {success: true, uploadData: {resource_type, folder, id, timestamp, signature}};

    } catch (e) {
        console.error(e)
        return {success: false, error: "Internal error"}
    }
}

export type SaveFeaturedTagsParam = {
    id: number
    image: SaveFeaturedTagsImage
}[]

const FeaturedTagImageToSaveModel = z.union([
    z.object({
        isNew: z.literal(true),
        publicId: z.string(),
        folder: z.string(),
        alt: z.string().min(1)
    }),
    z.object({
        isNew: z.literal(false),
        id: z.number()
    })
])

const SaveFeaturedTagsImageZodModel = z.array(z.object(
    {
        id: z.number().int(),
        image: FeaturedTagImageToSaveModel
    }
))


export type SaveFeaturedTagsImage = z.infer<typeof FeaturedTagImageToSaveModel>


export async function saveFeaturedTags(_formTags: SaveFeaturedTagsParam): Promise<AdminOperationResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }

    const tags = SaveFeaturedTagsImageZodModel.safeParse(_formTags);
    if (!tags.success)
        return {
            success: false,
            error: "Invalid data"
        }
    const tagsData = tags.data;
    if (tagsData.length > MAX_FEATURED_TAGS) {
        return {
            success: false,
            error: `Too many featured tags. The maximum is ${MAX_FEATURED_TAGS}`
        }
    }
    const newImages = tagsData.map(t => t.image).filter(i => i.isNew) as
        ((ArrayElement<typeof tags.data>["image"]) & {
            isNew: true
        })[]
    const existingImages = tagsData.map(t => t.image).filter(i => !i.isNew) as
        ((ArrayElement<typeof tags.data>["image"]) & {
            isNew: false
        })[]
    if (await asyncSome(newImages, async i => !await imageExists(i.folder, i.publicId)))
        return {
            success: false,
            error: "One of the new images does not exist in the server"
        }
    if (newImages.some(i => i.folder !== FEATURED_TAG_IMAGE_FOLDER))
        return {
            success: false,
            error: "One of the new images is in the wrong folder"
        }

    try {
        return prisma.$transaction(async tx => {
            const validTagCount = await tx.tag.count({
                where: {
                    id: {
                        in: tagsData.map(t => t.id)
                    }
                }
            })

            if (validTagCount !== tagsData.length)
                return {
                    success: false,
                    error: "One of the tags is invalid"
                }

            const validExistingImagesCount = await tx.image.count({
                where: {
                    id: {
                        in: existingImages.map(i => i.id)
                    }
                }
            })
            if (validExistingImagesCount !== existingImages.length)
                return {
                    success: false,
                    error: "One of the existing images is invalid"
                }

            const validPendingCount = await tx.pendingMedia.count({
                    where: {
                        OR: newImages.map(i => ({
                            publicId: i.publicId,
                            folder: i.folder
                        }))
                    }
                }
            )
            if (validPendingCount !== newImages.length)
                return {
                    success: false,
                    error: "One of the new images is invalid"
                }

            await tx.featuredTag.deleteMany({})

            for (let i = 0; i < tagsData.length; i++) {
                const t = tagsData[i];
                console.log(i)
                await tx.featuredTag.create({
                    data: {
                        tag: {
                            connect: {
                                id: t.id
                            }
                        },
                        image: t.image.isNew ? {
                                create: {
                                    url: getImageUrl(t.image.folder, t.image.publicId),
                                    alt: t.image.alt,
                                }
                            }
                            : {
                                connect: {
                                    id: t.image.id
                                }
                            },
                        order: i
                    }
                })
            }
            tx.pendingMedia.deleteMany({
                where: {
                    OR: newImages.map(i => ({
                        publicId: i.publicId,
                        folder: i.folder
                    }))
                }
            })
            revalidatePath("/")
            revalidatePath("/admin/featured/tags")
            return {success: true}
        }, {isolationLevel: "Serializable", maxWait: 5000, timeout: 30000})
    } catch (e) {
        console.error(e)
        return {
            success: false,
            error: "Internal error"
        }
    }
}


async function imageExists(folder: string, publicId: string): Promise<boolean> {
    const url = getImageUrl(folder, publicId)
    const res = await fetch(url, {method: "HEAD"});
    return res.ok;
}

function getImageUrl(folder: string, publicId: string): string {
    return cloudinaryV2.utils.url(`${folder}/${publicId}`, {resource_type: "image", cloud_name: cloudinaryCloudName})
}

async function asyncSome<T>(arr: T[], predicate: (el: T) => Promise<boolean>) {
    for (let e of arr) {
        if (await predicate(e)) return true;
    }
    return false;
};

const ProductImageToSaveModel = z.union([
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


const VideoToSaveModel = z.union([
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

const CompanyModel = z.union([
    z.object({
        isNew: z.literal(false),
        id: z.number(),
    }),
    z.object({
        isNew: z.literal(true),
        name: z.string().min(1),
    }),
])

const TagModel = z.union([
    z.object({
        isNew: z.literal(false),
        id: z.number()
    }),
    z.object({
        isNew: z.literal(true),
        name: z.string().min(1),
    }),
])
const ProductToAddModel = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
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

const ProductToEditModel = ProductToAddModel.extend({
    id: z.number().int()
})

export type ProductVideoToSave = z.infer<typeof VideoToSaveModel>
export type ProductToAddServer = z.infer<typeof ProductToAddModel>
export type ProductImageToSave = z.infer<typeof ProductImageToSaveModel>
export type ProductToEditServer = z.infer<typeof ProductToEditModel>

export async function addProduct(_formProduct: ProductToAddServer): Promise<AdminOperationResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    const product = ProductToAddModel.safeParse(_formProduct);
    if (!product.success) {
        console.error(product.error.errors)
        return {
            success: false,
            error: "Invalid data"
        }
    }
    const productData = product.data;

    if (productData.current_price_cents > productData.original_price_cents)
        return {
            success: false,
            error: "Current price must be less than or equal to original price"
        }

    const existingPublishers = productData.publishers.filter(p => !p.isNew) as (ArrayElement<typeof productData.publishers> & {
        isNew: false
    })[]
    const existingDevelopers = productData.developers.filter(p => !p.isNew) as (ArrayElement<typeof productData.developers> & {
        isNew: false
    })[]
    const newPublishers = productData.publishers.filter(p => p.isNew) as (ArrayElement<typeof productData.publishers> & {
        isNew: true
    })[]
    const newDevelopers = productData.developers.filter(p => p.isNew) as (ArrayElement<typeof productData.developers> & {
        isNew: true
    })[]

    const newTags = productData.tags.filter(t => t.isNew) as (ArrayElement<typeof productData.developers> & {
        isNew: true
    }) []

    const newImages = productData.images.filter(i => i.isNew) as (ArrayElement<typeof productData.images> & {
        isNew: true
    })[]

    const newVideos = productData.videos.filter(v => v.isNew) as (ArrayElement<typeof productData.videos> & {
        isNew: true
    })[]

    const existingImages = productData.images.filter(i => !i.isNew) as (ArrayElement<typeof productData.images> & {
        isNew: false
    })[]

    const existingVideos = productData.videos.filter(v => !v.isNew) as (ArrayElement<typeof productData.videos> & {
        isNew: false
    })[]



    try {
        return await prisma.$transaction(async tx => {
            const product = await tx.product.create({
                data: {
                    name: productData.name,
                    publishers: {
                        connectOrCreate: newPublishers.map(pub => ({
                            where: {name: pub.name},
                            create: {
                                name: pub.name
                            }
                        })),
                        connect: existingPublishers.map(pub => ({
                            id: pub.id
                        }))
                    },
                    developers: {
                        connectOrCreate: newDevelopers.map(pub => ({
                            where: {name: pub.name},
                            create: {
                                name: pub.name
                            }
                        })),
                        connect: existingDevelopers.map(pub => ({
                            id: pub.id
                        }))
                    },
                    currentPrice_cents: productData.current_price_cents,
                    originalPrice_cents: productData.original_price_cents,
                    coverImage: productData.coverImage.isNew ? {
                        create: {
                            url: getProductImageUrl(productData.coverImage),
                            alt: productData.coverImage.alt,
                        }
                    } : {
                        connect: {
                            id: productData.coverImage.id
                        }
                    },
                    shortDescription: productData.shortDescription,
                    description: productData.description,
                    launchDate: productData.launchDate + "T00:00:00.000Z",
                    descriptionImages: {
                        create: newImages.map(img => ({
                            url: getProductImageUrl(img),
                            alt: img.alt
                        })),
                        connect: existingImages.map(img => ({
                            id: img.id
                        }))
                    },
                    videos: {
                        create: newVideos.map(video => ({
                            source: mapVideoSource(video),
                            sourceId: video.sourceId,
                            alt: video.alt,
                            thumbnail: video.thumbnail? ( video.thumbnail.isNew ? {
                                create: {
                                    url: getProductImageUrl(video.thumbnail),
                                    alt: video.thumbnail.alt
                                }
                            }: {
                                connect: {
                                    id: video.thumbnail.id
                                }
                            }) : undefined
                        })),
                        connect: existingVideos.map(video => ({
                            id: video.id
                        }))
                    }
                }
            })
            if(productData.current_price_cents != productData.original_price_cents)
                await tx.productSale.create({
                    data: {
                        product: {
                            connect: {
                                id: product.id
                            }
                        },
                        currentPrice_cents: productData.current_price_cents,
                        originalPrice_cents: productData.original_price_cents,
                        isFeatured: false
                    }
                })
            for (const tag of newTags){
                await tx.tag.upsert({
                    where:{
                        name: tag.name
                    },
                    update:{},
                    create: {
                        name: tag.name,
                        inDropdown: false
                    }
                })
            }

            for (let i = 0; i < productData.tags.length; i++) {
                const tag = productData.tags[i]
                await tx.productTag.create({
                    data: {
                        product: {
                            connect: {
                                id: product.id
                            }
                        },
                        tag: {
                            connect: tag.isNew ? {
                                name: tag.name
                            } : {
                                id: tag.id
                            }
                        },
                        order: i
                    }
                })
            }
            revalidatePath("/", "layout");
            return {success: true}
        }, {isolationLevel: "Serializable", maxWait: 10000, timeout: 30000})
    } catch (e) {
        console.error(e)
        return {success: false, error: "Internal error"}
    }

}


function getProductImageUrl(coverImage: ProductImageToSave & { isNew: true }): string {
    if (coverImage.type === "url")
        return coverImage.url
    else
        return getImageUrl(coverImage.folder, coverImage.publicId)

}

function mapVideoSource(video: ProductVideoToSave & { isNew: true }): VideoSource {
    if (video.source === "SteamCdn")
        return VideoSource.STEAMCDN
    else if (video.source === "YouTube")
        return VideoSource.YOUTUBE
    else if (video.source === "Cloudinary")
        return VideoSource.CLOUDINARY
    else throw new Error("Invalid video source")
}

export async function deleteProduct(_formID: number) {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    const id = z.number().int().safeParse(_formID)
    if (!id.success)
        return {
            success: false,
            error: "Invalid data"
        }
    else {
        try {
            await prisma.product.update({
                where: {
                    id: id.data
                },
                data: {
                    available: false
                }
            })
            revalidatePath("/", "layout");
            return {success: true}
        } catch (e) {
            console.error(e)
            return {success: false, error: "Internal error"}
        }
    }
}


export async function editProduct(_formProduct: ProductToEditServer): Promise<AdminOperationResult> {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    const product = ProductToEditModel.safeParse(_formProduct);
    if (!product.success) {
        console.error(product.error.errors)
        return {
            success: false,
            error: "Invalid data"
        }
    }
    const productData = product.data;

    if (productData.current_price_cents > productData.original_price_cents)
        return {
            success: false,
            error: "Current price must be less than or equal to original price"
        }

    const existingPublishers = productData.publishers.filter(p => !p.isNew) as (ArrayElement<typeof productData.publishers> & {
        isNew: false
    })[]
    const existingDevelopers = productData.developers.filter(p => !p.isNew) as (ArrayElement<typeof productData.developers> & {
        isNew: false
    })[]
    const newPublishers = productData.publishers.filter(p => p.isNew) as (ArrayElement<typeof productData.publishers> & {
        isNew: true
    })[]
    const newDevelopers = productData.developers.filter(p => p.isNew) as (ArrayElement<typeof productData.developers> & {
        isNew: true
    })[]

    const newTags = productData.tags.filter(t => t.isNew) as (ArrayElement<typeof productData.developers> & {
        isNew: true
    }) []

    const newImages = productData.images.filter(i => i.isNew) as (ArrayElement<typeof productData.images> & {
        isNew: true
    })[]

    const newVideos = productData.videos.filter(v => v.isNew) as (ArrayElement<typeof productData.videos> & {
        isNew: true
    })[]

    const existingImages = productData.images.filter(i => !i.isNew) as (ArrayElement<typeof productData.images> & {
        isNew: false
    })[]

    const existingVideos = productData.videos.filter(v => !v.isNew) as (ArrayElement<typeof productData.videos> & {
        isNew: false
    })[]



    try {
        return await prisma.$transaction(async tx => {

            const existingProduct = await tx.product.findUnique({
                where: {
                    id: productData.id
                }
            })

            if(existingProduct === null)
                return {
                    success: false,
                    error: "The product does not exist"
                }

            await tx.product.update({
                where: {
                    id: productData.id,
                },
                data: {
                    descriptionImages: {
                        set: []
                    },
                    videos: {
                        set: []
                    },
                    publishers: {
                        set: []
                    },
                    developers: {
                        set: []
                    }
                }
            })


            await tx.productTag.deleteMany({
                where: {
                    productId: productData.id
                }
            })


            const product = await tx.product.update({
                where: {
                    id: productData.id
                },
                data: {
                    name: productData.name,
                    publishers: {
                        connectOrCreate: newPublishers.map(pub => ({
                            where: {name: pub.name},
                            create: {
                                name: pub.name
                            }
                        })),
                        connect: existingPublishers.map(pub => ({
                            id: pub.id
                        }))
                    },
                    developers: {
                        connectOrCreate: newDevelopers.map(pub => ({
                            where: {name: pub.name},
                            create: {
                                name: pub.name
                            }
                        })),
                        connect: existingDevelopers.map(pub => ({
                            id: pub.id
                        }))
                    },
                    currentPrice_cents: productData.current_price_cents,
                    originalPrice_cents: productData.original_price_cents,
                    coverImage: productData.coverImage.isNew ? {
                        create: {
                            url: getProductImageUrl(productData.coverImage),
                            alt: productData.coverImage.alt,
                        }
                    } : {
                        connect: {
                            id: productData.coverImage.id
                        }
                    },
                    shortDescription: productData.shortDescription,
                    description: productData.description,
                    launchDate: productData.launchDate + "T00:00:00.000Z",
                    descriptionImages: {
                        create: newImages.map(img => ({
                            url: getProductImageUrl(img),
                            alt: img.alt
                        })),
                        connect: existingImages.map(img => ({
                            id: img.id
                        }))
                    },
                    videos: {
                        create: newVideos.map(video => ({
                            source: mapVideoSource(video),
                            sourceId: video.sourceId,
                            alt: video.alt,
                            thumbnail: video.thumbnail? ( video.thumbnail.isNew ? {
                                create: {
                                    url: getProductImageUrl(video.thumbnail),
                                    alt: video.thumbnail.alt
                                }
                            }: {
                                connect: {
                                    id: video.thumbnail.id
                                }
                            }) : undefined
                        })),
                        connect: existingVideos.map(video => ({
                            id: video.id
                        }))
                    }
                }
            })

            if(productData.current_price_cents != productData.original_price_cents)
                await tx.productSale.upsert({
                    where:{
                        productId: product.id
                    },
                    update: {
                        currentPrice_cents: productData.current_price_cents,
                        originalPrice_cents: productData.original_price_cents,
                        isFeatured: false
                    },
                    create: {
                        product: {
                            connect: {
                                id: product.id
                            }
                        },
                        currentPrice_cents: productData.current_price_cents,
                        originalPrice_cents: productData.original_price_cents,
                        isFeatured: false
                    }
                })
            else
                await prisma.productSale.deleteMany({
                    where: {
                        productId: productData.id
                    }
                })
            for (const tag of newTags){
                await tx.tag.upsert({
                    where:{
                        name: tag.name
                    },
                    update:{},
                    create: {
                        name: tag.name,
                        inDropdown: false
                    }
                })
            }
            for (let i = 0; i < productData.tags.length; i++) {
                const tag = productData.tags[i]
                await tx.productTag.create({
                    data: {
                        product: {
                            connect: {
                                id: product.id
                            }
                        },
                        tag: {
                            connect: tag.isNew ? {
                                name: tag.name
                            } : {
                                id: tag.id
                            }
                        },
                        order: i
                    }
                })
            }
            revalidatePath("/", "layout");
            return {success: true}
        }, {isolationLevel: "Serializable", maxWait: 10000, timeout: 30000})
    } catch (e) {
        console.error(e)
        return {success: false, error: "Internal error"}
    }
}

export async function deleteTag(_formTagId: number) {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    const tagId = z.number().int().safeParse(_formTagId)
    if (!tagId.success)
        return {
            success: false,
            error: "Invalid data"
        }
    else {
        try {
            await prisma.$transaction(async tx => {
                await tx.productTag.deleteMany({
                    where: {
                        tagId: tagId.data
                    }
                })
                await tx.featuredTag.deleteMany({
                    where: {
                        tagId: tagId.data
                    }
                })
                await tx.tag.delete({
                    where: {
                        id: tagId.data
                    }
                })
            })

            revalidatePath("/", "layout");
            return {success: true}
        } catch (e) {
            console.error(e)
            return {success: false, error: "Internal error"}
        }
    }
}

export async function setTagDropdown(_formTagId: number, _formInDropdown: boolean) {
    const isAuthorized = (await auth())?.user?.isAdmin;
    if (!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }
    const tagId = z.number().int().safeParse(_formTagId)
    const inDropdown = z.boolean().safeParse(_formInDropdown)
    if (!tagId.success || !inDropdown.success)
        return {
            success: false,
            error: "Invalid data"
        }
    else {
        try {
            await prisma.tag.update({
                where: {
                    id: tagId.data
                },
                data: {
                    inDropdown: inDropdown.data
                }
            })
            revalidatePath("/", "layout");
            return {success: true}
        } catch (e) {
            console.error(e)
            return {success: false, error: "Internal error"}
        }
    }
}