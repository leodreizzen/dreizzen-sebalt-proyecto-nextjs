"use server"
import {addToSessionCart, clearSessionCart, removeFromSessionCart} from "@/lib/session-data";
import {ShoppingCart} from "./definitions";
import {revalidatePath, revalidateTag} from "next/cache";
import {auth, signIn} from "@/auth";
import {AuthError} from "next-auth";
import {CallbackRouteError} from "@auth/core/errors";
import {Product} from "@prisma/client";
import {z} from "zod";
import prisma from "@/lib/prisma";

function revalidateCart(){
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

export async function clearCart(): Promise<void>{
    await clearSessionCart();
    revalidateCart();
}

export async function authenticate(_: string | undefined, formData: FormData): Promise<string | undefined> {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            if (error instanceof CallbackRouteError && (error.cause?.err as {code?: string})?.code === "credentials") {
                return 'Usuario o contraseña incorrectos';
            } else {
                return 'Ocurrió un error. Intente de nuevo más tarde';
            }
        }
        throw error;
    }
}

type AdminOperationResult = {success: true} | {success: false, error: string}

export async function setFeaturedProducts(_formProducts: Product[]): Promise<AdminOperationResult>{
    const isAuthorized = (await auth())?.user?.isAdmin;
    if(!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }

    const productsData = z.array(z.object({
        id: z.number()
    })).safeParse(_formProducts);

    if(!productsData.success)
        return {
            success: false,
            error: "Invalid products"
        }
    else{
        try{
            const res: AdminOperationResult = await prisma.$transaction(async tx =>{
                    const validProducts = await tx.product.findMany({
                        where: {
                            id: {
                                in: productsData.data.map(p => p.id)
                            }
                        }
                    });
                    if(validProducts.length !== productsData.data.length)
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
            ,{isolationLevel: "Serializable"})
            if(res.success){
                revalidatePath("/admin/featured");
                revalidatePath("/");
            }
            return res;
        }catch (e){
            console.error(e)
            return {
                success: false,
                error: "Internal error"
            }
        }
    }
}