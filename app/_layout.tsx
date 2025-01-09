import { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    console.log("[RootLayout] Initializing app");
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen
              name="(main)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
