import React from 'react';
import { View, Text, Image } from 'react-native';

interface User {
  id: string;
  username: string;
  profileImage?: string;  // Changed from profilePicture to profileImage
}

interface UserItemProps {
  user: User;
}

export const UserItem: React.FC<UserItemProps> = ({ user }) => {
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
          <Text>video will go here</Text>
        </View>
      </View>
    </View>
  );
};
