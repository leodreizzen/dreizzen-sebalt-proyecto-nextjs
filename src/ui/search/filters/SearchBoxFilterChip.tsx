"use client";

import { Chip } from "@nextui-org/chip";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { Tag } from "@prisma/client";

export default function SearchBoxFilterChip({className, tag, selected}: {className?: string, tag: Tag, selected: boolean}) {
    const searchParams = useSearchParams()
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
            } else {
                const values = params.getAll('filter');
                const valuesString = values.length === 0 ? [] : values[0].split(',');
                valuesString.push(tag.id.toString());
                params.set('filter', valuesString.join());
            }
            params.set('page', `1`)
            replace(`${pathname}?${params.toString()}`, { scroll: false });

    }

    return (
        <Chip classNames={{base: "cursor-pointer"}} onClick = {() => { handleClose() }} size="sm" color="primary" onClose = {() => { handleClose() }} endContent = { selected ? null : <FaPlus className="text-sm text-white peer-focus:text-gray-900 ml-1 mr-1"/>  } className="text-white">{tag.name}</Chip>
    )
}