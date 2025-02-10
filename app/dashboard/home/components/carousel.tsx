"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";

const IMAGE_PATHS = [
  "/img/banners/banner1.jpeg",
  "/img/banners/banner2.jpg",
  "/img/banners/banner3.jpg",
  "/img/banners/banner4.jpg",
  "/img/banners/banner5.jpg",
  "/img/banners/banner6.jpg",
  "/img/banners/banner7.jpg",
];

export function CarouselComponent(): JSX.Element {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="w-full"
    >
      {IMAGE_PATHS.map((path, index) => (
        <SwiperSlide key={index}>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6 w-[600px] h-[400px]">
                <Image
                  src={path}
                  alt={`Banner ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
