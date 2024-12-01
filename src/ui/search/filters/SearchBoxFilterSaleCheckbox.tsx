"use client";

import React from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function SearchBoxFilterSaleCheckbox(){
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const onSaleBoolean = () => {
        if (pathname === '/products/discounts') {
            return true;
        }
        return false;
    }

    const [onSale, setOnSale] = React.useState(onSaleBoolean);

    const changeSale = () => {
        setOnSale(!onSale);
        const params = new URLSearchParams(searchParams);
        params.set('onSale', (!onSale).toString());
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <Checkbox isReadOnly={onSaleBoolean()} defaultSelected isSelected={onSale} onValueChange={changeSale} radius="sm" size="lg" color="success">On sale</Checkbox>
    )
}