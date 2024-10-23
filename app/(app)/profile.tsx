import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Platform, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode } from 'expo-av';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { app } from '@/firebaseConfig'; // Adjust this import based on your Firebase setup

export default function ProfileScreen() {
  const { signOut, user, updateUser } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    console.log('fetching user data', user, user?.uid);
    if (user && user.uid) {
      setIsLoading(true);
      const firestore = getFirestore(app);
      const userRef = doc(firestore, 'users', user.uid);
      try {
        const userDoc = await getDoc(userRef);
        console.log('userDoc', userDoc, userDoc.exists());
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('----userData', userData);
          setProfileImage(userData.profileImage || null);
          setVideoUri(userData.screenRecording || null);
          setVideoThumbnail(userData.screenRecordingThumbnail || null);
          console.log('Video URL:', userData.screenRecording);
          // Update the user store with the fetched data
          updateUser({
            ...user,
            profileImage: userData.profileImage,
            screenRecording: userData.screenRecording,
            screenRecordingThumbnail: userData.screenRecordingThumbnail,
            screenRecordingTimestamp: userData.screenRecordingTimestamp,
            screenRecordingFilename: userData.screenRecordingFilename,
          });
          console.log('----updated user', user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      await uploadVideoToFirebase(localUri);
    }
  };

  const uploadVideoToFirebase = async (localUri: string) => {
    setIsUploading(true);
    setUploadStatus('Preparing video for upload...');
    try {
      const storage = getStorage(app);
      const firestore = getFirestore(app);

      if (!user || !user.uid) {
        throw new Error('User not logged in');
      }

      setUploadStatus('Creating blob from video...');
      let blob;
      if (Platform.OS === 'web') {
        const response = await fetch(localUri);
        blob = await response.blob();
      } else {
        const response = await fetch(localUri);
        blob = await response.blob();
      }

      const timestamp = Date.now();
      const filename = `video_${timestamp}.mp4`;
      const storageRef = ref(storage, `screenRecordings/${user.uid}/${filename}`);
      
      setUploadStatus('Uploading video to Firebase...');
      const uploadTask = uploadBytesResumable(storageRef, blob, {
        contentType: 'video/mp4',
      });

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadStatus(`Uploading: ${progress.toFixed(2)}% done`);
        }, 
        (error) => {
          console.error('Upload error:', error);
          setUploadStatus('Error uploading video. Please try again.');
        }, 
        async () => {
          // Upload completed successfully, now we can get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          let thumbnailDownloadURL = null;

          if (Platform.OS !== 'web') {
            setUploadStatus('Generating video thumbnail...');
            const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(localUri, {
              time: 0,
            });

            setUploadStatus('Uploading thumbnail...');
            const thumbnailFilename = `thumbnail_${timestamp}.jpg`;
            const thumbnailStorageRef = ref(storage, `screenRecordingThumbnails/${user.uid}/${thumbnailFilename}`);
            const thumbnailBlob = await (await fetch(thumbnailUri)).blob();
            await uploadBytes(thumbnailStorageRef, thumbnailBlob, { contentType: 'image/jpeg' });
            thumbnailDownloadURL = await getDownloadURL(thumbnailStorageRef);
          }

          setUploadStatus('Updating user profile...');
          const userRef = doc(firestore, 'users', user.uid);
          const videoData = {
            screenRecording: downloadURL,
            screenRecordingThumbnail: thumbnailDownloadURL,
            screenRecordingTimestamp: Timestamp.now(),
            screenRecordingFilename: filename,
          };
          await setDoc(userRef, videoData, { merge: true });

          setVideoUri(downloadURL);
          setVideoThumbnail(thumbnailDownloadURL);
          updateUser({ ...user, ...videoData });

          setUploadStatus('Video uploaded successfully!');
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error('Error uploading video: ', error);
      setUploadStatus('Error uploading video. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        {/* 🔙 Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-4 right-4 z-10"
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold mb-4">Profile</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {/* 📸 Profile Image */}
            <TouchableOpacity onPress={pickImage} className="mb-4">
              {profileImage ? (
                <Image source={{ uri: profileImage }} className="w-24 h-24 rounded-full" />
              ) : (
                <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center">
                  <Ionicons name="camera" size={32} color="gray" />
                </View>
              )}
            </TouchableOpacity>
            
            {/* 📋 User Information */}
            <View className="mb-4">
              <Text className="text-lg font-semibold">Username: {user?.username}</Text>
              <Text className="text-lg">Email: {user?.email}</Text>
              <Text className="text-lg">User ID: {user?.uid || 'N/A'}</Text>
            </View>
            
            {/* 🎥 Video Upload Button */}
            <TouchableOpacity 
              onPress={pickVideo}
              className="bg-blue-500 px-4 py-2 rounded mb-4"
              disabled={isUploading}
            >
              <Text className="text-white text-center">
                {isUploading ? 'Uploading...' : 'Upload Screen Recording'}
              </Text>
            </TouchableOpacity>
            
            {/* ⏳ Upload Progress Indicator */}
            {isUploading && (
              <View className="mb-4">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="text-center mt-2">{uploadStatus}</Text>
              </View>
            )}
            
            {/* 🎞️ Video Preview */}
            {videoUri && !isUploading && (
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-2">Screen Recording:</Text>
                <Text className="text-sm mb-2">
                  Uploaded: {user?.screenRecordingTimestamp?.toDate().toLocaleString()}
                </Text>
                {Platform.OS === 'web' || !videoThumbnail ? (
                  <Video
                    source={{ uri: videoUri }}
                    style={{ width: '100%', height: 200 }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                  />
                ) : (
                  <TouchableOpacity onPress={() => {/* TODO: Implement video playback */}}>
                    <Image source={{ uri: videoThumbnail }} style={{ width: '100%', height: 200, resizeMode: 'cover' }} />
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="play-circle" size={48} color="white" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* 🔗 Video Link */}
            {videoUri && (
              <TouchableOpacity 
                onPress={() => {
                  if (Platform.OS === 'web') {
                    window.open(videoUri, '_blank');
                  } else {
                    // For mobile, you might want to use Linking.openURL(videoUri)
                    // Import Linking from 'react-native' if you use this approach
                    console.log('Video URL:', videoUri);
                  }
                }}
                className="mb-4"
              >
                <Text className="text-blue-500 underline">Open video in browser</Text>
              </TouchableOpacity>
            )}
            
            {/* 🚪 Logout Button */}
            <TouchableOpacity 
              onPress={handleLogout}
              className="bg-red-500 px-4 py-2 rounded"
            >
              <Text className="text-white text-center">Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
