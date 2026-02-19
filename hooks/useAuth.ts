'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Check if email is admin
const checkIsAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || '';
  return adminEmails.split(',').map(e => e.trim().toLowerCase()).includes(email.toLowerCase());
};

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAdminUser: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.email?.split('@')[0] || 'Admin',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);

      const result = await signInWithEmailAndPassword(auth, email, password);

      // Check if authorized admin
      if (!checkIsAdmin(result.user.email)) {
        await firebaseSignOut(auth);
        const errorMsg = 'This email is not authorized as admin.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      return { success: true };
    } catch (err: unknown) {
      console.error('Login error:', err);
      let errorMsg = 'Login failed. Please try again.';

      const firebaseError = err as { code?: string; message?: string };

      switch (firebaseError.code) {
        case 'auth/user-not-found':
          errorMsg = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMsg = 'Incorrect password.';
          break;
        case 'auth/invalid-credential':
          errorMsg = 'Invalid email or password.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Invalid email address format.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Too many attempts. Try again later.';
          break;
        case 'auth/network-request-failed':
          errorMsg = 'Network error. Check your connection.';
          break;
      }

      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }, []);

  return {
    user,
    loading,
    isAdminUser: checkIsAdmin(user?.email),
    signIn,
    signOut,
    error,
  };
}
