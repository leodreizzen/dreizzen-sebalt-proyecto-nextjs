"use client"
import React, { useId, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './styles.css'; // Swiper does not allow setting custom class on slides

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import clsx from 'clsx';
import { ProductDTO } from '@/data/DTO';
import Image from 'next/image';
import VideoPlayer from '../../video/VideoPlayer';
import SwiperRightButton from '../SwiperRightButton';
import SwiperLeftButton from '../SwiperLeftButton';
export default function ProductInfoCarousel({ className, product }: { className?: string, product: ProductDTO }) {
  const uniqueId = useId().replaceAll(":", "")

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  function handleInit() {
    setInitialized(true);
  }

  return (
    <div className={clsx("p-4 flex flex-col productInfoCarousel", className, { "loading": !initialized })}>
      <div className='flex w-full items-center'>
        <SwiperLeftButton id={`${uniqueId}-swiper-button-prev`} enabled={activeSlide !== 0} className="mr-1" />
      
        <Swiper
          navigation={{
            nextEl: `#${uniqueId}-swiper-button-next`,
            prevEl: `#${uniqueId}-swiper-button-prev`,
          }}

          thumbs={{ swiper: thumbsSwiper, autoScrollOffset: 2 }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="rounded-lg overflow-clip w-full border border-slate-600 aspect-video"
          onSlidesUpdated={(swiper) => {setSlideCount(swiper.slides.length)}}
          onActiveIndexChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        >
          {
            product.videos.map((video, i) => (
              <SwiperSlide key={video.id}>
                <VideoPlayer video={video} className='h-full w-full overflow-clip' active={i === activeSlide} /> {/* TODO add sizes*/}
              </SwiperSlide>
            ))
          }

          {product.descriptionImages.map((image) => (
            <SwiperSlide key={image.id}>
              <Image src={image.url} alt={image.alt} fill={true} /> {/* TODO add sizes*/}
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperRightButton id={`${uniqueId}-swiper-button-next`} enabled={activeSlide < slideCount - 1} className='ml-1'/>

      </div>
      <Swiper
        centeredSlides={true}
        onSwiper={setThumbsSwiper}
        onAfterInit={() => handleInit()}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={false}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full !pt-5 thumbsSwiper"
      >
        {
          product.videos.map((video) => (
            <SwiperSlide key={video.id} className={clsx({ "!hidden": !initialized }, "border border-slate-600, aspect-video")}>
              <Image src={video.thumbnail.url} alt={"Miniatura: " + video.thumbnail.alt} fill={true} /> {/* TODO add sizes*/}
            </SwiperSlide>
          ))
        }
        {product.descriptionImages.map((image) => (
          <SwiperSlide key={image.id} className={clsx({ "!hidden": !initialized }, "border border-slate-600, aspect-video")}>
            <Image src={image.url} alt={"Miniatura: " + image.alt} fill={true} /> {/* TODO add sizes*/}
          </SwiperSlide>
        ))}

      </Swiper>
    </div>
  );
}
