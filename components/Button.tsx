import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

interface ButtonProps {
  buttonStyle?: object;
  textStyle?: object;
  title: string;
  onPress?: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  disabled?: boolean;
}

const Button = ({
  buttonStyle,
  textStyle,
  title,
  onPress = () => {},
  loading = false,
  hasShadow = true,
  disabled = false,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[
        styles.button,
        buttonStyle,
        hasShadow && styles.shadow,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.text, textStyle, { includeFontPadding: false }]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: hp(2),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "600",
  },
  shadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabled: {
    backgroundColor: theme.colors.gray,
    opacity: 0.7,
  },
});

export default Button;
