import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu } from "react-native-paper";

const Home = () => {
  const { signOut, userProfile } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("[Home] Screen mounted");
    return () => {
      console.log("[Home] Screen unmounted");
    };
  }, []);

  useEffect(() => {
    if (!userProfile) {
      console.log("[Home] No user profile, showing loading state");
    } else {
      console.log("[Home] User profile loaded:", userProfile.name);
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <ScreenWrapper bg="white">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00C26F" />
        </View>
      </ScreenWrapper>
    );
  }

  const handleNavigation = (route: string) => {
    console.log("[Home] Navigating to:", route);
    if (route === "bookings") {
      router.push({ pathname: "/(main)/bookings" } as any);
    } else {
      alert("Coming Soon!");
    }
  };

  console.log("[Home] Rendering main content");
  return (
    <ScreenWrapper bg="white">
      {/* Header with Avatar Menu */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Features</Text>
        <Text style={styles.welcomeTextRight}>{userProfile.name}</Text>
      </View>

      {/* Main Options */}
      <View style={styles.optionsContainer}>
        {/* Booking Tracker */}
        <Pressable
          style={styles.optionCard}
          onPress={() => handleNavigation("bookings")}
        >
          <MaterialIcons name="directions-bus" size={32} color="#00C26F" />
          <Text style={styles.optionTitle}>Booking Tracker</Text>
          <Text style={styles.optionDescription}>
            Track and manage your transport bookings
          </Text>
        </Pressable>

        {/* Document Storage */}
        <Pressable
          style={styles.optionCard}
          onPress={() => handleNavigation("documents")}
        >
          <MaterialIcons name="folder" size={32} color="#00C26F" />
          <Text style={styles.optionTitle}>Document Storage</Text>
          <Text style={styles.optionDescription}>Coming Soon!</Text>
        </Pressable>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1D",
  },
  welcomeTextRight: {
    fontSize: 14,
    fontWeight: "400",
    color: "#7C7C7C",
    alignSelf: "flex-end",
    marginLeft: "auto",
    marginRight: 16,
  },
  optionsContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  optionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1D",
    marginTop: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#7C7C7C",
    marginTop: 4,
  },
});

export default Home;
