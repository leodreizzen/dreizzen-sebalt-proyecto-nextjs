"use server";
import {auth} from "@/auth";
import {z} from "zod";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

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