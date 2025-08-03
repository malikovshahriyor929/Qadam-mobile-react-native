// import { Tabs } from 'expo-router';
// import { Calendar, Dumbbell, Home, User } from 'lucide-react-native';
// import { Pressable, Text, View } from 'react-native';
// const TabBarIcon = ({
//   focused,
//   icon,
//   title,
// }: {
//   focused: boolean;
//   icon: (color: string) => React.ReactNode;
//   title: string;
// }) => {
//   const color = focused ? "#2A2F35" : "#898989";
//   // const containerClasses = ;
//   return (
//     <View
//       key="tab-content"
//       className={ ` gap-1 ${focused
//         ? " items-center justify-center  min-w-[70px] w-full h-[50px]      "
//         : " items-center justify-center !w-[60px]  "
//         }` }
//     >
//       { icon(color) }
//       {/* { focused && ( */ }
//       <Text className={ `font-medium text-secondary   text-nowrap` } style={ {
//         color
//       } }>
//         { title }
//       </Text>
//       {/* ) } */ }
//     </View>
//   );
// };
// export default function TabsLayout() {
//   return (
//     <Tabs
//       screenOptions={ {
//         tabBarShowLabel: false,
//         tabBarStyle: {
//           height: 90,
//           paddingTop: 17,
//           borderTopRightRadius: 30,
//           borderTopLeftRadius: 30,
//           elevation: 0,
//           justifyContent: "space-between",
//           alignItems: "center",
//           // width: 350
//         }
//       } }
//     >
//       <Tabs.Screen name="index" options={ {
//         title: 'Home',
//         tabBarIcon: ({ focused, color, size }) => (
//           <TabBarIcon
//             focused={ focused }
//             title='Home'
//             icon={ (color) =>
//               <Home size={ size } color={ color } />
//             }
//           />
//         )
//       } }

//       />
//       <Tabs.Screen name="explore" options={ {
//         title: 'Explore',
//         tabBarIcon: ({ focused, color, size }) => (
//           <TabBarIcon
//             focused={ focused }
//             title='Explore'
//             icon={ (color) =>
//               <Dumbbell size={ size } color={ color } />
//             }
//           />
//         )
//       } }
//       />
//       <Tabs.Screen name="booking" options={ {
//         title: 'Booking',
//         tabBarIcon: ({ focused, color, size }) => (
//           <TabBarIcon
//             focused={ focused }
//             title='Booking'
//             icon={ (color) =>
//               <Calendar size={ size } color={ color } />
//             }
//           />
//         )
//       } } />
//       <Tabs.Screen name="profile" options={ {
//         title: 'Profile',
//         tabBarIcon: ({ focused, color, size }) => (
//           <TabBarIcon
//             focused={ focused }
//             title='Profile'
//             icon={ (color) =>
//               <User size={ size } color={ color } />
//             }
//           />
//         )
//       } } />
//     </Tabs>
//   );
// }


import { Tabs } from 'expo-router';
import { Calendar, Dumbbell, Home, User } from 'lucide-react-native';
import { Text, View, TouchableWithoutFeedback } from 'react-native';

// const TabBarIcon = ({
//   focused,
//   icon,
//   title,
// }: {
//   focused: boolean;
//   icon: (color: string) => React.ReactNode;
//   title: string;
// }) => {
//   const color = focused ? "#2A2F35" : "#898989";

//   return (
//     <View
//       key="tab-content"
//       className={ `gap-1 ${focused
//         ? "items-center justify-center min-w-[70px] w-full h-[50px]"
//         : "items-center justify-center !w-[60px]"}` }
//     >
//       { icon(color) }
//       <Text className="font-medium text-secondary text-nowrap" style={ { color } }>
//         { title }
//       </Text>
//     </View>
//   );
// };

// ✅ Custom TabButton – bounce yo‘q

const TabBarIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: (color: string) => React.ReactNode;
  title: string;
}) => {
  const color = focused ? "#2A2F35" : "#898989";
  // const containerClasses = ;
  return (
    <View
      key="tab-content"
      className={ ` gap-1 ${focused
        ? " items-center justify-center  min-w-[70px] w-full h-[50px]      "
        : " items-center justify-center !w-[60px]  "
        }` }
    >
      { icon(color) }
      {/* { focused && ( */ }
      <Text className={ `font-medium text-secondary   text-nowrap` } style={ {
        color
      } }>
        { title }
      </Text>
      {/* ) } */ }
    </View>
  );
};
function CustomTabButton({ children, onPress }: any) {
  return (
    <TouchableWithoutFeedback onPress={ onPress }>
      <View className='flex items-center justify-center' >{ children }</View>
    </TouchableWithoutFeedback>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={ {
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 100,
          paddingTop: 25,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          elevation: 0,
          backgroundColor: "#fff",
          justifyContent: "space-between",
          alignItems: "center",
          // position: "fixed",
        },
        tabBarItemStyle: {
          backgroundColor: "#fff"
        }
      } }
    >
      <Tabs.Screen
        name="index"
        options={ {
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={ focused } title="Home" icon={ (color) => <Home color={ color } /> } />
          ),
          tabBarButton: (props) => <CustomTabButton { ...props } />,
        } }
      />
      <Tabs.Screen
        name="explore"
        options={ {
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={ focused } title="Explore" icon={ (color) => <Dumbbell color={ color } /> } />
          ),
          tabBarButton: (props) => <CustomTabButton { ...props } />,
        } }
      />
      <Tabs.Screen
        name="booking"
        options={ {
          title: 'Booking',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={ focused } title="Booking" icon={ (color) => <Calendar color={ color } /> } />
          ),
          tabBarButton: (props) => <CustomTabButton { ...props } />,
        } }
      />
      <Tabs.Screen
        name="profile"
        options={ {
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={ focused } title="Profile" icon={ (color) => <User color={ color } /> } />
          ),
          tabBarButton: (props) => <CustomTabButton { ...props } />,
        } }
      />
    </Tabs>
  );
}
