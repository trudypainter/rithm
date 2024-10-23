import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuthStore } from "../../store/authStore";
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';

type SignInMethod = "email" | "email-signup" | null;

export default function SignIn() {
  const [signInMethod, setSignInMethod] = useState<SignInMethod>(null);

  const { error } = useAuthStore();

  const slideAnimation = React.useRef(new Animated.Value(0)).current;
  const fadeAnimation = React.useRef(new Animated.Value(0)).current;

  const handleMethodSelect = (method: SignInMethod) => {
    setSignInMethod(method);
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBack = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSignInMethod(null);
    });
  };

  const slideInterpolate = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <ThemedView className="flex-1 justify-center p-5 bg-pink-200">
      {signInMethod === null ? (
        <View className="items-center">
          <Image
            source={require('@/assets/images/rithmlogo.png')}
            style={{ width: '80%', aspectRatio: 1, resizeMode: 'contain' }}
          />
          <TouchableOpacity
            className="bg-pink-500 p-4 rounded-full my-3 w-full items-center"
            onPress={() => handleMethodSelect("email")}
            style={{
              shadowColor: "#FF1493",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 14.65,
              elevation: 8,
            }}
          >
            <ThemedText className="text-white font-bold">Sign in with Email</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-pink-400 p-4 rounded-full my-3 w-full items-center"
            onPress={() => handleMethodSelect("email-signup")}
            style={{
              shadowColor: "#FF1493",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 14.65,
              elevation: 8,
            }}
          >
            <ThemedText className="text-white font-bold">Sign up with Email</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View
          className="w-full"
          style={{ transform: [{ translateX: slideInterpolate }] }}
        >
          <Animated.View style={{ opacity: fadeAnimation }}>
            {signInMethod === "email" ? (
              <SignInForm onBack={handleBack} />
            ) : (
              <SignUpForm onBack={handleBack} />
            )}
          </Animated.View>
        </Animated.View>
      )}
    </ThemedView>
  );
}
