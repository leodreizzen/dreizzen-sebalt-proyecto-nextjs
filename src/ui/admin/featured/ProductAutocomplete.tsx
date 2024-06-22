import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {AdminProductsAPIResponse} from "@/app/api/internal/admin/products/types";
import clsx from "clsx";
import {ProductWithTagsAndCoverImage} from "@/lib/definitions";
import {Key} from "react-aria";

export default function ProductAutocomplete({className, onValueChange}: {className?: string, onValueChange: (product: ProductWithTagsAndCoverImage | null) => void}) {

    const [products, setProducts] = useState<ProductWithTagsAndCoverImage[]>([])
    const getProductsDebounced = useDebouncedCallback(getProducts, 500)

    useEffect(() => {
        getProductsDebounced("")
    }, [getProductsDebounced])

    function getProducts(query: string) {
        fetch(`/api/internal/admin/products?q=${query}`).then(async (res) => {
            if (res.ok) {
                setProducts((await res.json()) as AdminProductsAPIResponse)
            } else {
                console.error("Failed to fetch product list")
            }
        })
    }

    function handleSelectionChange(key: Key | null) {
        const id = key !== null ? Number(key): null
        if (id) {
            onValueChange(products.find(product => product.id === id) || null)
        } else {
            onValueChange(null)
        }
    }

    return (
        <Autocomplete className={clsx(className)} onInputChange={getProductsDebounced} listboxProps={{emptyContent: ""}} onSelectionChange={handleSelectionChange} label={"Select a product"} color={"primary"} autoFocus>
            {products.map(product =>
                <AutocompleteItem key={product.id} value={product.name}>{product.name}</AutocompleteItem>
            )}
        </Autocomplete>
    )
}

