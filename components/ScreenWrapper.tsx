import React, { PropsWithChildren } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  bg?: string;
  style?: ViewStyle;
}

const ScreenWrapper = ({
  children,
  bg,
  style,
}: PropsWithChildren<ScreenWrapperProps>) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

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
      {children}
    </View>
  );
};

export default ScreenWrapper;
