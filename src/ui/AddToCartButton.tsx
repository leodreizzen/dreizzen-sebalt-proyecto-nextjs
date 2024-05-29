"use client"
import ShoppingCartIcon from "./icons/ShoppingCartIcon";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useRef } from "react";
import { usePress } from "@react-aria/interactions";
import clsx from "clsx";
import { useHover } from "@uidotdev/usehooks";
import {mergeRefs} from "react-merge-refs";
import { MdRemoveCircleOutline } from "react-icons/md";
export default function AddToCartButton({ className, iconClassName, textClassName }: { className?: string, iconClassName?: string, textClassName?: string }) {
    const pressRef = useRef<HTMLDivElement>(null);
    const [hoveredRef, isHovered] = useHover();
    const ref = mergeRefs([pressRef, hoveredRef]);
    
    const { pressProps } = usePress({
        ref: pressRef,
        onPress: handleCartPress
    })

    const productInCart = false;

    function handleCartPress() {
        if(productInCart)
            alert("Added to cart")
        else
            alert("Removed from cart")
    }

    let icon, text, textClass;
    if (productInCart) {
        if(isHovered){
            icon = <MdRemoveCircleOutline className={clsx(iconClassName, "text-foreground bg-w w-6 h-6")} />
            text = "Eliminar del carrito"
            textClass = "text-foreground pr-2"
        }
        else{
            icon = <IoCheckmarkCircleOutline className={clsx(iconClassName, "text-black bg-w w-6 h-6")} />
            text = "Agregado al carrito"
            textClass = "text-black pr-1"
        }
    } else {
        icon = <ShoppingCartIcon className={clsx(iconClassName, "text-black bg-w w-6 h-6")} />
        text = "Agregar al carrito"
        textClass = "text-black"
    }


    return (
        <div
            className={clsx(className, "flex p-[0.4rem] justify-center rounded-lg items-center", {
                "bg-green-300 hover:bg-green-400 active:bg-green-600": !productInCart,
                "bg-gray-300 hover:bg-red-700 active:bg-red-600": productInCart,
            }
            )}
            {...pressProps} 
            ref={ref}>
            {icon}
            <p className={clsx(textClassName, textClass, "text-sm ml-1 space-x-0")}>{text}</p>
        </div>
    )
}