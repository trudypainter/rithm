import React, { useState } from 'react';
import { TouchableOpacity, View, Modal, Text, SafeAreaView } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    setIsMenuVisible(false);
    router.replace('/(auth)/signin');
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false, // This will hide the header for all tab screens
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Feed',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: 'Matches',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      <Modal
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <SafeAreaView className="flex-1">
          <TouchableOpacity
            className="flex-1"
            onPress={() => setIsMenuVisible(false)}
          >
            <View className="flex-1 items-end">
              <View
                className="bg-white p-4 mt-12 mr-4 rounded-lg shadow-md"
              >
                <TouchableOpacity onPress={handleLogout} className="bg-white px-3 py-2 rounded">
                  <Text className={`text-${colorScheme === 'dark' ? 'black' : 'black'}`}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </>
  );
}
