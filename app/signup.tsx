import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "@/helpers/validation";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { theme } from "@/constants/theme";
import { authStyles as styles } from "@/styles/auth";
import Toast from "@/components/Toast";

const Signup: React.FC = () => {
  const { signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async () => {
    if (
      !formData.fullName ||
      !validateName(formData.fullName) ||
      !formData.email ||
      !validateEmail(formData.email) ||
      !formData.password ||
      !validatePassword(formData.password) ||
      !formData.confirmPassword ||
      formData.password !== formData.confirmPassword
    ) {
      setError("Please check your input fields");
      return;
    }

    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      console.log("Starting signup process...");

      await signUp(formData.email, formData.password, formData.fullName);
      console.log("Signup successful, navigating to home...");

      router.replace("/(main)/home");
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container as ViewStyle}>
        <Pressable
          style={styles.backButton as ViewStyle}
          onPress={() => router.back()}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.colors.textDark}
          />
        </Pressable>

        <View style={styles.headerContainer as ViewStyle}>
          <Text style={styles.title as TextStyle}>Create Account</Text>
          <Text style={styles.subtitle as TextStyle}>
            Sign up to get started
          </Text>
        </View>

        <View style={styles.formContainer as ViewStyle}>
          <View style={styles.inputContainer as ViewStyle}>
            <MaterialIcons
              name="person"
              size={20}
              color={theme.colors.textLight}
            />
            <TextInput
              placeholder="Full Name"
              style={[styles.input as TextStyle, { includeFontPadding: false }]}
              placeholderTextColor={theme.colors.textLight}
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, fullName: text }))
              }
              autoCapitalize="words"
              autoCorrect={false}
              keyboardType="default"
            />
          </View>

          <View style={styles.inputContainer as ViewStyle}>
            <MaterialIcons
              name="mail"
              size={20}
              color={theme.colors.textLight}
            />
            <TextInput
              placeholder="Email"
              style={[styles.input as TextStyle, { includeFontPadding: false }]}
              placeholderTextColor={theme.colors.textLight}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer as ViewStyle}>
            <MaterialIcons
              name="lock"
              size={20}
              color={theme.colors.textLight}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={[styles.input as TextStyle, { includeFontPadding: false }]}
              placeholderTextColor={theme.colors.textLight}
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer as ViewStyle}>
            <MaterialIcons
              name="lock"
              size={20}
              color={theme.colors.textLight}
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={[styles.input as TextStyle, { includeFontPadding: false }]}
              placeholderTextColor={theme.colors.textLight}
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, confirmPassword: text }))
              }
              autoCapitalize="none"
            />
          </View>

          <Button
            title="Sign Up"
            buttonStyle={styles.button as ViewStyle}
            textStyle={styles.buttonText as TextStyle}
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
          />
        </View>

        <View style={styles.footer as ViewStyle}>
          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.footerText as TextStyle}>
              Already have an account?{" "}
              <Text style={styles.footerLink as TextStyle}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </View>
      <Toast message={error} isVisible={!!error} type="error" />
    </ScreenWrapper>
  );
};

export default Signup;
