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
import { validateEmail, validatePassword } from "@/helpers/validation";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { theme } from "@/constants/theme";
import { authStyles as styles } from "@/styles/auth";
import Toast from "@/components/Toast";

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (
      !formData.email ||
      !validateEmail(formData.email) ||
      !formData.password ||
      !validatePassword(formData.password)
    ) {
      setError("Please check your input fields");
      return;
    }

    try {
      setLoading(true);
      await signIn(formData.email, formData.password);
      router.replace("/(main)/home");
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
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
          <Text style={styles.title as TextStyle}>Hey,</Text>
          <Text style={[styles.title as TextStyle, { marginTop: -10 }]}>
            Welcome Back
          </Text>
          <Text style={styles.subtitle as TextStyle}>
            Please login to continue
          </Text>
        </View>

        <View style={styles.formContainer as ViewStyle}>
          <View style={styles.inputContainer as ViewStyle}>
            <MaterialIcons
              name="mail"
              size={20}
              color={theme.colors.textLight}
            />
            <TextInput
              placeholder="Enter your email"
              style={[styles.input as TextStyle, { includeFontPadding: false }]}
              placeholderTextColor={theme.colors.textLight}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
            />
          </View>

          <View style={styles.inputContainer as ViewStyle}>
            <MaterialIcons
              name="lock"
              size={20}
              color={theme.colors.textLight}
            />
            <TextInput
              placeholder="Enter your password"
              secureTextEntry
              style={[styles.input as TextStyle, { includeFontPadding: false }]}
              placeholderTextColor={theme.colors.textLight}
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
            />
          </View>

          <Pressable
            style={styles.forgotPassword as ViewStyle}
            onPress={() => console.log("Forgot password")}
          >
            <Text style={styles.forgotPasswordText as TextStyle}>
              Forgot Password?
            </Text>
          </Pressable>

          <Button
            title="Login"
            buttonStyle={styles.button as ViewStyle}
            textStyle={styles.buttonText as TextStyle}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />
        </View>

        <View style={styles.footer as ViewStyle}>
          <Pressable onPress={() => router.push("/signup")}>
            <Text style={styles.footerText as TextStyle}>
              Don't have an account?{" "}
              <Text style={styles.footerLink as TextStyle}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </View>
      <Toast message={error} isVisible={!!error} type="error" />
    </ScreenWrapper>
  );
};

export default Login;
