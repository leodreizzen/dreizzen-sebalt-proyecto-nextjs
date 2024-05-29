"use server"
import {addToSessionCart, removeFromSessionCart} from "@/lib/session-data";
import { ShoppingCart } from "./definitions";
import { revalidatePath } from "next/cache";
export async function addToCart(productId: number): Promise<ShoppingCart>{
    const cart = await addToSessionCart(productId);
    revalidatePath("/", "layout");
    return cart
}

export async function removeFromCart(productId: number): Promise<ShoppingCart>{
    const cart = await removeFromSessionCart(productId);
    revalidatePath("/", "layout");
    return cart
}