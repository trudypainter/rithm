import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Make sure to import your Firebase config

interface User {
  uid: string;
  email: string;
  username?: string;
  profileUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | undefined;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
  register: (email: string, password: string, username: string, profileUrl: string) => Promise<{ success: boolean; msg?: string; data?: User }>;
  logout: () => Promise<{ success: boolean; msg?: string }>;
  signup: (email: string, password: string, username: string) => Promise<{ success: boolean; msg?: string; data?: User }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be wrapped in an <AuthProvider />');
  }
  return value;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
        });
        updateUserData(firebaseUser.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const updateUserData = async (userId: string) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser((prevUser) => ({
        ...prevUser!,
        username: data.username,
        profileUrl: data.profileUrl,
      }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong credentials";
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e: any) {
      return { success: false, msg: e.message };
    }
  };

  const register = async (email: string, password: string, username: string, profileUrl: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", response.user.uid), {
        username,
        profileUrl,
        userId: response.user.uid,
      });
      return { 
        success: true, 
        data: { 
          uid: response.user.uid, 
          email: response.user.email!, 
          username, 
          profileUrl 
        } 
      };
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/email-already-in-use)")) msg = "This email is already in use";
      return { success: false, msg };
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", response.user.uid), {
        username,
        userId: response.user.uid,
      });
      return { 
        success: true, 
        data: { 
          uid: response.user.uid, 
          email: response.user.email!, 
          username,
        } 
      };
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/email-already-in-use)")) msg = "This email is already in use";
      return { success: false, msg };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
