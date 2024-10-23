import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from '@/store/authStore';
import { router } from "expo-router";
import { FlashMessage } from "@/components/FlashMessage";

export const SignInForm = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const { signInWithEmail, isLoading, error } = useAuthStore();

  const handleSignIn = async () => {
    await signInWithEmail(email, password);
    if (error) {
      setFlashMessage("Invalid email and sign in");
    } else {
      router.replace("/(app)");
    }
  };

  const screenHeight = Dimensions.get('window').height;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={(Platform.OS === 'ios')}
      extraScrollHeight={20}
    >
      <View style={{ minHeight: screenHeight }} className="flex-1 justify-center px-4">
        <View className="bg-pink-200 rounded-lg p-4">
          <FlashMessage message={flashMessage} />
          <TouchableOpacity onPress={onBack} className="mt-3 mb-6 flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#D53F8C" />
            <ThemedText className="text-pink-600 font-semibold ml-2">Back</ThemedText>
          </TouchableOpacity>
          
          <ThemedText className="text-2xl font-bold mb-6 text-pink-800">Sign In</ThemedText>
          
          <TextInput
            className="h-12 border-2 border-pink-300 rounded-md mb-4 px-4 bg-white"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="h-12 border-2 border-pink-300 rounded-md mb-6 px-4 bg-white"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            className="bg-pink-500 p-4 rounded-full items-center mt-6"
            onPress={handleSignIn}
            disabled={isLoading}
            style={{
              shadowColor: "#FF1493",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 14.65,
              elevation: 8,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText className="text-white font-bold text-lg">
                Sign In
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
