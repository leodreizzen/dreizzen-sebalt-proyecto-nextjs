import {useEffect, useRef, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {Key} from "react-aria";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import clsx from "clsx";
import {Tag} from "@prisma/client";
import {CompanyItem, TagItem} from "@/ui/admin/products/add/AddProductForm";
import {AdminTagsAPIResponse} from "@/app/api/internal/admin/tags/types";

export default function TagAutocompleteWithCreate({className, onValueChange}: {
    className?: string,
    onValueChange: (company: CompanyItem | null) => void
}) {
    const [loading, setLoading] = useState(true)
    const [tags, setTags] = useState<CompanyItem[]>([])
    const getTagsDebounced = useDebouncedCallback(getTags, 500)
    const ref= useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        getTagsDebounced("")
    }, [getTagsDebounced])

    function getTags(query: string) {
        fetch(`/api/internal/admin/tags?q=${query}`).then(async (res) => {
            if (res.ok) {
                const apiTags = await res.json() as AdminTagsAPIResponse
                const found = apiTags.find((tag: Tag) => tag.name.toLocaleLowerCase() === query.toLocaleLowerCase())
                const mappedTags = apiTags.map(c => ({isNew: false, ...c}))
                if (!found && query !== "" && Number(query) !== -1) {
                    setTags([{isNew: true, name: `${query}`}, ...mappedTags])
                } else {
                    setTags(mappedTags)
                    setLoading(false)
                }
            } else {
                console.error("Failed to fetch tag list")
            }
        })
    }

    function handleSelectionChange(key: Key | null) {
        const keyNumber = Number(key);
        let item: TagItem | null;
        if (keyNumber === -1)
            item = tags.find(tag => tag.isNew) || null
        else
            item = tags.find(tag => !tag.isNew && tag.id === keyNumber) || null

        onValueChange(item)
    }

    function handleInputChange(value: string) {
        if (value === "")
            setLoading(true)
        getTagsDebounced(value)
    }

    function handleOpenChange(isOpen: boolean) {
        if (isOpen) {
            setTimeout(() => ref.current?.focus(), 50); // needed due to a bug in NextUI
        }
    }


    return (
        <Autocomplete className={clsx(className)} classNames={{popoverContent: "border-2 border-borders"}}
                      onInputChange={handleInputChange} listboxProps={{emptyContent: ""}}
                      onSelectionChange={handleSelectionChange} label={"Select a tag"} color={"primary"}
                      disabledKeys={["loading"]} autoFocus ref={ref} onOpenChange={handleOpenChange}>
            {!loading ? tags.map(tag => {
                        const text = tag.isNew ? `Create tag "${tag.name}"` : tag.name
                        return <AutocompleteItem key={tag.isNew ? -1 : tag.id}
                                                 value={text}>{text}</AutocompleteItem>
                    }
                ) :
                <AutocompleteItem key="loading" value="loading">Loading...</AutocompleteItem>
            }
        </Autocomplete>
    )
}