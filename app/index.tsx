import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Welcome from "@/components/Welcome";
import LoadingScreen from "@/components/LoadingScreen";
import { Redirect } from "expo-router";

export default function Index() {
  const { session, loading } = useAuth();

  useEffect(() => {
    console.log("[Index] Auth state:", { session: !!session, loading });
  }, [session, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  // If authenticated, go to home
  if (session) {
    return <Redirect href="/(main)/home" />;
  }

  // If not authenticated, show welcome screen
  // Welcome screen should have buttons to navigate to /login or /signup
  return <Welcome />;
}
