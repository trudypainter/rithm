import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";

export default function LottieLoader({ size, source }) {
  return (
    <View style={{ height: size, aspectRatio: 1 }}>
      <LottieView style={{ flex: 1 }} source={source} autoPlay loop />
    </View>
  );
}
