'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define a shape for our user object based on what /api/auth/user returns
interface AppUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  // Add other fields your app uses
}

interface AuthCredentials {
  email?: string;
  username?: string; // Allow login/signup with username or email
  password?: string;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean; // Changed from Supabase session/user presence
  isLoading: boolean; // Renamed from 'loading' for clarity
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (details: AuthCredentials) => Promise<void>; // Added signup method
  signOut: () => Promise<void>;
  // Add refetchUser or similar if needed to manually refresh auth state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // useEffect for initial auth check and potentially for re-validating session
  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/user');
        const data = await response.json();

        if (response.ok && data.isLoggedIn && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          // Optionally handle data.message if present for specific logout reasons
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []); // Runs on mount

  // Function to refresh user session data, can be called after login/signup
  const refreshUserSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/user');
      const data = await response.json();
      if (response.ok && data.isLoggedIn && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to refresh user session:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      await refreshUserSession(); // Refresh session data to get user info
      // router.push('/dashboard'); // Optional: redirect after login
    } catch (error: any) {
      console.error('Login error in AuthProvider:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Re-throw to be caught by the calling component (e.g., LoginPage)
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (details: AuthCredentials) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      await refreshUserSession(); // Signup API already logs in, so refresh session
      // router.push('/dashboard'); // Optional: redirect after signup
    } catch (error: any) {
      console.error('Signup error in AuthProvider:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Re-throw
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error: any) {
      console.error('SignOut error in AuthProvider:', error);
      // Decide if you need to throw here or just log
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, signOut }}>
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
