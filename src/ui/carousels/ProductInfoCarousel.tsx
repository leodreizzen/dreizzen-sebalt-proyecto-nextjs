"use client"
import React, { Suspense, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './styles.css';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import clsx from 'clsx';
import { ProductDTO } from '@/data/DTO';
import Image from 'next/image';
import VideoPlayer from '../video/VideoPlayer';
export default function ProductInfoCarousel({className, product}: {className: string, product: ProductDTO}) {
  const [thumbsSwiper, setThumbsSwiper]= useState<SwiperClass|null>(null);
  const [initialized, setInitialized] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  function handleInit(){
    setInitialized(true);
  }
  // TODO VIDEO 
  return (
    <div className = {clsx("p-4 border", className, {"loading": !initialized})}>
      <Swiper
        style={{
          // @ts-ignore
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper, autoScrollOffset: 2}}
        modules={[FreeMode, Navigation, Thumbs]}
        className="rounded-lg overflow-clip w-full h-[80%]"
        onActiveIndexChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        >
        {
          product.videos.map((video, i) => (
            <SwiperSlide key={video.id}>
              <VideoPlayer video={video} className='h-full w-full' active={i === activeSlide}/> {/* TODO add sizes*/}
            </SwiperSlide>
          ))
        }
      
        {product.descriptionImages.map((image) => (
          <SwiperSlide key={image.id}>
            <Image src={image.url} alt={image.alt} fill={true}/> {/* TODO add sizes*/}
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        centeredSlides={true}
        onSwiper={setThumbsSwiper}
        onAfterInit={()=>handleInit()}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={false}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper h-[20%] w-full !pt-3 "
      >
        {
          product.videos.map((video) => (
            <SwiperSlide key={video.id} className={clsx({"!hidden": !initialized})}>
            <Image src={video.thumbnail.url} alt={"Miniatura: " + video.thumbnail.alt} fill={true}/> {/* TODO add sizes*/}
            </SwiperSlide>
          ))
        }
        {product.descriptionImages.map((image) => (
          <SwiperSlide key={image.id} className={clsx({"!hidden": !initialized})}>
            <Image src={image.url} alt={"Miniatura: " + image.alt} fill={true}/> {/* TODO add sizes*/}
          </SwiperSlide>
        ))}
        
      </Swiper>
    </div>
  );
}
