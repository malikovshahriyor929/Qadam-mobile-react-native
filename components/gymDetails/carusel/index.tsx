// // import { HallImgaeType, HallType } from "@/@types";
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Autoplay } from "swiper/modules";
// // import "swiper/css";
// import { HallType } from "@/types";
// const GymCarousel = ({ images }: HallType) => {
//   {
//     /* <CarouselItem
//     className="w-full overflow-hidden mx-auto max-h-[260px] max-[430px]:max-h-[240px] max-[403px]:max-h-[220px] max-[365px]:max-h-[210px] max-[347px]:max-h-[200px] max-[333px]:max-h-[190px]  rounded-lg h-full object-cover p-0"
//     key={index}
//   > */
//   }
//   return (
//     <></>
//     // <Swiper
//     //   spaceBetween={30}
//     //   centeredSlides={true}
//     //   autoplay={{
//     //     delay: 4000,
//     //     disableOnInteraction: false,
//     //   }}
//     //   slidesPerView={1}
//     //   modules={[Autoplay]}
//     //   className="mySwiper w-full max-w-[400px] mx-auto "
//     // >
//     //   {images?.map((value: HallImgaeType, index: number) => (
//     //     <SwiperSlide
//     //       key={index}
//     //       className="w-full max-h-[260px] overflow-hidden rounded-lg flex items-center justify-center"
//     //     >
//     //       <img
//     //         loading="lazy"
//     //         src={`${import.meta.env.VITE_BASE_URL}/files/${value.filename}`}
//     //         className="w-full h-[260px] object-cover object-center rounded-lg"
//     //         alt="GymPod Facility"
//     //         style={{ touchAction: "auto" }}
//     //       />
//     //     </SwiperSlide>
//     //   ))}
//     // </Swiper>
//   );
// };
// export default GymCarousel;

import { View, Image, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import { HallType } from "@/types";

const { width } = Dimensions.get("window");

const GymCarousel = ({ images }: HallType) => {
  if (!images || images.length === 0) return null;

  return (
    <View style={{ height: 260, width: "100%" }}>
      <Swiper
        autoplay
        autoplayTimeout={4}
        showsPagination
        loop
        dotStyle={{ backgroundColor: "#ccc" }}
        activeDotStyle={{ backgroundColor: "#000" }}
      >
        {images.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: `${process.env.EXPO_PUBLIC_BASE_URL}/files/${img.filename}` }}
            style={{
              width,
              height: 260,
              resizeMode: "cover",
              borderRadius: 12,
            }}
          />
        ))}
      </Swiper>
    </View>
  );
};

export default GymCarousel;
