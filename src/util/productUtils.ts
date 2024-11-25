import {ProductWithSale} from "@/lib/definitions";

export function currentPrice(product: ProductWithSale): number {
    return product.sale?.currentPrice_cents ?? product.originalPrice_cents;
}