"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./HeroSlider.css";


export default function HeroSlider() {


const slides = [

{
image:"/banner1.jpg",
title:"Korean",
subtitle:"Pants",
description:"The pants everyone talking about.",
offer:"FLAT AT ৳998",
button:"SHOP NOW",
link:"/product-category/men"
},


{
image:"/banner2.jpg",
title:"Premium",
subtitle:"T-Shirts",
description:"Comfort meets modern style.",
offer:"UP TO 50% OFF",
button:"SHOP NOW",
link:"/shop"
},


{
image:"/banner3.jpg",
title:"New",
subtitle:"Collection",
description:"Fresh styles for everyone.",
offer:"NEW ARRIVALS",
button:"EXPLORE",
link:"/shop"
}


];



return (

<section className="hero-slider">


<Swiper

modules={[
Autoplay,
Pagination,
Navigation
]}


slidesPerView={1}

spaceBetween={0}

loop={true}


autoplay={{
delay:4000,
disableOnInteraction:false
}}


pagination={{
clickable:true
}}


navigation={true}


className="heroSwiper"

>


{

slides.map((slide,index)=>(


<SwiperSlide key={index}>


<div

className="hero-slide"

style={{

backgroundImage:

`linear-gradient(
rgba(0,0,0,.25),
rgba(0,0,0,.25)
),
url(${slide.image})`

}}

>


<div className="hero-content">


<h1>

{slide.title}

<br/>

<span>
{slide.subtitle}
</span>

</h1>


<p>
{slide.description}
</p>



<div className="offer">

{slide.offer}

</div>



<a href={slide.link}>

{slide.button}

</a>



</div>


</div>


</SwiperSlide>


))

}



</Swiper>


</section>

);


}