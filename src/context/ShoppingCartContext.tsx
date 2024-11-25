"use client"
import {ShoppingCart} from "@/lib/definitions";
import {createContext, ReactNode, useContext, useEffect, useState} from "react"
import {CartApiResponse} from "@/app/api/internal/cart/types";
import {addToCart, removeFromCart} from "@/lib/actions/cart";


export const ShoppingCardContext = createContext<ShoppingCartContextValue | null>(null)

type ShoppingCartData = {
    dataAvailable: true
    data: Readonly<ShoppingCart>
} | {
    dataAvailable: false
    data: null
}

export interface ShoppingCartContextValue {
    shoppingCart: ShoppingCartData;
    addToCart: (productId: number) => Promise<Readonly<ShoppingCart>>;
    removeFromCart: (productId: number) => Promise<Readonly<ShoppingCart>>;
    refresh: () => void;
}

export function ShoppingCartProvider({children}: { children: ReactNode }) {
    const [data, setData] = useState<ShoppingCartData>({dataAvailable: false, data: null})
    useEffect(getData, []);

    function getData(){
        fetch("/api/internal/cart", {next: {tags: ["cart"]}})
            .then(async (res) => {
                if (res.ok) {
                    setData({dataAvailable: true, data: await res.json() as CartApiResponse})
                } else {
                    console.error("Failed to fetch cart data")
                }
            })
            .catch(console.error)
    }

    const value: ShoppingCartContextValue = {
        shoppingCart: data,
        addToCart: async(item: number) =>{
            const res = await addToCart(item);
            setData({dataAvailable: true, data: res});
            return res;
        },
        removeFromCart: async(item: number) =>{
            const res = await removeFromCart(item);
            setData({dataAvailable: true, data: res});
            return res;
        },
        refresh: getData
    }
    return <ShoppingCardContext.Provider value={value}>{children}</ShoppingCardContext.Provider>
}

export function useShoppingCartContext() {
    const context = useContext(ShoppingCardContext)
    if (!context) throw new Error("useShoppingCart must be used within a ShoppingCartProvider")
    return context
}


