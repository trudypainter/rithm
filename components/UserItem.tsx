import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  username: string;
  profileImage?: string;
  screenRecording?: string;
  screenRecordingThumbnail?: string;
  birthDate?: string;
}

interface UserItemProps {
  user: User;
}

export const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <View className="w-full flex flex-col bg-white shadow-md rounded-lg overflow-hidden my-2 border-8 border-pink-400">
      <View className="flex-1">
        {/* Video, Thumbnail, or No Video Message */}
        <View className="w-full aspect-video">
          {user.screenRecording ? (
            <Video
              source={{ uri: user.screenRecording }}
              style={{ width: '100%', height: '100%' }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={isPlaying}
            />
          ) : user.screenRecordingThumbnail ? (
            <TouchableOpacity onPress={togglePlayback} style={{ width: '100%', height: '100%' }}>
              <Image 
                source={{ uri: user.screenRecordingThumbnail }}
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={64} color="white" />
              </View>
            </TouchableOpacity>
          ) : (
            <View className="w-full h-full bg-pink-300 flex items-center justify-center p-4">
              <Text className="text-center text-lg font-bold text-white">
                Uh oh this user is a loser. No video rn :(
              </Text>
            </View>
          )}
        </View>

        {/* User Information */}
        <View className="flex-row items-center p-4">
          <View className="bg-gray-300 rounded-lg mr-4" style={{ height: 48, width: 48 }}> 
            <Image 
              source={user.profileImage ? { uri: user.profileImage } : require('../assets/images/icon.png')}  
              style={{ height: 48, width: 48, borderRadius: 24 }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold">
              {user.username}
              {user.birthDate && `, ${calculateAge(user.birthDate)}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
