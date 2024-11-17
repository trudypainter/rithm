import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Platform } from "react-native";

type User = {
  uid: string;
  firstName: string;
  email: string;
  profileImage?: string;
  screenRecording?: string;
  screenRecordingThumbnail?: string;
  birthDate?: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    firstName: string,
    birthDate: string
  ) => Promise<void>;
  updateUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const userDoc = await doc(db, "users", userCredential.user.uid);
          const userSnapshot = await getDoc(userDoc);
          const userData = userSnapshot.data();

          if (!userData) {
            throw new Error("User data not found");
          }

          set({
            user: {
              uid: userCredential.user.uid,
              email: userCredential.user.email!,
              firstName: userData.firstName,
              birthDate: userData.birthDate,
              profileImage: userData.profileImage,
              screenRecording: userData.screenRecording,
              screenRecordingThumbnail: userData.screenRecordingThumbnail,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await firebaseSignOut(auth);
          set({ user: null, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      signUpWithEmail: async (
        email: string,
        password: string,
        firstName: string,
        birthDate: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await setDoc(doc(db, "users", userCredential.user.uid), {
            firstName,
            userId: userCredential.user.uid,
            birthDate,
            email,
          });

          set({
            user: {
              uid: userCredential.user.uid,
              email: userCredential.user.email!,
              firstName,
              birthDate,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: Platform.OS === "web" ? false : true,
    }
  )
);
