import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import { theme } from "@/constants/theme";

const Home = () => {
  const { signOut, userProfile } = useAuth();

  if (!userProfile) {
    return (
      <ScreenWrapper bg="white">
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Welcome, {userProfile.name}!
        </Text>
        <Button
          title="Sign Out"
          onPress={signOut}
          buttonStyle={{ marginTop: 20 }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;
