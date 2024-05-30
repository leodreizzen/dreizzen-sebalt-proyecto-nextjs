"use client"
import ShoppingCartIcon from "./icons/ShoppingCartIcon";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useRef } from "react";
import { usePress } from "@react-aria/interactions";
import clsx from "clsx";
import { useHover } from "@uidotdev/usehooks";
import { useMediaQuery } from "react-responsive";
import { mergeRefs } from "react-merge-refs";
import { MdRemoveCircleOutline } from "react-icons/md";
import { ProductDTO } from "@/lib/DTO";
import { useShoppingCartContext } from "@/context/ShoppingCartContext";
export default function AddToCartButton({ className, iconClassName, textClassName, product }: { className?: string, iconClassName?: string, textClassName?: string, product: ProductDTO }) {
    const pressRef = useRef<HTMLDivElement>(null);
    const [hoveredRef, isHovered] = useHover();
    const ref = mergeRefs([pressRef, hoveredRef]);
    const { shoppingCart, addToCart, removeFromCart } = useShoppingCartContext();
    const supportsHover = useMediaQuery({query: "(hover: hover)"})

    const { pressProps, isPressed } = usePress({
        ref: pressRef,
        onPress: handleCartPress
    })

    const productInCart = shoppingCart.includes(product.id);

    function handleCartPress() {
        if (productInCart)
            removeFromCart(product.id)
        else
            addToCart(product.id)
    }

    let icon, text, textClass;
    if (productInCart) {
        if (supportsHover && isHovered || isPressed) {
            icon = <MdRemoveCircleOutline className={clsx(iconClassName, "text-foreground bg-w w-6 h-6")} />
            text = "Eliminar del carrito"
            textClass = "text-foreground pr-2"
        }
        else {
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
                "bg-green-300": !productInCart,
                "bg-gray-300": productInCart,
            }, isPressed && { // active has delay respect to isPressed
                "bg-green-600": !productInCart,
                "bg-red-600": productInCart
            },
             supportsHover && { // avoid issues in touch devices
                "hover:bg-green-400": !productInCart, 
                "hover:bg-red-700": productInCart
            }
            )}
            {...pressProps}
            ref={ref}>
            {icon}
            <p className={clsx(textClassName, textClass, "text-sm ml-1 space-x-0")}>{text}</p>
        </div>
    )
}