"use client"
import React from "react";
import clsx from "clsx";
import {useRouter} from "next/navigation";
import {Tag} from "@prisma/client";
import BaseGenreCard from "@/ui/cards/BaseGenreCard";

interface TagProp {
    tag: Tag,
    image: { url: string, alt: string }
}

export default function GenreCard({className, genre}: { className?: string, genre: TagProp }) {
    const router = useRouter();

    function handlePress() {
        router.push(`/products/featured/tag/${genre.tag.id}`)
    }

    return (
        <BaseGenreCard isPressable={true} className={clsx("gap-3 p-2", className)} genre={genre} onPress={handlePress}/>
    );
}


