import {useEffect, useRef, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {Key} from "react-aria";
import clsx from "clsx";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import {RAWGSearchResult} from "@/app/api/internal/admin/rawg-search/types";
import {RAWGGame} from "@/app/api/internal/admin/rawg-game/types";

export default function RAWGAutocomplete({className, onValueChange}:
{
     className?: string,
     onValueChange: (product: RAWGGame | null) => void
}) {

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<RAWGSearchResult[]>([])
    const getProductsDebounced = useDebouncedCallback(getProducts, 500)
    const ref= useRef<HTMLInputElement | null>(null);


    useEffect(() => {
        getProductsDebounced("")
    }, [getProductsDebounced])

    function getProducts(query: string) {
        fetch(`/api/internal/admin/rawg-search?q=${query}`).then(async (res) => {
            if (res.ok) {
                setProducts((await res.json()) as RAWGSearchResult[])
                setLoading(false)
            } else {
                console.error("Failed to fetch product list")
            }
        })
    }

    function handleOpenChange(isOpen: boolean) {
        if (isOpen) {
            setTimeout(() => ref.current?.focus(), 50); // needed due to a bug in NextUI
        }
    }

    function getProduct(id: string) {
        fetch(`/api/internal/admin/rawg-game?id=${id}`).then(async (res) => {
            if (res.ok) {
                onValueChange((await res.json()) as RAWGGame)
            } else {
                console.error("Failed to fetch product")
            }
        })
    }

    function handleSelectionChange(key: Key | null) {
        const id = key !== null ? Number(key) : null
        if (id) {
            getProduct(id.toString())
        } else {
            onValueChange(null)
        }
    }
    function handleInputChange(value: string) {
        if(value === "")
            setLoading(true)
        getProductsDebounced(value)
    }

    return (
        <Autocomplete className={clsx(className)} classNames={{popoverContent: "border-2 border-borders"}} onInputChange={handleInputChange} listboxProps={{emptyContent: ""}}
                      onSelectionChange={handleSelectionChange} label={"Select a product"} color={"primary"} disabledKeys={["loading"]} autoFocus ref={ref} onOpenChange={handleOpenChange}>
            { !loading? products.map(product =>
                    <AutocompleteItem key={product.id} value={product.name}>{product.name}</AutocompleteItem>
                ):
                <AutocompleteItem key="loading" value="loading">Loading...</AutocompleteItem>
            }
        </Autocomplete>
    )

}