export function formatPrice(price_cents: number): string {
    return `$${(price_cents / 100).toFixed(2)}`;	
}

export function formatDiscountPercent(original_price_cents: number, discounted_price_cents: number): string {
    const discount = 100 *(1 -(discounted_price_cents / original_price_cents));
    return `${discount.toFixed(0)}% off`;
}
export function formatPurchaseDateTime(date: Date): string {
    return date.toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false});
}

export function formatFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
}