import ScreenWrapper from "@/components/ScreenWrapper";
import React from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  Pressable,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { authStyles as styles } from "@/styles/auth";

const Welcome: React.FC = () => {
  const router = useRouter();

  return (
    <ScreenWrapper bg="white">
      <StatusBar barStyle="dark-content" />
      <View style={styles.welcomeContainer as ViewStyle}>
        <Image
          style={styles.welcomeImage as ImageStyle}
          resizeMode="contain"
          source={require("../assets/images/welcome.png")}
        />
        <View style={styles.textContainer as ViewStyle}>
          <Text style={styles.welcomeTitle as TextStyle}>LinkUp!</Text>
          <Text style={styles.punchline as TextStyle}>
            Where you can find your friends
          </Text>
        </View>
      </View>

      <View style={styles.welcomeFooter as ViewStyle}>
        <Button
          title="Login"
          buttonStyle={styles.button}
          onPress={() => router.push("/login")}
        />
        <Pressable onPress={() => router.push("/signup")}>
          <Text style={styles.footerText as TextStyle}>
            Don't have an account?{" "}
            <Text style={styles.footerLink as TextStyle}>Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;
