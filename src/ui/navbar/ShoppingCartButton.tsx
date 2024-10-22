import { Button } from "@nextui-org/button"
import Link from "next/link"
import ShoppingCartIcon from "../icons/ShoppingCartIcon";
import { Badge } from "@nextui-org/badge";
import clsx from "clsx";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {useShoppingCartContext} from "@/context/ShoppingCartContext";

export default function ShoppingCartButton(){
    const pathName = usePathname();
    const selected = pathName.startsWith("/cart");
    const {shoppingCart} = useShoppingCartContext()
    const cartItems = shoppingCart.dataAvailable ? shoppingCart.data.length: 0;
    return (
        <Button aria-label="Go to cart" as={Link} href="/cart" variant="flat" className="pl-0 pr-2 min-w-0 bg-transparent py-1 flex items-center">
            <CartItemsBadge items={cartItems}>
                <ShoppingCartIcon className={clsx("mr-1 pt-0 w-6 h-6", {"text-foreground": !selected, "text-primary": selected})} />
            </CartItemsBadge>
        </Button>
    )
}

function CartItemsBadge({ items, className, children }: { items: number, className?: string, children: ReactNode }) {
    return items > 0 ? (
      <Badge color="secondary" content={items} className={clsx(className)}>
        {children}
      </Badge>)
      : children
  }
  
  