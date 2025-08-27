import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Colors } from '../constants/Colors';
import { ThemedText } from './ThemedText';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingState({
  message = 'Loading...',
  size = 'large',
}: LoadingStateProps) {
  const messageColor = useThemeColor({}, 'icon');
  const messageStyle = size === 'small' ? styles.messageSmall : styles.message;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.primaryColor} />
      <ThemedText style={[messageStyle, { color: messageColor }]}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  messageSmall: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});
