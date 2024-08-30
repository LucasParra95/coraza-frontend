import ProductItem from "./../../product-item";
import { ProductTypeList } from "../../../types";

// import Swiper core and required components
import { Swiper, SwiperSlide } from "swiper/react";
//import { EffectCoverflow, Pagination } from 'swiper/modules';
import { useEffect, useState } from "react";

type ProductsCarouselType = {
  products: ProductTypeList[];
};

const ProductsCarousel = ({ products }: ProductsCarouselType) => {
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [centeredSlides, setCenteredSlides] = useState(true);
  const [spaceBetween, setSpaceBetween] = useState(1);

  useEffect(() => {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  function updateWindowSize() {
    // setSlidesPerView(1);
    // setSpaceBetween(30);
    // setCenteredSlides(true);

    if (window.innerWidth > 768) {
      setSlidesPerView(1);
      setSpaceBetween(40);
      setCenteredSlides(false);
    }
    if (window.innerWidth > 1024) {
      setSlidesPerView(3);
      setSpaceBetween(65);
      setCenteredSlides(false);
    }
  }

  if (!products) return <div>Cargando</div>;

  return (
    <div className="products-carousel">
      <Swiper
        spaceBetween={spaceBetween}
        loop={false}
        centeredSlides={centeredSlides}
        watchOverflow={true}
        slidesPerView={slidesPerView}
        className="swiper-wrapper"
      >
        {products.map((item) => (
          <SwiperSlide key={item.id} className="swiper-slide">
            <ProductItem
              id={item.id}
              name={item.name}
              price={item.price}
              color={item.color}
              discount={item.discount}
              currentPrice={item.currentPrice}
              key={item.id}
              images={item.images}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductsCarousel;
