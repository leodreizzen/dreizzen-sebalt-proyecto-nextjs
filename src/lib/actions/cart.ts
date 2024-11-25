"use server";
import {ShoppingCart} from "@/lib/definitions";
import {addToSessionCart, clearSessionCart, removeFromSessionCart} from "@/lib/session-data";
import {revalidatePath, revalidateTag} from "next/cache";

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