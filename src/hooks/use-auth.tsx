
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  sendPasswordResetEmail,
  getRedirectResult,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface SignUpData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signUpWithEmail: (data: SignUpData) => Promise<{ error: any | null }>;
  signInWithEmail: (email: string, password: string) => Promise<any | null>;
  signInWithGoogle: () => Promise<any | null>;
  sendPasswordReset: (email: string) => Promise<any | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUser = useCallback(async (rawUser: User | null) => {
    if (rawUser) {
      const userDocRef = doc(db, 'users', rawUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUser({ ...rawUser, ...userDoc.data() });
      } else {
        // This case handles Google Sign-In for new users
        const userData = {
          email: rawUser.email,
          displayName: rawUser.displayName,
          photoURL: rawUser.photoURL,
          createdAt: serverTimestamp(),
          channels: [],
        };
        await setDoc(userDocRef, userData, { merge: true });
        setUser({ ...rawUser, ...userData });
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [handleUser]);
  
  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
        console.error("Error from redirect", error);
    });
  }, []);

  const signUpWithEmail = useCallback(async (data: SignUpData) => {
    const { email, password, firstName, lastName, phone } = data;
    try {
      if (!password) throw new Error("Password is required for sign up.");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: `${firstName} ${lastName}`,
      });
      // Store additional user info in Firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email,
        displayName: `${firstName} ${lastName}`,
        phone: phone || '',
        createdAt: serverTimestamp(),
        channels: [],
      });
      setUser(res.user);
      return { error: null };
    } catch (error) {
      console.error('Sign Up Error:', error);
      return { error };
    }
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error) {
      console.error('Sign In Error:', error);
      return error;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Using signInWithRedirect is more robust for all browser environments
      await signInWithRedirect(auth, provider);
      return null;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      return error;
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return null;
    } catch (error) {
      console.error('Password Reset Error:', error);
      return error;
    }
  }, []);


  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      signOut,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      sendPasswordReset,
    }),
    [user, loading, signOut, signUpWithEmail, signInWithEmail, signInWithGoogle, sendPasswordReset]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
