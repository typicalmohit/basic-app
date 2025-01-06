import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";

const Index: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    </ScreenWrapper>
  );
};

export default Index;
