"use client"
import ShoppingCartIcon from "./icons/ShoppingCartIcon";
import {IoCheckmarkCircleOutline} from "react-icons/io5";
import {useRef, useState} from "react";
import {usePress} from "@react-aria/interactions";
import clsx from "clsx";
import {useHover} from "@uidotdev/usehooks";
import {useMediaQuery} from "react-responsive";
import {mergeRefs} from "react-merge-refs";
import {MdRemoveCircleOutline} from "react-icons/md";
import {useShoppingCartContext} from "@/context/ShoppingCartContext";
import {Product} from "@prisma/client";

enum ButtonState {
    READY,
    ADDING,
    REMOVING,
}

export default function AddToCartButton({className, iconClassName, textClassName, product}: {
    className?: string,
    iconClassName?: string,
    textClassName?: string,
    product: Product
}) {
    const pressRef = useRef<HTMLDivElement>(null);
    const [hoveredRef, isHovered] = useHover();
    const ref = mergeRefs([pressRef, hoveredRef]);
    const {shoppingCart, addToCart, removeFromCart} = useShoppingCartContext();
    const supportsHover = useMediaQuery({query: "(hover: hover)"})
    const [state, setState] = useState<ButtonState>(ButtonState.READY)


    const {pressProps, isPressed} = usePress({
        ref: pressRef,
        onPress: handleCartPress
    })

    const productInCart = shoppingCart.dataAvailable && shoppingCart.data.includes(product.id);

    async function handleCartPress() {
        if (shoppingCart.dataAvailable) {
            if (productInCart) {
                setState(ButtonState.REMOVING)
                await removeFromCart(product.id)
                setState(ButtonState.READY)
            } else {
                setState(ButtonState.ADDING)
                await addToCart(product.id)
                setState(ButtonState.READY)
            }
        }
    }

    let icon, text, textClass, bgClass;
    switch (state) {
        case ButtonState.READY:
            if (productInCart) {
                if (supportsHover && isHovered || isPressed) {
                    icon = <MdRemoveCircleOutline className={clsx(iconClassName, "text-foreground bg-w w-6 h-6")}/>
                    text = "Remove"
                    textClass = "text-foreground pr-2"
                    bgClass = "bg-red-600"
                } else {
                    icon = <IoCheckmarkCircleOutline className={clsx(iconClassName, "text-black bg-w w-6 h-6")}/>
                    text = "Added to cart"
                    textClass = "text-black pr-1"
                    bgClass = "bg-gray-300"
                }
            } else {
                icon = <ShoppingCartIcon className={clsx(iconClassName, "text-black bg-w w-6 h-6")}/>
                text = "Add to cart"
                textClass = "text-black"
                if(isPressed)
                    bgClass = "bg-green-600"
                else if(supportsHover && isHovered)
                    bgClass = "bg-green-400"
                else
                    bgClass = "bg-green-300"
            }
            break;
        case ButtonState.ADDING:
            icon = <div className={clsx(iconClassName, "border-4 border-t-4 border-transparent border-t-gray-600 rounded-full animate-[spin_1.2s_linear_infinite] text-black bg-w w-6 h-6")}/>
            text = "Adding..."
            textClass = "text-black"
            bgClass = "bg-gray-300"
            break;
        case ButtonState.REMOVING:
            icon = <div className={clsx(iconClassName, "border-4 border-t-4 border-transparent border-t-gray-600 rounded-full animate-[spin_1.2s_linear_infinite] text-black bg-w w-6 h-6")}/>
            text = "Removing..."
            textClass = "text-black"
            bgClass = "bg-gray-300"
            break;
    }


    return (
        <div
            className={clsx(className, "flex p-[0.4rem] justify-center rounded-lg items-center gap-1.5 pr-2",
                !shoppingCart.dataAvailable && "invisible",
                bgClass
            )}
            {...pressProps}
            ref={ref}>
            {icon}
            <p className={clsx(textClassName, textClass, "text-sm space-x-0",{
                "w-24": productInCart,
                "w-20": !productInCart
            })}>{text}</p>
        </div>
    )
}