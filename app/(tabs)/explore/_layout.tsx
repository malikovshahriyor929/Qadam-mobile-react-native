import { Stack } from "expo-router";
import "../../global.css";
export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={ {
        headerShown: false,
      } }
    />
  )
}
