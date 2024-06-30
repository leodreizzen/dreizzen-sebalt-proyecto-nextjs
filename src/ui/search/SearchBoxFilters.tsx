import SearchBoxFilterChip from "./filters/SearchBoxFilterChip";
import { Tag } from "@prisma/client";
import SearchBoxFilterPriceSlider from './filters/SearchBoxFilterPriceSlider';
import SearchBoxFilterSaleCheckbox from "./filters/SearchBoxFilterSaleCheckbox";
import {useEffect, useRef} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";


export default function SearchBoxFilters({ tags, selectedTags } : { tags: Tag[], selectedTags: Tag[] }) {
    const minPrice = 0;
    const maxPrice = 200;

    const notSelectedTags = tags.filter(tag => !selectedTags.map(tag => tag.id).includes(tag.id));

    return (
        <div>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Filters</h1>
                <div className="flex flex-col gap-2 mr-2 w-full lg:w-[350px]">
                    <h1 className="text-xl font-bold">Selected tags</h1>
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map(genre => (
                            <SearchBoxFilterChip key={genre.id} tag={genre} selected={true}/>
                        ))}
                    </div>
                    <hr />
                    <h1 className="text-xl font-bold">Tags</h1>
                    <div className="flex flex-wrap gap-2">
                        {notSelectedTags.filter(genre => !selectedTags.includes(genre)).map(genre => (
                            <SearchBoxFilterChip key={genre.id} tag={genre} selected={false}/>
                        ))}
                        </div>
                        <hr />
                    <div className="flex flex-col lg:w-[350px] justify-center items-center w-full gap-2">
                        <SearchBoxFilterPriceSlider minPrice={minPrice} maxPrice={maxPrice} />
                    </div>
                    <div className="flex gap-4 w-full justify-center">
                        <SearchBoxFilterSaleCheckbox />
                    </div>
                </div>
            </div>
        </div>
    )
}