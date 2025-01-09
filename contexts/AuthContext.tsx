import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import Toast from "@/components/Toast";

// Define types for user profile
interface UserProfile {
  id: string;
  email: string;
  name: string;
  country_code?: string;
  phone_number?: string;
  address?: string;
  gender?: string;
  birthday?: Date;
  image?: string;
  created_at: string;
}

type AuthContextType = {
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  checkUser: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      if (data) setUserProfile(data);
    } catch (error: any) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log("[AuthContext] Initializing auth state");
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("[AuthContext] Auth state changed:", {
        event,
        currentSession,
      });

      if (!isMounted) return;
      setSession(currentSession);

      if (currentSession?.user) {
        console.log("[AuthContext] User found, fetching profile");
        await fetchUserProfile(currentSession.user.id);
        if (event === "SIGNED_IN") {
          console.log("[AuthContext] User signed in, navigating to home");
          router.replace("/(main)/home");
        }
      } else {
        console.log("[AuthContext] No user found, clearing profile");
        setUserProfile(null);
        if (event === "SIGNED_OUT") {
          console.log("[AuthContext] User signed out, navigating to welcome");
          router.replace("/");
        }
      }
      setLoading(false);
    });

    // Initial session check
    const initSession = async () => {
      try {
        console.log("[AuthContext] Checking initial session");
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        console.log("[AuthContext] Initial session result:", {
          currentSession,
        });

        if (!isMounted) return;
        setSession(currentSession);

        if (currentSession?.user) {
          console.log("[AuthContext] Initial user found, fetching profile");
          await fetchUserProfile(currentSession.user.id);
          // Remove the automatic navigation from here
        }
      } catch (error) {
        console.error("[AuthContext] Error checking initial session:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    return () => {
      console.log("[AuthContext] Cleaning up auth subscription");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("[AuthContext] Starting signup process:", { email, name });
      setLoading(true);

      // First, sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        }
      );

      if (signUpError) {
        console.error("[AuthContext] Signup error:", signUpError);
        throw signUpError;
      }
      if (!authData.user) {
        console.error("[AuthContext] Signup failed: No user data returned");
        throw new Error("Signup failed");
      }

      console.log("[AuthContext] User created successfully:", authData.user.id);

      // Create user profile in the users table using upsert
      const { error: profileError } = await supabase.from("users").upsert(
        {
          id: authData.user.id,
          email: email,
          name: name,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

      if (profileError) {
        console.error("[AuthContext] Profile creation error:", profileError);
        await supabase.auth.signOut();
        throw new Error("Failed to create user profile");
      }

      console.log("[AuthContext] User profile created successfully");

      // Verify the profile was created
      const { data: profile, error: verifyError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (verifyError || !profile) {
        console.error("[AuthContext] Profile verification error:", verifyError);
        await supabase.auth.signOut();
        throw new Error("Failed to verify user profile");
      }

      console.log("[AuthContext] User profile verified successfully");

      // Set session and user profile
      setSession(authData.session);
      setUserProfile(profile);

      return;
    } catch (error: any) {
      console.error("[AuthContext] Signup process error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[AuthContext] Starting sign in process for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("[AuthContext] Sign in error:", error);
        throw error;
      }

      // Set session and fetch user profile
      if (data.user) {
        console.log("[AuthContext] Sign in successful for user:", data.user.id);
        setSession(data.session);
        await fetchUserProfile(data.user.id);
        console.log("[AuthContext] User profile fetched, navigating to home");
        router.replace("/(main)/home");
      }
    } catch (error) {
      console.error("[AuthContext] Sign in process error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // First clear the local state
      setSession(null);
      setUserProfile(null);

      // Then attempt to sign out from Supabase
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.log("Supabase signOut error (ignored):", error);
      }

      // Navigate to welcome page
      router.replace("/");
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      Toast.show({
        type: "error",
        message: "An error occurred while signing out",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!session?.user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", session.user.id);

      if (error) throw error;

      // Refresh user profile
      await fetchUserProfile(session.user.id);
    } catch (error) {
      throw error;
    }
  };

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return false;

      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) return false;

      setUserProfile(profile);
      return true;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        userProfile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
