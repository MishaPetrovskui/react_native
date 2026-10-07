import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { todoColors } from '@/features/todo/theme';

/** Вкладка-вхід у застосунок "To-do list" (він живе у власному стеку app/todo). */
export default function TodoTab() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">To Do List</ThemedText>
      <ThemedText style={styles.text}>Tasks with sign in and local storage</ThemedText>
      <Pressable style={styles.btn} onPress={() => router.push('/todo')}>
        <ThemedText style={styles.btnText}>Open</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  text: { textAlign: 'center' },
  btn: {
    backgroundColor: todoColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
