import { View, ActivityIndicator } from "react-native";
import { theme } from "@/constants/theme";

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
