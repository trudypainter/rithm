import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/signin');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-4 right-4 z-10"
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold mb-4">Profile</Text>
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
