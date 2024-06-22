"use server"
import {addToSessionCart, clearSessionCart, removeFromSessionCart} from "@/lib/session-data";
import {ProductSaleWithProduct, ShoppingCart} from "./definitions";
import {revalidatePath, revalidateTag} from "next/cache";
import {auth, signIn} from "@/auth";
import {AuthError} from "next-auth";
import {CallbackRouteError} from "@auth/core/errors";
import {Product, ProductSale} from "@prisma/client";
import {z} from "zod";
import prisma from "@/lib/prisma";
import {MAX_SALES} from "@/lib/config";


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

export async function saveFeaturedProducts(_formProducts: Product[]): Promise<AdminOperationResult>{
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
                revalidatePath("/admin/featured/products");
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

export async function saveFeaturedSales(_formSales: ProductSale[]): Promise<AdminOperationResult>{
    const isAuthorized = (await auth())?.user?.isAdmin;
    if(!isAuthorized)
        return {
            success: false,
            error: "Unauthorized"
        }

    const salesData = z.array(z.object({
        id: z.number()
    })).safeParse(_formSales);

    if(!salesData.success)
        return {
            success: false,
            error: "Invalid sales"
        }
    else{
        if(salesData.data.length > MAX_SALES){
            return {
                success: false,
                error: `Too many featured sales. The maximum is ${MAX_SALES}`
            }
        }
        try{
            const res: AdminOperationResult = await prisma.$transaction(async tx =>{
                    const validSales = await tx.productSale.findMany({
                        where: {
                            id: {
                                in: salesData.data.map(p => p.id)
                            }
                        }
                    });
                    if(validSales.length !== salesData.data.length)
                        return {
                            success: false,
                            error: "Invalid sales"
                        }
                    await tx.productSale.updateMany({
                        data:{
                            isFeatured: false
                        },
                        where:{
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
                ,{isolationLevel: "Serializable"})
            if(res.success){
                revalidatePath("/admin/featured/sales");
                revalidatePath("/products/discounts");
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