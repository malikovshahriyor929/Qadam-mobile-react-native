import { router, usePathname, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";


interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useRouter();
  const location = usePathname();

  const handleBack = () => {
    if (location === "/") {
      return;
    }
    router.back();
  };

  return (
    <View
      className="flex-row items-center justify-between h-[60px] px-4  shadow-lg bg-white !rounded-b-lg sticky top-0 z-[999] safe-top"
      style={ {
        borderBottomEndRadius: 13,
        borderBottomStartRadius: 13,
        backgroundColor: "white"
      } }>
      <View className="flex-row items-center">
        { showBackButton && (
          <Pressable onPress={ handleBack } className="mr-2 p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Pressable>
        ) }
        <Text className="text-xl font-semibold max-w-[290px] max-[347px]:max-w-[250px] truncate">{ title }</Text>
      </View>
      <View className="flex-row flex justify-center"></View>
    </View>
  );
};

export default Header;
