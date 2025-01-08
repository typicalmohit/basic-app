import { useAuth } from "@/contexts/AuthContext";
import Welcome from "@/components/Welcome";
import LoadingScreen from "@/components/LoadingScreen";
import { Redirect } from "expo-router";

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (session) {
    return <Redirect href="/(main)/home" />;
  }

  return <Welcome />;
}
