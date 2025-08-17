// import { Skeleton } from "@/components/ui/skeleton";
// import React from "react";

import { Skeleton } from "@/components/location/gymPodCard/skeleton";
import { View } from "react-native";

// const SkeletonForBooking = ({ pages = 5 }) => {
//   const skeletons = new Array(pages).fill(null);
//   return (
//     <div>
//       {skeletons.map((_, idx) => (
//         <div key={idx} className="gym-card mb-4 opacity-70 animate-pulse">
//           <div className="flex">
//             <Skeleton className="w-20 h-20 rounded-lg mr-3" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-1/2" />
//               <Skeleton className="h-4 w-1/3" />
//               <Skeleton className="h-4 w-1/4" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SkeletonForBooking;

type Props = {
  pages?: number;
};

const SkeletonForBooking = ({ pages = 5 }: Props) => {
  const skeletons = new Array(pages).fill(null);

  return (
    <View className=" px-4 mt-4 ">
      { skeletons.map((_, idx) => (
        <View
          key={ idx }
          className="flex-row mb-4 items-center justify-between p-4 border border-gray-300 rounded-[12px] bg-muted animate-pulse "
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-col gap-2">
              <Skeleton className=" bg-black/30  w-24 h-[90px]  rounded-xl" />
              <Skeleton className=" bg-black/30  h-8 w-full rounded-xl" />
            </View>

            <View className=" flex-col gap-2 justify-between ">
              <Skeleton className=" bg-black/30 rounded-xl   h-8 w-48" />
              <Skeleton className=" bg-black/30 rounded-xl  h-6 w-32" />
              <Skeleton className=" bg-black/30 rounded-xl  h-5 w-20" />
              <Skeleton className=" bg-black/30 h-8 mt-2 w-full rounded-xl" />
            </View>
          </View>
        </View>
      )) }
    </View>
  );
};

export default SkeletonForBooking;
