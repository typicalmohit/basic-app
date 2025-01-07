import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu } from "react-native-paper";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

const Home = () => {
  const { signOut, userProfile } = useAuth();
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  if (!userProfile) {
    return (
      <ScreenWrapper bg="white">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="white">
      {/* Header with Profile Menu */}

      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {userProfile.name}!</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: wp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkLight,
    backgroundColor: theme.colors.dark,
  },
  headerTitle: {
    fontSize: hp(2.4),
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  welcomeText: {
    fontSize: hp(2.8),
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  profileButton: {
    padding: wp(1),
  },
  menuContainer: {
    backgroundColor: theme.colors.dark,
    borderRadius: theme.radius.lg,
    marginTop: hp(1),
    marginRight: -wp(2),
    width: wp(45),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    height: hp(6),
    justifyContent: "center",
  },
  menuText: {
    fontSize: hp(1.8),
    fontWeight: "500",
    color: theme.colors.textDark,
    marginLeft: -wp(3),
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.darkLight, // Changed from border to darkLight since border doesn't exist
    marginVertical: hp(0.5),
  },
});

export default Home;
