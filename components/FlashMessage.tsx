import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface FlashMessageProps {
  message: string | null;
  duration?: number;
}

export const FlashMessage: React.FC<FlashMessageProps> = ({ message, duration = 3000 }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [message, duration]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFC0CB',
    padding: 10,
    zIndex: 999,
  },
  text: {
    color: '#D53F8C',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
