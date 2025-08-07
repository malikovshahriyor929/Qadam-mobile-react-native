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
          className="flex-row mb-4 items-center justify-between p-4 border rounded-[12px] bg-muted animate-pulse"
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-col gap-2">
              <Skeleton className=" bg-black/30  w-24 h-[90px]  rounded-[10px]" />
              <Skeleton className=" bg-black/30  h-8 w-full rounded-[10px]" />
            </View>

            <View className=" flex-col gap-3 justify-between ">
              <Skeleton className=" bg-black/30  h-5 w-36" />
              <Skeleton className=" bg-black/30  h-4 w-32" />
              <Skeleton className=" bg-black/30  h-3 w-20" />
              <Skeleton className=" bg-black/30  h-8 w-full rounded-[10px]" />
            </View>
          </View>
        </View>
      )) }
    </View>
  );
};

export default SkeletonForBooking;
