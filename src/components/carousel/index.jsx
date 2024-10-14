import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './index.scss';

// import required modules
import { Pagination } from 'swiper/modules';

export default function Carousel() {
  return (
    <>
      <Swiper pagination={true} modules={[Pagination]} className="carousel">
        <SwiperSlide><img src="https://fengshuielite.com/wp-content/uploads/2021/08/Science-of-Five-Elements-in-Fengshui.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://bluprint-onemega.com/wp-content/uploads/2018/01/koi-ponds-4.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://silkscreen.vn/wp-content/uploads/2021/06/ca-koi.jpg" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://www.biochem.vn/wp-content/uploads/2024/07/QT1-BG08.jpg" alt="" /></SwiperSlide>
      </Swiper>
    </>
  );
}
