'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, Provider, SignInWithPasswordCredentials, SupabaseClient } from '@supabase/supabase-js'; // Added SupabaseClient
// Import the new client creation function instead of the pre-configured one
import { createClientComponentClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (credentials: SignInWithPasswordCredentials) => Promise<void>; // Added login function type
  // Add other auth methods like signUp, signInWithOAuth if needed
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  login: async () => {}, // Added default empty login function
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Create the client instance using the ssr helper and store it in state
  const [supabase] = useState(() => createClientComponentClient());

  useEffect(() => {
    // Get initial session using the new client instance
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes using the new client instance
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Use the new client instance
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Add the login function
  const login = async (credentials: SignInWithPasswordCredentials) => {
    // Use the new client instance
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      console.error('Error logging in:', error);
      // Re-throw the error so the calling component (LoginPage) can catch it
      throw error;
    }
    // No need to manually set user/session here, onAuthStateChange listener will handle it
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, login }}> {/* Added login to provider value */}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
