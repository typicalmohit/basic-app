import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail, validatePassword } from "@/utils/validation";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { theme } from "@/constants/theme";

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "mohit@k.com",
    password: "123456",
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
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.colors.textDark}
          />
        </Pressable>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Hey,</Text>
          <Text style={[styles.title, { marginTop: -10 }]}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please login to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={20}
              color={theme.colors.textLight}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor={theme.colors.textLight}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color={theme.colors.textLight}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              placeholderTextColor={theme.colors.textLight}
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            buttonStyle={styles.loginButton}
          />

          <Pressable
            style={styles.signupButton}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text style={styles.signupLink}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.textDark,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginTop: 10,
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray, // Changed from theme.colors.border to theme.colors.gray
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: theme.colors.textDark,
    fontSize: 16,
  },
  errorText: {
    color: theme.colors.rose,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 20,
  },
  signupButton: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  signupLink: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
} as const;

export default Login;
