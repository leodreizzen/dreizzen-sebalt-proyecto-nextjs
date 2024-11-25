"use server";
import {auth} from "@/auth";
import {z} from "zod";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

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