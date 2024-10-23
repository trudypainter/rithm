import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuthStore } from '@/store/authStore';
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import { FlashMessage } from "@/components/FlashMessage";
import { router } from "expo-router";
import { Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// DatePickerDropdown component
const DatePickerButton = ({ date, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="h-12 border-2 border-pink-300 rounded-md mb-4 px-4 bg-white justify-center">
      <Text>{date.toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
};

export const SignUpForm = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { signUpWithEmail, isLoading, error } = useAuthStore();

  const validateForm = () => {
    if (!email || !password || !firstName) {
      setFlashMessage("Please fill out all fields");
      return false;
    }
    if (password.length < 6) {
      setFlashMessage("Password must be at least 6 characters long");
      return false;
    }
    // You can add more validation rules here if needed
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    await signUpWithEmail(email, password, firstName, birthDate.toISOString());
    if (error) {
      setFlashMessage("Invalid email and sign up");
    } else {
      router.replace("/(app)");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
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
            <Text className="text-pink-600 font-semibold ml-2">Back</Text>
          </TouchableOpacity>
          
          <Text className="text-2xl font-bold mb-6 text-pink-800">Sign Up</Text>
          
          <Text className="text-lg font-semibold mb-2 text-pink-700">Account</Text>
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

          <Text className="text-lg font-semibold mb-2 text-pink-700">Personal</Text>
          <TextInput
            className="h-12 border-2 border-pink-300 rounded-md mb-4 px-4 bg-white"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text className="mb-2 text-pink-700">Birth Date:</Text>
          <DatePickerButton
            date={birthDate}
            onPress={() => setShowDatePicker(true)}
          />

          {showDatePicker && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View className="flex-1 justify-end bg-black bg-opacity-50">
                <View className="bg-white p-4">
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                  />
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    className="bg-pink-500 p-2 rounded-full mt-4"
                  >
                    <Text className="text-white text-center">Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
          
          <TouchableOpacity
            className="bg-pink-500 p-4 rounded-full items-center mt-6"
            onPress={handleSignUp}
            disabled={isLoading}
            style={{
              shadowColor: "#FF1493",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.5,
              shadowRadius: 14.65,
              elevation: 8,
            }}
          >
            <Text className="text-white font-bold text-lg">
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
         
          {error && <Text className="text-red-500 mt-4 text-center">{error}</Text>}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
