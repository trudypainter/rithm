import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Platform } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from '@/firebaseConfig'; // Adjust this import based on your Firebase setup

export default function ProfileScreen() {
  const { signOut, user, updateUser } = useAuthStore();
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/signin');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      await uploadImageToFirebase(localUri);
    }
  };

  const uploadImageToFirebase = async (localUri: string) => {
    try {
      const storage = getStorage(app);
      const firestore = getFirestore(app);

      // Ensure user is logged in
      if (!user || !user.uid) {
        throw new Error('User not logged in');
      }

      let blob;
      if (Platform.OS === 'web') {
        const response = await fetch(localUri);
        blob = await response.blob();
      } else {
        const response = await fetch(localUri);
        blob = await response.blob();
      }

      const filename = localUri.substring(localUri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `profileImages/${user.uid}/${filename}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      // Reference to the user document
      const userRef = doc(firestore, 'users', user.uid);

      // Check if the document exists
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Update existing document
        await setDoc(userRef, { profileImage: downloadURL }, { merge: true });
      } else {
        // Create new document
        await setDoc(userRef, {
          username: user.username,
          email: user.email,
          profileImage: downloadURL,
          // Add any other fields you want to store
        });
      }

      setProfileImage(downloadURL);
      updateUser({ ...user, profileImage: downloadURL });

    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  const uploadScreenRecording = () => {
    // TODO: Implement screen recording upload functionality
    console.log('Upload screen recording');
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
        
        <TouchableOpacity onPress={pickImage} className="mb-4">
          {profileImage ? (
            <Image source={{ uri: profileImage }} className="w-24 h-24 rounded-full" />
          ) : (
            <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center">
              <Ionicons name="camera" size={32} color="gray" />
            </View>
          )}
        </TouchableOpacity>
        
        <View className="mb-4">
          <Text className="text-lg font-semibold">Username: {user?.username}</Text>
          <Text className="text-lg">Email: {user?.email}</Text>
          <Text className="text-lg">Joined: {user?.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}</Text>
          <Text className="text-lg">User ID: {user?.uid || 'N/A'}</Text>
        </View>
        
        <TouchableOpacity 
          onPress={uploadScreenRecording}
          className="bg-blue-500 px-4 py-2 rounded mb-4"
        >
          <Text className="text-white text-center">Upload Screen Recording</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          <Text className="text-white text-center">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
