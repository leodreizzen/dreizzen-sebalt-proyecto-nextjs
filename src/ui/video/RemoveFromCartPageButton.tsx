"use client"
import {Button} from "@nextui-org/button";
import {MdRemoveCircleOutline} from "react-icons/md";
import clsx from "clsx";
import {useShoppingCartContext} from "@/context/ShoppingCartContext";

export default function RemoveFromCartPageButton({className, productId}: { className?: string, productId: number }) {
    const {removeFromCart} = useShoppingCartContext()
    async function handlePress(){
        await removeFromCart(productId)
    }
    return (
        <div className={clsx(className, "self-center")}>
            <Button type="submit" aria-label="Eliminar del carrito"
                    onPress={handlePress}
                    className="flex items-center text-red-600 hover:text-red-400 active:text-red-300 w-7 h-7 max-sm:ml-1 xs:h-10 xs:w-10 min-w-0 min-h-0 bg-transparent px-0 self-center ">
                <MdRemoveCircleOutline className="h-10 w-10"/>
            </Button>
        </div>
    )
}