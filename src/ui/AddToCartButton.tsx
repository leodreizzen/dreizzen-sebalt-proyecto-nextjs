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
        <div className={clsx(className, "flex bg-green-300 p-2 hover:bg-green-400 active:bg-green-600 rounded-lg items-center")} {...pressProps} ref={ref}>
            <ShoppingCartIcon className={clsx(iconClassName, "text-black", "pr-1", "w-6", "h-6")} />
            <p className={clsx(textClassName, "text-md", "text-black")}>Agregar al carrito</p>
        </div>
    )
}