import { Stack, Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";

export default function MainLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/" />;
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
