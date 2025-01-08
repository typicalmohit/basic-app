import React, { PropsWithChildren } from "react";
import { View, ViewStyle, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface ScreenWrapperProps {
  bg?: string;
  style?: ViewStyle;
  hideHeader?: boolean;
  title?: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

const ScreenWrapper = ({
  children,
  bg,
  style,
  hideHeader = false,
  title,
  showBackButton = false,
}: PropsWithChildren<ScreenWrapperProps>) => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const paddingTop = top;

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          flex: 1,
          paddingTop,
        },
        style,
      ]}
    >
      {!hideHeader && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 8,
          }}
        >
          {showBackButton && (
            <Pressable onPress={() => router.back()} style={{ marginRight: 8 }}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </Pressable>
          )}
          {title && (
            <Text style={{ fontSize: 20, fontWeight: "600" }}>{title}</Text>
          )}
        </View>
      )}
      {children}
    </View>
  );
};

export default ScreenWrapper;
