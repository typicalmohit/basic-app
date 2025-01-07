import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect, useRouter } from "expo-router";
import {
  View,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { theme } from "@/constants/theme";
import { IconButton, Menu, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function MainLayout() {
  const { session, loading, userProfile, checkUser, signOut } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    async function verifyUser() {
      if (session) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const isValid = await checkUser();
        setIsVerified(isValid);
        if (!isValid) {
          await signOut();
          router.replace("/welcome");
        }
      }
      setVerifying(false);
    }

    verifyUser();
  }, [session]);

  if (loading || verifying) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!session || !isVerified) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerRight: () => (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Pressable
                onPress={() => setMenuVisible(true)}
                style={styles.profileButton}
              >
                <Avatar.Image
                  size={35}
                  source={
                    userProfile?.image
                      ? { uri: userProfile.image }
                      : require("@/assets/images/defaultUser.png")
                  }
                />
              </Pressable>
            }
            contentStyle={[
              styles.menuContainer,
              {
                marginTop: 35,
                marginRight: -8,
                width: Dimensions.get("window").width * 0.6,
                maxWidth: 280,
              },
            ]}
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                router.push("/(main)/profile");
              }}
              title="Profile"
              leadingIcon={({ size, color }) => (
                <MaterialIcons
                  name="person-outline"
                  size={24}
                  color={theme.colors.textDark}
                />
              )}
              style={styles.menuItem}
              titleStyle={styles.menuText}
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                router.push("/(main)/settings");
              }}
              title="Settings"
              leadingIcon={({ size, color }) => (
                <MaterialIcons
                  name="settings"
                  size={24}
                  color={theme.colors.textDark}
                />
              )}
              style={styles.menuItem}
              titleStyle={styles.menuText}
            />
            <View style={styles.menuDivider} />
            <Menu.Item
              onPress={() => {
                signOut();
                setMenuVisible(false);
              }}
              title="Sign Out"
              leadingIcon={({ size, color }) => (
                <MaterialIcons
                  name="logout"
                  size={24}
                  color={theme.colors.textDark}
                />
              )}
              style={styles.menuItem}
              titleStyle={styles.menuText}
            />
          </Menu>
        ),
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "Home",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitle: "Settings",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    marginRight: 15,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: "hidden",
    backgroundColor: theme.colors.gray,
  },
  menuContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuItem: {
    height: 48,
    paddingHorizontal: 16,
  },
  menuText: {
    color: theme.colors.textDark,
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.gray,
    marginVertical: 4,
  },
});
