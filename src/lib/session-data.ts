import 'server-only';
import { get, set } from './session-store';
import { ShoppingCart } from './definitions';
import { productPlaceholders } from './placeholders';
import { revalidatePath } from 'next/cache';

export async function getCart(): Promise<Readonly<ShoppingCart>> {
    const storedCart = await get('cart');
    if (!storedCart) {
        return [];
    }

    const validProductIds = (storedCart as number[]).filter(p => productPlaceholders.map(product => product.id).includes(p));
    const invalidProductIds = (storedCart as number[]).filter(p => productPlaceholders.map(product => product.id).includes(p));

    if (invalidProductIds.length > 0) {
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
    if (!cart.includes(productId) && productPlaceholders.map(product => product.id).includes(productId)) {
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
