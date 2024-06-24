import {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {Key} from "react-aria";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import clsx from "clsx";
import {Company} from "@prisma/client";
import {AdminCompaniesAPIResponse} from "@/app/api/internal/admin/companies/types";
import {CompanyItem} from "@/ui/admin/products/add/AddProductForm";

export default function CompanyAutocomplete({className, onValueChange}: {
    className?: string,
    onValueChange: (company: CompanyItem | null) => void
}) {
    const [loading, setLoading] = useState(true)
    const [companies, setCompanies] = useState<CompanyItem[]>([])
    const getCompaniesDebounced = useDebouncedCallback(getCompanies, 500)

    useEffect(() => {
        getCompaniesDebounced("")
    }, [getCompaniesDebounced])

    function getCompanies(query: string) {
        fetch(`/api/internal/admin/companies?q=${query}`).then(async (res) => {
            if (res.ok) {
                const apiCompanies = await res.json() as AdminCompaniesAPIResponse
                const found = apiCompanies.find((company: Company) => company.name.toLocaleLowerCase() === query.toLocaleLowerCase())
                const mappedCompanies = apiCompanies.map(c => ({isNew: false, ...c}))
                if (!found && query !== "" && Number(query) !== -1) {
                    setCompanies([{isNew: true, name: `${query}`}, ...mappedCompanies])
                } else {
                    setCompanies(mappedCompanies)
                    setLoading(false)
                }
            } else {
                console.error("Failed to fetch company list")
            }
        })
    }

    function handleSelectionChange(key: Key | null) {
        const keyNumber = Number(key);
        let item: CompanyItem | null;
        if (keyNumber === -1)
            item = companies.find(company => company.isNew) || null
        else
            item = companies.find(company => !company.isNew && company.id === keyNumber) || null

        onValueChange(item)
    }

    function handleInputChange(value: string) {
        if (value === "")
            setLoading(true)
        getCompaniesDebounced(value)
    }

    return (
        <Autocomplete className={clsx(className)} classNames={{popoverContent: "border-2 border-borders"}}
                      onInputChange={handleInputChange} listboxProps={{emptyContent: ""}}
                      onSelectionChange={handleSelectionChange} label={"Select a company"} color={"primary"}
                      disabledKeys={["loading"]} autoFocus>
            {!loading ? companies.map(company => {
                        const text = company.isNew ? `Create company "${company.name}"` : company.name
                        return <AutocompleteItem key={company.isNew ? -1 : company.id}
                                                 value={text}>{text}</AutocompleteItem>
                    }
                ) :
                <AutocompleteItem key="loading" value="loading">Loading...</AutocompleteItem>
            }
        </Autocomplete>
    )
}