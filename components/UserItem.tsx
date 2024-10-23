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
}

interface UserItemProps {
  user: User;
}

export const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View className="w-full flex flex-col bg-white shadow-md rounded-lg overflow-hidden my-2">
      <View className="flex-1">
        <View className="flex-row items-center p-4">
          <View className="bg-gray-300 rounded-lg mr-4" 
            style={{ height: 48, width: 48 }}
          > 
            <Image 
              source={user.profileImage ? { uri: user.profileImage } : require('../assets/images/icon.png')}  
              style={{ height: 48, width: 48, borderRadius: 24 }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold">{user.username}</Text>
          </View>
        </View>
        <View className="flex-row justify-center h-[80vh] bg-gray-100 w-full items-center">
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
            <Text>No video available</Text>
          )}
        </View>
      </View>
    </View>
  );
};
