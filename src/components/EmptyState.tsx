import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={64} color="#C7C7CC" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
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
    fontSize: 20,
    fontWeight: '600',
    color: '#3C3C43',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});
