'use client';

import  { TagDto } from "../../lib/DTO";
import SearchBoxFilterChip from "./SearchBoxFilterChip";
import { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";


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

    return (
        <div>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Filtros</h1>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-bold">Géneros</h1>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(genre => (
                                <SearchBoxFilterChip key={genre.id} tag={genre} selected={getSelectedGenres().includes(genre.id)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}