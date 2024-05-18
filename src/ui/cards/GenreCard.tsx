import React from "react";
import {Card, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import NextImage from "next/image";

export default function GenreCard() {
  return (
    <div className="w-[550px] h-[300px] gap-3 px-8 p-2">
    <Card isPressable onPress={() => window.open("https://www.youtube.com/watch?v=16uJ-jxcKHo")} className="w-full h-[300px] col-span-12 sm:col-span-7">
      <Image
        as={NextImage}
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover"
        src="https://media.es.wired.com/photos/64b705bb2ffab1a554bf95c4/master/pass/Culture-EA-FC24_Screenshot_EPL_4k_CityCele.jpg"
        fill
      />
      <CardFooter className="absolute bg-gradient-to-t from-black/90 from-50% bottom-0 pt-12 z-10 border-default-600 dark:border-default-100">
        <div className="flex flex-grow gap-2 justify-center items-center p-2">
          <div className="flex flex-col">
            <p className="text-2xl text-white font-bold">Deportes</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  </div>
  );
}


