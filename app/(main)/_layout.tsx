import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { theme } from "@/constants/theme";

export default function MainLayout() {
  const { session, loading, checkUser, signOut } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verifyUser() {
      if (session) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const isValid = await checkUser();
        setIsVerified(isValid);
        if (!isValid) {
          await signOut();
          router.replace("/welcome");
        }
      }
      setVerifying(false);
    }

    verifyUser();
  }, [session]);

  if (loading || verifying) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!session || !isVerified) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}
