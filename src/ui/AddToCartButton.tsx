"use client"
import ShoppingCartIcon from "./icons/ShoppingCartIcon";
import { useRef } from "react";
import {usePress} from "@react-aria/interactions";
import clsx from "clsx";

export default function AddToCartButton({className, iconClassName, textClassName}: {className?: string, iconClassName?: string, textClassName?: string}) {    
    const ref = useRef<HTMLDivElement>(null);

    const {pressProps} = usePress({
        ref,
        onPress: handleCartPress
    })
    function handleCartPress(){
        alert("Added to cart")
    }

    return (
        <div className={clsx(className, "flex bg-green-300 p-1 justify-center hover:bg-green-400 active:bg-green-600 rounded-lg items-center")} {...pressProps} ref={ref}>
            <ShoppingCartIcon className={clsx(iconClassName, "text-black", "w-6", "h-6")} />
            <p className={clsx(textClassName, "text-md", "text-black ml-2 space-x-0 tracking-tighter")}>Agregar al carrito</p>
        </div>
    )
}