import { useEffect } from "react";
import { Slot, useSegments, useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import Toast from 'react-native-toast-message';

// Import your global CSS file
import "../global.css";

const MainLayout = () => {
  const { user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inApp = segments[0] === "(app)";
    if (user && !inApp) {
      router.replace("/(app)");
    } else if (!user && inApp) {
      router.replace("/(auth)/signin");
    }
  }, [user, segments, router]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <>
      <MainLayout />
      <Toast />
    </>
  );
}
