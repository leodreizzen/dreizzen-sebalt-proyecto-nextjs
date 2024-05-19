"use client";
import { ProductDTO } from "@/data/DTO";
import clsx from "clsx";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'
import 'swiper/css/effect-fade';
import { SwiperSlide, Swiper } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import FeaturedProductCard from "@/ui/cards/FeaturedProductCard";
import { useId } from "react";
import SwiperLeftButton from "../SwiperLeftButton";
import SwiperRightButton from "../SwiperRightButton";

export default function FeaturedProductsCarousel({ className, products }: { className?: string, products: ProductDTO[] }) {
    const uniqueId = useId().replaceAll(":", "")
    return (
        <div className={clsx(className, "flex flex-col")}>
            <div className="flex w-full flex-grow items-center">
                <SwiperLeftButton id={`${uniqueId}-swiper-button-prev`} enabled className="mr-1" />
                <Swiper
                    loop={true}
                    autoplay={
                        {
                            delay: 4000,
                            disableOnInteraction: true,
                        }
                    }
                    speed={1200}
                    fadeEffect={{
                        crossFade: true
                    }
                    }
                    effect="fade"
                    centeredSlides={true}
                    slidesPerView={3}
                    navigation={
                        {
                            nextEl: `#${uniqueId}-swiper-button-next`,
                            prevEl: `#${uniqueId}-swiper-button-prev`,
                        }
                    }
                    pagination={{
                        clickable: true,
                        el: `#${uniqueId}-swiper-pagination`,
                        bulletClass: "bullet",
                        renderBullet(_, className) {
                            return `<span class="${className} bg-white w-3 h-3 rounded-full inline-block mr-1 cursor-pointer" ></span>`;
                        },

                    }}
                    modules={[Pagination, Navigation, Autoplay, EffectFade]}
                    className="h-full w-full"
                    wrapperClass="h-full w-full"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product.id}>
                            <FeaturedProductCard product={product} className="h-full w-full" />
                        </SwiperSlide>
                    ))
                    }
                </Swiper>

                <SwiperRightButton id={`${uniqueId}-swiper-button-next`} enabled className="ml-1"/>
            </div>
            <div id={`${uniqueId}-swiper-pagination`} className={`mt-2 h-5 flex justify-center`} />
        </div>
    )
}
