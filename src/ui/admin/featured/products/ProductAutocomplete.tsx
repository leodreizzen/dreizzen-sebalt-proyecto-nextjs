import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import {useEffect, useRef, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {AdminProductsAPIResponse} from "@/app/api/internal/admin/products/types";
import clsx from "clsx";
import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import {Key} from "react-aria";

export default function ProductAutocomplete({className, onValueChange}: {
    className?: string,
    onValueChange: (product: ProductWithTagsAndCoverImage | null) => void
}) {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<ProductWithTagsAndCoverImage[]>([])
    const getProductsDebounced = useDebouncedCallback(getProducts, 500)
    const ref= useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        getProductsDebounced("")
    }, [getProductsDebounced])

    function getProducts(query: string) {
        const searchParams = new URLSearchParams()
        searchParams.append("q", query)
        fetch(`/api/internal/admin/products?${searchParams.toString()}`).then(async (res) => {
            if (res.ok) {
                setProducts((await res.json()) as AdminProductsAPIResponse)
                setLoading(false)
            } else {
                console.error("Failed to fetch product list")
            }
        })
    }

    function handleSelectionChange(key: Key | null) {
        const id = key !== null ? Number(key) : null
        if (id) {
            onValueChange(products.find(product => product.id === id) || null)
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
                      onSelectionChange={handleSelectionChange} label={"Select a product"} color={"primary"} disabledKeys={["loading"]} autoFocus
                      ref={ref} onOpenChange={handleOpenChange}
        >
            { !loading? products.map(product =>
                <AutocompleteItem key={product.id} value={product.name}>{product.name}</AutocompleteItem>
            ):
                <AutocompleteItem key="loading" value="loading">Loading...</AutocompleteItem>
            }
        </Autocomplete>
    )
}

