import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { errorLogger } from "@/services/errorLogging";

// Coffee tribe type
export type CoffeeTribe = 'fox' | 'owl' | 'hummingbird' | 'bee';

// Brewing level type
export type BrewingLevel = 'beginner' | 'intermediate' | 'expert';

// Profile type matching our database schema
interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  coffee_tribe: CoffeeTribe | null;
  is_onboarded: boolean;
  onboarded_at: string | null;
  weekly_goal_target: number;
  brewing_level: BrewingLevel;
  city: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        errorLogger.warn("Failed to fetch profile", { 
          component: "AuthContext", 
          action: "fetchProfile",
          metadata: { userId }
        });
        return null;
      }

      return data as Profile;
    } catch (err) {
      errorLogger.captureError(err as Error, { 
        component: "AuthContext", 
        action: "fetchProfile" 
      });
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Update error logger context
        if (session?.user) {
          errorLogger.setUserContext(session.user.id);
          // Defer profile fetch with setTimeout to avoid deadlock
          setTimeout(() => {
            fetchProfile(session.user.id).then(setProfile);
          }, 0);
        } else {
          errorLogger.clearUserContext();
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        errorLogger.setUserContext(session.user.id);
        fetchProfile(session.user.id).then(setProfile);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        errorLogger.warn("Sign in failed", { 
          component: "AuthContext", 
          action: "signIn",
          metadata: { email }
        });
        return { error };
      }

      return { error: null };
    } catch (err) {
      errorLogger.captureError(err as Error, { 
        component: "AuthContext", 
        action: "signIn" 
      });
      return { error: err as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<{ error: Error | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || null,
          },
        },
      });

      if (error) {
        errorLogger.warn("Sign up failed", { 
          component: "AuthContext", 
          action: "signUp",
          metadata: { email }
        });
        return { error };
      }

      return { error: null };
    } catch (err) {
      errorLogger.captureError(err as Error, { 
        component: "AuthContext", 
        action: "signUp" 
      });
      return { error: err as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      errorLogger.clearUserContext();
    } catch (err) {
      errorLogger.captureError(err as Error, { 
        component: "AuthContext", 
        action: "signOut" 
      });
    }
  };

  // Refresh profile - allows components to manually refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const freshProfile = await fetchProfile(user.id);
      if (freshProfile) {
        setProfile(freshProfile);
      }
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During HMR or edge cases, provide a safe fallback instead of crashing
    if (import.meta.env.DEV) {
      console.warn("useAuth called outside AuthProvider - returning loading state");
      return {
        user: null,
        session: null,
        profile: null,
        isLoading: true,
        signIn: async () => ({ error: new Error("Auth not ready") }),
        signUp: async () => ({ error: new Error("Auth not ready") }),
        signOut: async () => {},
        refreshProfile: async () => {},
      } as AuthContextValue;
    }
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
