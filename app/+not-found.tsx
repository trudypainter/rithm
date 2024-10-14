import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text  className="text-2xl font-bold mb-4">This screen doesn't exist.</Text>
        <Link href="/" className="mt-2">
          Go to home screen!
        </Link>
      </View>
    </>
  );
}
