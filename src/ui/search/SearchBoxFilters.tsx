'use client';

import  { TagDto } from "../../lib/DTO";
import SearchBoxFilterChip from "./SearchBoxFilterChip";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Slider } from "@nextui-org/slider";
import { useDebouncedCallback } from "use-debounce";


export default function SearchBoxFilters({ genres } : { genres: TagDto[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const getSelectedGenres = () => {
        const params = new URLSearchParams(searchParams);
        const values = params.getAll('filter');

        if (values.length === 0) {
            return [];
        }

        return values[0].split(',').map(id => parseInt(id));
    }

    /* Cambiar rango de precios default a algo coherente. */

    const getSelectedPriceRange = () => {
        const params = new URLSearchParams(searchParams);
        const values = params.getAll('priceRange');

        if (values.length === 0) {
            return [10, 30];
        }

        return values[0].split(',').map(price => parseInt(price));
    }

    const setPriceRange = useDebouncedCallback((maxMin: number[]) => {
        const params = new URLSearchParams(searchParams);
        params.set('priceRange', `${maxMin[0]},${maxMin[1]}`);
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return (
        <div>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Filtros</h1>
                <div className="flex flex-col gap-2 mr-2 w-full lg:w-[350px]">
                    <h1 className="text-xl font-bold">Tags seleccionados</h1>
                    <div className="flex flex-wrap gap-2">
                        {genres.filter(genre => getSelectedGenres().includes(genre.id)).map(genre => (
                            <SearchBoxFilterChip key={genre.id} tag={genre} selected={true} />
                        ))}
                    </div>
                    <hr />
                    <h1 className="text-xl font-bold">Tags</h1>
                    <div className="flex flex-wrap gap-2">
                        {genres.filter(genre => !getSelectedGenres().includes(genre.id)).map(genre => (
                            <SearchBoxFilterChip key={genre.id} tag={genre} selected={false} />
                        ))}
                        </div>
                        <hr />
                    <div className="flex flex-col w-full lg:w-[350px] justify-center items-center w-full gap-2 gap-2">
                        <Slider
                            label="Rango de precios"
                            step={1}
                            minValue={0}
                            maxValue={200}
                            defaultValue={getSelectedPriceRange()}
                            formatOptions={{style: "currency", currency: "USD"}}
                            onChange = {setPriceRange as any}
                            className="w-full justify-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}