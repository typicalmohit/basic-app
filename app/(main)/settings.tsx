import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { List, Divider } from "react-native-paper";
import { router, useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import Toast from "@/components/Toast";

export default function SettingsScreen() {
  const { signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      Toast.show({
        type: "error",
        message: "Failed to sign out",
      });
    }
  };

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <List.Section>
          <List.Item
            title="Account"
            left={(props) => <List.Icon {...props} icon="account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push("/profile")}
            titleStyle={{ color: "black" }}
          />
          <Divider />
          <List.Item
            title="Notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            titleStyle={{ color: "black" }}
          />
          <Divider />
          <List.Item
            title="Privacy"
            left={(props) => <List.Icon {...props} icon="shield" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            titleStyle={{ color: "black" }}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            titleStyle={{ color: "black" }}
          />
          <Divider />
          <List.Item
            title="About"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            titleStyle={{ color: "black" }}
          />
          <Divider />
          <List.Item
            title="Sign Out"
            left={(props) => <List.Icon {...props} icon="logout" color="red" />}
            onPress={handleSignOut}
            titleStyle={{ color: "red" }}
            disabled={loading}
          />
        </List.Section>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
});
