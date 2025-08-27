import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Colors } from '../constants/Colors';
import { ThemedText } from './ThemedText';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const messageColor = useThemeColor({}, 'icon');

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
      <ThemedText type="subtitle" style={[styles.title]}>
        Oops! Something went wrong
      </ThemedText>
      <ThemedText style={[styles.message, { color: messageColor }]}>
        {message}
      </ThemedText>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <ThemedText type="defaultSemiBold" style={styles.retryText}>
            Try Again
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
  },
});
