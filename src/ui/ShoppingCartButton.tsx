import { Button } from "@nextui-org/button"
import Link from "next/link"
import ShoppingCartIcon from "./icons/ShoppingCartIcon";
import { Badge } from "@nextui-org/badge";
import clsx from "clsx";
import { ReactNode } from "react";

export default function ShoppingCartButton(){
    const cartItems = 1;

    return (
        <Button as={Link} href="/cart" variant="flat" className="min-w-0 bg-transparent border py-1 flex items-center">
            <CartItemsBadge items={cartItems}>
                <ShoppingCartIcon className="mr-1 text-foreground pt-0" width={22} height={22} />
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
  
  