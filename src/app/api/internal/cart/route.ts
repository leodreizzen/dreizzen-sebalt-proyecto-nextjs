import {getCart} from "@/lib/session-data";
import {NextResponse} from "next/server";
import {CartApiResponse} from "@/app/api/internal/cart/types";

export async function GET(_: Request): Promise<NextResponse<CartApiResponse>>{
    const cart = await getCart();
    return NextResponse.json(cart)
}