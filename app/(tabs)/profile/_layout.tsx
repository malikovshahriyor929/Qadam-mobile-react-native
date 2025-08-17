import { Stack } from "expo-router";
// import "./global.css";
export default function ProfileLayout() {
  return (
    // <Stack
    //   screenOptions={{
    //     headerShown: false,
    //   }}
    // />
    <Stack screenOptions={ { headerShown: false } }>
      <Stack.Screen name="index" />
      <Stack.Screen name="membership/index" />
      <Stack.Screen name="membership/[membershipId]" />
      <Stack.Screen name="chat/index" />
      <Stack.Screen name="setting/index" />
    </Stack>
  )
}
