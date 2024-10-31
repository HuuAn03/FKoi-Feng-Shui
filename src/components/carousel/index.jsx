import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; 
import './index.scss';
import { Pagination, Autoplay } from 'swiper/modules';
export default function Carousel() {
  return (
    <>
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="carousel"
      >
        <SwiperSlide><img src="https://fengshuielite.com/wp-content/uploads/2021/08/Science-of-Five-Elements-in-Fengshui.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://bluprint-onemega.com/wp-content/uploads/2018/01/koi-ponds-4.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://silkscreen.vn/wp-content/uploads/2021/06/ca-koi.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://www.biochem.vn/wp-content/uploads/2024/07/QT1-BG08.jpg" alt="" /></SwiperSlide>
      </Swiper>
    </>
  );
}
