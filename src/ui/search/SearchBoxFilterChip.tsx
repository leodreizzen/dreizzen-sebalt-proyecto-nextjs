import { Chip } from "@nextui-org/chip";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TagDto } from "@/lib/DTO";

export default function SearchBoxFilterChip({className, tag, selected}: {className?: string, tag: TagDto, selected: boolean}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    

    function handleClose() {
        const params = new URLSearchParams(searchParams);
        const values = params.getAll('filter');
        if (selected) {
            const valuesString = values[0].split(',');
            valuesString.splice(valuesString.indexOf(tag.id.toString()), 1);
            const valuesResult = valuesString.join();
            params.set('filter', valuesResult);
            if (valuesResult.length === 0) {
                params.delete('filter');
            }
        } else {
            const values = params.getAll('filter');
            const valuesString = values.length === 0 ? [] : values[0].split(',');
            valuesString.push(tag.id.toString());
            params.set('filter', valuesString.join());
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <Chip size="sm" color="primary" onClose = {() => { handleClose() }} endContent = { selected ? <img src="https://icons.veryicon.com/png/o/miscellaneous/alan-ui/ios-checkmark-circle-4.png" alt="check" className="w-4 h-4"/> : null  } className="text-white">{tag.name}</Chip>
    )
}