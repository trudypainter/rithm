import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, ViewToken } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Make sure this path is correct
import { UserItem } from '@/components/UserItem'; // Import the new component

interface User {
  id: string;
  username: string;
  profilePicture: string;
}

export default function HomeScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      console.log(userList);
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-blue-50">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={users}
        renderItem={({ item }) => <UserItem user={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text className="text-lg text-center p-4">No users found</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
