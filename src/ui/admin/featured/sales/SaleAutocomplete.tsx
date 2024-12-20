import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import {useEffect, useRef, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import clsx from "clsx";
import {ProductSaleWithProduct} from "@/lib/definitions";
import {Key} from "react-aria";
import {AdminSalesAPIResponse} from "@/app/api/internal/admin/sales/types";
import {formatDiscountPercent} from "@/util/formatUtils";
import {currentPrice} from "@/util/productUtils";

export default function SaleAutocomplete({className, onValueChange}: {
    className?: string,
    onValueChange: (product: ProductSaleWithProduct | null) => void
}) {
    const [loading, setLoading] = useState(true)
    const [sales, setSales] = useState<ProductSaleWithProduct[]>([])
    const getProductsDebounced = useDebouncedCallback(getSales, 500)
    const ref= useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        getProductsDebounced("")
    }, [getProductsDebounced])

    function getSales(query: string) {
        const searchParams = new URLSearchParams()
        searchParams.append("q", query)
        fetch(`/api/internal/admin/sales?${searchParams.toString()}`).then(async (res) => {
            if (res.ok) {
                setSales((await res.json()) as AdminSalesAPIResponse)
                setLoading(false)
            } else {
                console.error("Failed to fetch product list")
            }
        })
    }

    function handleSelectionChange(key: Key | null) {
        const id = key !== null ? Number(key) : null
        if (id) {
            onValueChange(sales.find(sale => sale.id === id) || null)
        } else {
            onValueChange(null)
        }
    }
    function handleInputChange(value: string) {
        if(value === "")
            setLoading(true)
        getProductsDebounced(value)
    }

    function handleOpenChange(isOpen: boolean) {
        if (isOpen) {
            setTimeout(() => ref.current?.focus(), 50); // needed due to a bug in NextUI
        }
    }


    return (
        <Autocomplete className={clsx(className)} classNames={{popoverContent: "border-2 border-borders"}} onInputChange={handleInputChange} listboxProps={{emptyContent: ""}}
                      onSelectionChange={handleSelectionChange} label={"Select a product"} color={"primary"} disabledKeys={["loading"]} autoFocus ref={ref} onOpenChange={handleOpenChange}>
            { !loading? sales.map(sale =>
                    <AutocompleteItem key={sale.id} value={sale.product.name}>{`${sale.product.name} (${formatDiscountPercent(sale.product.originalPrice_cents, currentPrice(sale.product))})`}</AutocompleteItem>
                ):
                <AutocompleteItem key="loading" value="loading">Loading...</AutocompleteItem>
            }
        </Autocomplete>
    )
}

