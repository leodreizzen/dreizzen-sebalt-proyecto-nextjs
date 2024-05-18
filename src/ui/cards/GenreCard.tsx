import React from "react";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button";

export default function GenreCard() {
  return (
    <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
    <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover"
        src="https://media.es.wired.com/photos/64b705bb2ffab1a554bf95c4/master/pass/Culture-EA-FC24_Screenshot_EPL_4k_CityCele.jpg"
      />
      <CardFooter className="absolute bg-black/70 bottom-0 z-10 border-default-600 dark:border-default-100">
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


