"use client"
import React from "react";
import {Card, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import NextImage from "next/image";
import clsx from "clsx";
import { FeaturedTagDTO } from "@/lib/DTO";
import { useRouter } from "next/navigation";

export default function GenreCard({className, genre}: {className?: string, genre: FeaturedTagDTO}) {
  const router = useRouter();
  function handlePress() {
    router.push(`/products/featured/tag/${genre.tag.id}`)
  }
  return (
    <div className={clsx("gap-3 p-2", className)}>
    <Card isPressable onPress={handlePress} className="w-full col-span-12 sm:col-span-7">
      <div className="w-full aspect-video">
      <Image
        as={NextImage}
        removeWrapper
        alt={genre.image.alt}
        className="z-0 object-fill"
        src={genre.image.url}
        fill
      />
      </div>
      <CardFooter className="absolute bg-gradient-to-t from-black/90 from-50% bottom-0 pt-12 z-10 border-default-600 dark:border-default-100">
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


