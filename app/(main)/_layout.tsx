import { Stack, Redirect } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";

export default function MainLayout() {
  const { session, loading } = useAuth();

  useEffect(() => {
    console.log("[MainLayout] Auth state:", { session: !!session, loading });
  }, [session, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen
          name="bookings"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
