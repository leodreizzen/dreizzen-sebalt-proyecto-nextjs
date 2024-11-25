"use server";
import {Product, ProductSale} from "@prisma/client";
import {AdminOperationResult, ArrayElement} from "@/lib/definitions";
import {auth} from "@/auth";
import {z} from "zod";
import {FEATURED_TAG_IMAGE_FOLDER, MAX_FEATURED_SALES, MAX_FEATURED_TAGS} from "@/lib/config";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {getImageUrl} from "@/lib/cloudinary-utils";

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
                revalidatePath("/api/public/discounts")
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

async function asyncSome<T>(arr: T[], predicate: (el: T) => Promise<boolean>) {
    for (let e of arr) {
        if (await predicate(e)) return true;
    }
    return false;
}