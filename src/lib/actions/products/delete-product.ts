"use server";
import {auth} from "@/auth";
import {z} from "zod";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {garbageCollectImage, garbageCollectVideo} from "@/lib/actions/media-garbarge-collection";

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
            return await prisma.$transaction(async tx => {
                const product = await tx.product.findUnique({
                    where: {
                        id: id.data
                    }, include: {
                        descriptionImages: true,
                        videos: true,
                        publishers: true,
                        developers: true
                    }
                });
                if(!product)
                    return {success: false, error: "Product not found"}


                await tx.product.update({
                    where: {
                        id: id.data
                    },
                    data: {
                        descriptionImages: {
                            set: []
                        },
                        videos: {
                            set: []
                        },
                        available: false
                    }
                })

                try{
                    for(const image of product.descriptionImages){
                        const res = await garbageCollectImage(image, tx);
                        if(!res.success){
                            console.error("Error garbage collecting description image")
                        }
                    }

                    for(const video of product.videos){
                        const res = await garbageCollectVideo(video, tx);
                        if(!res.success){
                            console.error("Error garbage collecting description image")
                        }
                    }
                } catch(e){
                    console.error(e) // Garbage collection is not vital
                }
                revalidatePath("/", "layout");

                revalidatePath("/", "layout");
                revalidatePath("/api/internal/admin/sales");
                revalidatePath("/api/internal/admin/products");
                revalidatePath("/api/public/products");
                revalidatePath("/api/public/discounts");
                revalidatePath("/api/public/topsellers");
                return {success: true}
            }, {maxWait: 20000, timeout: 20000})

        } catch (e) {
            console.error(e)
            return {success: false, error: "Internal error"}
        }
    }
}