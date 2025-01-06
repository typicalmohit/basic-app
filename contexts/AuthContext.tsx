import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

// Define types for user profile
type UserProfile = {
  name: string;
  id: string;
  email: string;
  image?: string;
  address?: string;
  phone_number?: string;
  created_at: string;
};

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

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
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

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Signup failed");

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
        console.error("Profile creation error:", profileError);
        await supabase.auth.signOut();
        throw new Error("Failed to create user profile");
      }

      // Verify the profile was created
      const { data: profile, error: verifyError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (verifyError || !profile) {
        await supabase.auth.signOut();
        throw new Error("Failed to verify user profile");
      }

      // Set session and user profile
      setSession(authData.session);
      setUserProfile(profile);

      return;
    } catch (error: any) {
      console.error("Signup error:", error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user profile after successful login
    if (data.user) {
      await fetchUserProfile(data.user.id);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
