"use client"
import ShoppingCartIcon from "./icons/ShoppingCartIcon";
import { useRef } from "react";
import {usePress} from "@react-aria/interactions";

export default function AddToCartButton() {    
    const ref = useRef<HTMLDivElement>(null);

    const {pressProps} = usePress({
        ref,
        onPress: handleCartPress
    })
    function handleCartPress(){
        alert("Added to cart")
    }

    return (
        <div className="flex bg-green-300 p-2 hover:bg-green-400 active:bg-green-600 rounded-lg items-center" {...pressProps} ref={ref}>
            <ShoppingCartIcon className="text-black pr-1" />
            <p className="text-md text-black">Agregar al carrito</p>
        </div>
    )
}