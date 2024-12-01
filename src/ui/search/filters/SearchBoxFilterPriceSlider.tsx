"use client";

import { Slider } from "@nextui-org/slider";
import { useDebouncedCallback } from "use-debounce";
import {usePathname, useSearchParams, useRouter} from "next/navigation";


export default function SearchBoxFilterPriceSlider({minPrice, maxPrice}: {minPrice: number, maxPrice: number}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const setPriceRange = useDebouncedCallback((maxMin: number[]) => {
        const params = new URLSearchParams(searchParams);
        params.set('priceRange', `${maxMin[0]},${maxMin[1]}`);
        params.set('page', `1`);
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);
    const getSelectedPriceRange = () => {
        const params = new URLSearchParams(searchParams);
        const values = params.getAll('priceRange');

        if (values.length === 0) {
            return [minPrice, maxPrice];
        }

        return values[0].split(',').map(price => parseInt(price));
    }
    return (<Slider
                label="Price range"
                step={1}
                minValue={minPrice}
                maxValue={maxPrice}
                defaultValue={getSelectedPriceRange()}
                formatOptions={{style: "currency", currency: "USD"}}
                onChange = {setPriceRange as any}
                className="w-full justify-center"
            />);
}