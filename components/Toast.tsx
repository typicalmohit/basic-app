import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";

interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: "error" | "success";
}

const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  type = "error",
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity },
        type === "success" ? styles.success : styles.error,
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: hp(12),
    left: wp(4),
    right: wp(4),
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    padding: hp(2),
    borderRadius: theme.radius.sm,
    zIndex: 999,
  },
  text: {
    color: "white",
    fontSize: hp(1.6),
    textAlign: "center",
  },
  error: {
    backgroundColor: "rgba(255, 0, 0, 0.9)",
  },
  success: {
    backgroundColor: "rgba(0, 180, 0, 0.9)",
  },
});

export default Toast;
