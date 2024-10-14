import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';

type SignInMethod = 'email' | 'phone' | null;

export default function SignIn() {
  const [signInMethod, setSignInMethod] = useState<SignInMethod>(null);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
  const { signInWithEmail, isLoading, error } = useAuthStore();

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
      setEmail('');
      setPhoneNumber('');
      setPassword('');
    });
  };

  const handleLogin = async () => {
    if (signInMethod === 'email') {
      await signInWithEmail(email, password);
      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Invalid email and sign in',
          position: 'bottom',
          visibilityTime: 3000,
        });
      } else {
        router.replace('/(app)');
      }
    } else {
      // Implement phone number login logic here
      console.log('Phone number login not implemented yet');
    }
  };

  const slideInterpolate = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  return (
    <ThemedView className="flex-1 justify-center p-5">
      {signInMethod === null ? (
        <View className="items-center">
          <ThemedText className="text-2xl font-bold mb-5">Sign In</ThemedText>
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-md my-2 w-full items-center"
            onPress={() => handleMethodSelect('email')}
          >
            <ThemedText className="text-white">Sign in with Email</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-md my-2 w-full items-center"
            onPress={() => handleMethodSelect('phone')}
          >
            <ThemedText className="text-white">Sign in with Phone Number</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View
          className="w-full"
          style={{ transform: [{ translateX: slideInterpolate }] }}
        >
          <Animated.View style={{ opacity: fadeAnimation }}>
            <TouchableOpacity
              className="absolute left-0 top-0 p-2 z-10"
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          </Animated.View>
          <ThemedText className="text-2xl font-bold mb-5 mt-10">
            Sign In with {signInMethod === 'email' ? 'Email' : 'Phone Number'}
          </ThemedText>
          {signInMethod === 'email' ? (
            <TextInput
              className="h-10 border border-gray-300 rounded-md mb-3 px-3"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <TextInput
              className="h-10 border border-gray-300 rounded-md mb-3 px-3"
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          )}
          <TextInput
            className="h-10 border border-gray-300 rounded-md mb-3 px-3"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-md items-center mt-3"
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText className="text-white font-bold">Sign In</ThemedText>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
      <Toast />
    </ThemedView>
  );
}
