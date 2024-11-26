"use server";
import {AdminOperationResult, ArrayElement} from "@/lib/definitions";
import {auth} from "@/auth";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {ProductToAddModel, ProductToAddServer} from "@/lib/actions/products/models";
import {
    asyncSome,
    getProductImageUrl,
    imageExists,
    mapVideoSource,
    urlExists,
    videoExists
} from "@/lib/actions/products/utils";
import {PRODUCT_IMAGE_FOLDER, PRODUCT_VIDEO_FOLDER} from "@/lib/config";

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

    const existingTags = productData.tags.filter(t => !t.isNew) as (ArrayElement<typeof productData.tags> & {
        isNew: false
    })[]

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

    const newFileImages = newImages.filter(i => i.type == "file") as (ArrayElement<typeof newImages> & {
        type: "file"
    })[]

    const newUrlImages = newImages.filter(i => i.type == "url") as (ArrayElement<typeof newImages> & {
        type: "url"
    })[]


    if (await asyncSome(newFileImages, async i => !await imageExists(i.folder, i.publicId)))
        return {
            success: false,
            error: "One of the new images does not exist in the server"
        }
    if (newFileImages.some(i => i.folder !== PRODUCT_IMAGE_FOLDER))
        return {
            success: false,
            error: "One of the new images is in the wrong folder"
        }

    if(await asyncSome(newUrlImages, async i => !await urlExists(i.url))){
        return {
            success: false,
            error: "One of the new url images does not exist"
        }
    }

    if(await asyncSome(newVideos, async v => !await videoExists(v))){
        return {
            success: false,
            error: "One of the new videos does not exist in the server"
        }
    }

    const cloudinaryVideos = newVideos.filter(v => v.source === "Cloudinary") as (ArrayElement<typeof newVideos> & {
        source: "Cloudinary"
    })[]

    try {
        return await prisma.$transaction(async tx => {
            const foundTags = await tx.tag.findMany({
                where: {
                    id: {
                        in: existingTags.map(t => t.id)
                    }
                }
            });
            if(foundTags.length !== existingTags.length)
                return {
                    success: false,
                    error: "One of the existing tags is invalid"
                }

            const existingProduct = await tx.product.findUnique({
                where: {
                    name: productData.name
                }
            });



            const validPendingImageCount = await tx.pendingMedia.count({
                    where: {
                        OR: newFileImages.map(i => ({
                            publicId: i.publicId,
                            folder: i.folder
                        }))
                    }
                }
            )
            if (validPendingImageCount !== newFileImages.length)
                return {
                    success: false,
                    error: "One of the new images is invalid"
                }

            const validPendingVideoCount = await tx.pendingMedia.count({
                where: {
                    OR: cloudinaryVideos.map(v => ({
                        publicId: v.sourceId,
                        folder: PRODUCT_VIDEO_FOLDER
                    }))
                }
            });
            if(validPendingVideoCount !== cloudinaryVideos.length)
                return {
                    success: false,
                    error: "One of the new videos is invalid"
                }

            if(existingProduct){
                if(existingProduct.available)
                    return {success: false, error: "There is already a product with this name"}
                else{
                    await tx.product.update({
                        where: {
                            name: existingProduct.name
                        },
                        data: {
                            name: `${existingProduct.name} (deleted #${existingProduct.id})`
                        }
                    })
                }
            }
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
                            thumbnail: video.thumbnail ? (video.thumbnail.isNew ? {
                                create: {
                                    url: getProductImageUrl(video.thumbnail),
                                    alt: video.thumbnail.alt
                                }
                            } : {
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
            if (productData.current_price_cents != productData.original_price_cents)
                await tx.productSale.create({
                    data: {
                        product: {
                            connect: {
                                id: product.id
                            }
                        },
                        currentPrice_cents: productData.current_price_cents,
                        isFeatured: false
                    }
                })
            for (const tag of newTags) {
                await tx.tag.upsert({
                    where: {
                        name: tag.name
                    },
                    update: {},
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

            await tx.pendingMedia.deleteMany({
                where: {
                    OR: newFileImages.map(i => ({
                        publicId: i.publicId,
                        folder: i.folder
                    }))
                }})

            await tx.pendingMedia.deleteMany({
                where: {
                    OR: cloudinaryVideos.map(v => ({
                        publicId: v.sourceId,
                        folder: PRODUCT_VIDEO_FOLDER
                    }))
                }
            })

            revalidatePath("/", "layout");
            if(newDevelopers.length > 0 || newPublishers.length > 0)
                revalidatePath("/api/internal/admin/companies");
            if(newTags.length > 0)
                revalidatePath("/api/internal/admin/tags");

            revalidatePath("/api/internal/admin/sales");
            revalidatePath("/api/internal/admin/products");
            revalidatePath("/api/public/products");
            revalidatePath("/api/public/discounts");
            revalidatePath("/api/public/topsellers");
            return {success: true}
        }, {isolationLevel: "Serializable", maxWait: 10000, timeout: 30000})
    } catch (e) {
        console.error(e)
        return {success: false, error: "Internal error"}
    }

}

