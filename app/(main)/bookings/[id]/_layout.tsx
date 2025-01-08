import { Stack } from "expo-router";

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // This will hide the default header
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="view" />
    </Stack>
  );
}
