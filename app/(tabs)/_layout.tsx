import { Tabs } from 'expo-router';
import { t } from 'i18next';
import { Calendar, Dumbbell, Home, User } from 'lucide-react-native';
import { Text, View, TouchableWithoutFeedback } from 'react-native';

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
  return (
    <View
      key="tab-content"
      className={ ` gap-1 ${focused
        ? " items-center justify-center  min-w-[100px] w-full h-[50px]      "
        : " items-center justify-center min-w-[100px]  "
        }` }
    >
      { icon(color) }
      <Text className={ `font-medium text-secondary   text-nowrap` } style={ {
        color
      } }>
        { title }
      </Text>
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
          height: 90,
          paddingTop: 22,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          borderColor: "#fff",
          backgroundColor: "#ffffff",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          zIndex: 888,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.09,
          shadowRadius: 8,
        },
        // tabBarItemStyle: {
        //   backgroundColor: "transparent", // ✅ unnecessary white
        // },
      } }

    >
      <Tabs.Screen
        name="index"
        options={ {
          title: t('nav.home'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={ focused } title={ t('nav.home') } icon={ (color) => <Home color={ color } /> } />
          ),
          tabBarButton: (props) => <CustomTabButton { ...props } />,
        } }
      />
      <Tabs.Screen
        name="explore"
        options={ {
          title: t('nav.explore'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={ focused } title={ t('nav.explore') } icon={ (color) => <Dumbbell color={ color } /> } />
          ),
          tabBarButton: (props) => <CustomTabButton { ...props } />,
        } }

      />
      <Tabs.Screen
        name="booking"
        options={ {
          title: t('nav.bookings'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={ focused } title={ t('nav.bookings') } icon={ (color) => <Calendar color={ color } /> } />
          ),
          tabBarButton: (props) => <CustomTabButton { ...props } />,
        } }
      />
      <Tabs.Screen
        name="profile"
        options={ {
          title: t('nav.profile'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={ focused } title={ t('nav.profile') } icon={ (color) => <User color={ color } /> } />
          ),
          tabBarButton: (props) => <CustomTabButton { ...props } />,
        } }
      />
    </Tabs>
  );
}
