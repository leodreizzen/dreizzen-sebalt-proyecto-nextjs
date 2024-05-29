"use client"

import { ShoppingCart } from "@/lib/definitions";
import {createContext, useContext} from "react"

export const ShoppingCardContext = createContext<ShoppingCartContextValue|null>(null)


export interface ShoppingCartContextValue {
    shoppingCart: Readonly<ShoppingCart>;
    addToCart: (productId: number) => Promise<Readonly<ShoppingCart>>;
    removeFromCart: (productId: number) => Promise<Readonly<ShoppingCart>>;
}

export function ShoppingCartProvider({value, children}: {value:ShoppingCartContextValue, children: React.ReactNode}) {
    return <ShoppingCardContext.Provider value={value}>{children}</ShoppingCardContext.Provider>
}

export function useShoppingCartContext() {
    const context = useContext(ShoppingCardContext)
    if(!context) throw new Error("useShoppingCart must be used within a ShoppingCartProvider")
    return context
}


