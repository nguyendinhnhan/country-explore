import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Colors } from '../constants/Colors';
import { ThemedText } from './ThemedText';

interface EmptyStateProps {
  title: string;
  message: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export default function EmptyState({
  title,
  message,
  iconName,
}: EmptyStateProps) {
  const background = useThemeColor({}, 'background');
  const messageColor = useThemeColor({}, 'icon');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Ionicons name={iconName} size={64} color={Colors.light.icon} />
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.message, { color: messageColor }]}>
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
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
  },
});
