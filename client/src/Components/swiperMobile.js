import React from 'react'
import Swiper from 'react-id-swiper';
import 'react-id-swiper/lib/styles/css/swiper.css';
import '../CSS/Admin  CSS/salesPanel.css'

const params = {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    spaceBetween: 0,
    slidesPerView: 2,
}

const swiperMobile = props => {
    let swiperData = props.data.map(index => {
        return (
            <span key={index} style={{ textAlign: "center", width: "33.3%" }} className="navProps">
                {index}
            </span>
        )
    })

    return (
        <div style={{ backgroundColor: "#FDEFF5" }}>
            <Swiper {...params}>
                {swiperData}
            </Swiper>
        </div>
    )
}

export default swiperMobile
