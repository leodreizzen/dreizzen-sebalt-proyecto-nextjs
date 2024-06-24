"use client"
import {Button} from "@nextui-org/button";
import {MdRemoveCircleOutline} from "react-icons/md";
import clsx from "clsx";
import {useShoppingCartContext} from "@/context/ShoppingCartContext";
import {useState} from "react";


enum ButtonState {
    READY,
    REMOVING,
}
export default function RemoveFromCartPageButton({className, productId}: { className?: string, productId: number }) {
    const {removeFromCart} = useShoppingCartContext()
    const [state, setState] = useState(ButtonState.READY)
    async function handlePress(){
        setState(ButtonState.REMOVING)
        await removeFromCart(productId)
    }
    return (
        <div className={clsx(className, "self-center w-7 h-7 xs:h-10 xs:w-10 flex items-center max-sm:ml-1")}>
            {state === ButtonState.READY ?
                <Button type="submit" aria-label="Remove from cart"
                        onPress={handlePress}
                        className="text-red-600 hover:text-red-400 active:text-red-300 size-full min-w-0 min-h-0 bg-transparent px-0 self-center ">
                    <MdRemoveCircleOutline className="h-10 w-10"/>
                </Button>
                : <div aria-label="Removing" className={clsx(className, "border-4 border-t-4 border-transparent border-t-gray-600 rounded-full animate-[spin_1.2s_linear_infinite] text-black bg-w w-6 h-6 ml-2 mr-1")}/>
            }
        </div>
    )
}