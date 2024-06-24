import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import clsx from "clsx";
import {Key} from "react-aria";
import {Tag} from "@prisma/client";
import {AdminTagsAPIResponse} from "@/app/api/internal/admin/tags/types";

export default function TagAutocomplete({className, value, onValueChange}: {
    className?: string,
    value: Tag | null,
    onValueChange: (tag: Tag | null) => void
}) {
    const [input, setInput] = useState(value?.name || "")
    const [loading, setLoading] = useState(true)
    const [tags, setTags] = useState<Tag[]>([])
    const getTagsDebounced = useDebouncedCallback(getTags, 500)

    useEffect(() => {
        getTagsDebounced("")
    }, [getTagsDebounced])

    function getTags(query: string) {
        const searchParams = new URLSearchParams()
        searchParams.append("q", query)
        fetch(`/api/internal/admin/tags?${searchParams.toString()}`).then(async (res) => {
            if (res.ok) {
                setTags((await res.json()) as AdminTagsAPIResponse)
                setLoading(false)
            } else {
                console.error("Failed to fetch product list")
            }
        })
    }

    function handleSelectionChange(key: Key | null) {
        const id = key !== null ? Number(key) : null
        if (id) {
            onValueChange(tags.find(tag => tag.id === id) || null)
        } else {
            onValueChange(null)
        }
    }
    function handleInputChange(value: string) {
        setInput(value)
        if(value === "")
            setLoading(true)
        getTagsDebounced(value)
    }

    return (
        <Autocomplete className={clsx(className)} classNames={{popoverContent: "border-2 border-borders"}} inputValue={input} onInputChange={handleInputChange} listboxProps={{emptyContent: ""}}
                      onSelectionChange={handleSelectionChange} label={"Select a tag"} color={"primary"} disabledKeys={["loading"]}>
            { !loading? tags.map(tag =>
                <AutocompleteItem key={tag.id} value={tag.name}>{tag.name}</AutocompleteItem>
            ):
                <AutocompleteItem key="loading" value="loading">Loading...</AutocompleteItem>
            }
        </Autocomplete>
    )
}

