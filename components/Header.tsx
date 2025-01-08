import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu } from "react-native-paper";
import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const { signOut, userProfile } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const renderProfileButton = () => {
    return (
      <View style={styles.profileImageContainer}>
        <Image
          source={
            userProfile?.image
              ? { uri: userProfile.image }
              : require("../assets/images/default-user-image.png")
          }
          style={styles.profileImage}
          onError={(e) =>
            console.log("Image loading error:", e.nativeEvent.error)
          }
        />
      </View>
    );
  };

  return (
    <View style={[styles.header, { paddingTop: top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <View style={styles.leftSection}>
        <Pressable
          onPress={() => router.push("/home")}
          style={styles.iconButton}
        >
          <MaterialIcons name="home" size={28} color={theme.colors.primary} />
        </Pressable>
        {showBackButton && (
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={theme.colors.textDark}
            />
          </Pressable>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Pressable
            onPress={() => setMenuVisible(true)}
            style={styles.iconButton}
          >
            {renderProfileButton()}
          </Pressable>
        }
      >
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            router.push("/profile");
          }}
          title="Profile"
          leadingIcon="account"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            router.push("/settings");
          }}
          title="Settings"
          leadingIcon="cog"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            signOut();
          }}
          title="Sign Out"
          leadingIcon="logout"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    marginRight: 12,
  },
  iconButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  profileImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});

export default Header;
