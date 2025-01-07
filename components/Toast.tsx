import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";

interface ToastProps {
  position?: "top" | "bottom";
}

interface ToastConfig {
  type?: "error" | "success";
  title?: string;
  message: string;
}

interface ToastState extends ToastConfig {
  visible: boolean;
}

const initialState: ToastState = {
  visible: false,
  message: "",
  type: "error",
};

let toastRef: any = null;

const Toast: React.FC<ToastProps> & { show: (config: ToastConfig) => void } = ({
  position = "top",
}) => {
  const [state, setState] = useState<ToastState>(initialState);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    toastRef = {
      show: (config: ToastConfig) => {
        setState({
          visible: true,
          message: config.message,
          type: config.type || "error",
          title: config.title,
        });
      },
    };
  }, []);

  useEffect(() => {
    if (state.visible) {
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
      ]).start(() => {
        setState((prev) => ({ ...prev, visible: false }));
      });
    }
  }, [state.visible]);

  if (!state.visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === "bottom" ? styles.bottom : styles.top,
        { opacity },
        state.type === "success" ? styles.success : styles.error,
      ]}
    >
      <Text style={styles.text}>{state.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: wp(4),
    right: wp(4),
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    padding: hp(2),
    borderRadius: theme.radius.sm,
    zIndex: 999,
  },
  top: {
    top: hp(12),
  },
  bottom: {
    bottom: hp(12),
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

// Static method to show toast
Toast.show = (config: ToastConfig) => {
  if (toastRef) {
    toastRef.show(config);
  }
};

export default Toast;
