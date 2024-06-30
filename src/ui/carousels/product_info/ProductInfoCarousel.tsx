"use client"
import React, { useId, useMemo, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './styles.css'; // Swiper does not allow setting custom class on slides

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { PiPlayCircleLight } from "react-icons/pi";

import clsx from 'clsx';
import Image from 'next/image';
import VideoPlayer from '../../video/VideoPlayer';
import SwiperRightButton from '../SwiperRightButton';
import SwiperLeftButton from '../SwiperLeftButton';

import { useWindowSize } from '@uidotdev/usehooks';
import resolveConfig from 'tailwindcss/resolveConfig';
import taiwindConfig from '@/../tailwind.config';
import { ProductForDetail } from '@/lib/definitions';
const tailwindConfig = resolveConfig(taiwindConfig)


export default function ProductInfoCarousel({ className, product }: { className?: string, product: ProductForDetail }) {
  const uniqueId = useId().replaceAll(":", "")

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const genericThumbnail = "https://static-00.iconduck.com/assets.00/image-x-generic-symbolic-icon-512x512-39rql7k5.png"

  const { width } = useWindowSize(); // necessary as Swiper uses absolute positioning

  function getSlidecount(width: number | null) {
    if (width === null)
      return 3;
    if (width <= Number(tailwindConfig.theme.screens.md.replace('px', '')))
      return 3;
    else
      return 5;
  }

  let slidesPerView = useMemo(() => getSlidecount(width), [width])
  let autoScrollOffset = useMemo(() => Math.floor(slidesPerView / 2) - 1, [slidesPerView])

  function handleInit() {
    setInitialized(true);
  }

  return (
    <div className={clsx("p-2 sm:p-3 lg:p-4 flex flex-col productInfoCarousel", className, { "loading": !initialized })}>
      <div className='flex w-full items-center'>
        <SwiperLeftButton id={`${uniqueId}-swiper-button-prev`} enabled={activeSlide !== 0} className="mr-1" />

        <Swiper
          navigation={{
            nextEl: `#${uniqueId}-swiper-button-next`,
            prevEl: `#${uniqueId}-swiper-button-prev`,
          }}

          thumbs={{ swiper: thumbsSwiper, autoScrollOffset: autoScrollOffset }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="rounded-lg overflow-clip w-full border border-slate-600 aspect-video"
          onSlidesUpdated={(swiper) => { setSlideCount(swiper.slides.length) }}
          onActiveIndexChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          noSwiping
          noSwipingClass='no-swipe'
        >
          {
            product.videos.map((video, i) => (
              <SwiperSlide key={video.id}>
                <VideoPlayer video={video} className='h-full w-full overflow-clip' active={i === activeSlide} /> {/* TODO add sizes*/}
              </SwiperSlide>
            ))
          }

          {product.descriptionImages.map((image) => (
            <SwiperSlide key={image.id} className='relative'>
              <Image src={image.url} alt={image.alt} fill={true} /> {/* TODO add sizes*/}
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperRightButton id={`${uniqueId}-swiper-button-next`} enabled={activeSlide < slideCount - 1} className='ml-1' />

      </div>
      <Swiper
        centeredSlides={true}
        onSwiper={setThumbsSwiper}
        onAfterInit={() => handleInit()}
        spaceBetween={10}
        slidesPerView={slidesPerView}
        freeMode={false}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full mt-3 md:mt-4 thumbsSwiper"
      >
        {
          product.videos.map((video) => (
            <SwiperSlide key={video.id} className={clsx({ "!hidden": !initialized }, "border border-borders aspect-video relative")}>
              <div className='z-10 absolute aspect-square bg-[rgba(0,0,0,0.5)] rounded-full h-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <PiPlayCircleLight className='text-slate-300 w-full h-full' />
              </div>
              <Image src={video.thumbnail?.url || genericThumbnail} alt={"Miniatura: " + video.thumbnail?.alt || "Generic thumbnail."} fill={true} className='z-0' /> {/* TODO add sizes*/}
            </SwiperSlide>
          ))
        }
        {product.descriptionImages.map((image) => (
          <SwiperSlide key={image.id} className={clsx({ "!hidden": !initialized }, "border border-borders aspect-video relative")}>
            <Image src={image.url} alt={"Miniatura: " + image.alt} fill={true} /> {/* TODO add sizes*/}
          </SwiperSlide>
        ))}

      </Swiper>
    </div>
  );
}
