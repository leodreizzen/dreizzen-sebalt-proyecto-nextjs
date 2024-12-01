"use client"
import React from "react";
import {Card, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import NextImage from "next/image";
import clsx from "clsx";
import {useRouter} from "next/navigation";
import {Tag} from "@prisma/client";

export interface TagProp {
    tag: Tag,
    image: { url: string, alt: string }
}

export default function BaseGenreCard({className, genre, isPressable, onPress, imgSizes, priority}: { className?: string, genre: TagProp, isPressable: boolean, onPress?: () => void, imgSizes?: string, priority?: boolean}) {
    return (
        <div className={clsx("gap-3 p-2 relative", className)}>
            <Card isPressable={isPressable} onPress={onPress} className="w-full col-span-12 sm:col-span-7">
                <div className="w-full aspect-video relative">
                    <Image
                        sizes={imgSizes}
                        as={NextImage}
                        removeWrapper
                        alt={genre.image.alt}
                        className="z-0 object-fill select-none"
                        src={genre.image.url}
                        fill
                        priority={priority}
                    />
                </div>
                <CardFooter
                    className="absolute bg-gradient-to-t from-black/90 from-50% bottom-0 pt-12 z-10 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 justify-center items-center p-2">
                        <div className="flex flex-col">
                            <p className="text-2xl text-white font-bold">{genre.tag.name}</p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}


