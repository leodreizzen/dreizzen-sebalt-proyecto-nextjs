import 'server-only';
import {get, set} from './session-store';
import {ShoppingCart} from './definitions';
import {revalidatePath} from 'next/cache';
import {fetchValidProducts, validateProduct} from "@/lib/data";

export async function getCart(): Promise<Readonly<ShoppingCart>> {
    const storedCart = await get('cart') as number[] | null;
    if (!storedCart) {
        return [];
    }

    const validProductIds = await fetchValidProducts(storedCart)
    let allValid = true;

    if (validProductIds.length != storedCart.length)
        allValid = false;
    else {
        for (let i = 0; i < storedCart.length; i++)
            if (storedCart[i] != validProductIds[i])
                allValid = false;

    }

    if (!allValid) {
        await set('cart', validProductIds);
        revalidatePath('/', "layout")
    }

    return validProductIds;
}

export async function addToSessionCart(productId: number): Promise<ShoppingCart> {
    let cart = await get('cart') as number[] | null;
    if (!cart) {
        cart = [];
    }
    if (!cart.includes(productId) && await validateProduct(productId)) {
        cart.push(productId);
        await set('cart', cart);
    }
    return cart;
}

export async function removeFromSessionCart(productId: number): Promise<ShoppingCart> {
    let cart = await get('cart') as number[] | null;
    if (!cart) {
        return [];
    }
    const index = cart.indexOf(productId);
    if (index !== -1) {
        cart.splice(index, 1);
        await set('cart', cart);
    }
    return cart;
}

export async function clearSessionCart(): Promise<void> {
    await set('cart', []);
}
