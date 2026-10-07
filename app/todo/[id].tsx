import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader, HeaderIcon } from '@/features/todo/components/BrandHeader';
import { ConfirmSheet } from '@/features/todo/components/ConfirmSheet';
import { Screen } from '@/features/todo/components/Screen';
import { formatCreated, formatDeadline } from '@/features/todo/date';
import { useTasks } from '@/features/todo/tasks';
import { todoColors } from '@/features/todo/theme';

export default function TodoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTodo, toggleDone, deleteTodo } = useTasks();
  const todo = getTodo(id);

  const [showDeadline, setShowDeadline] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);

  if (!todo) {
    return (
      <Screen>
        <BrandHeader onBack={() => router.back()} />
        <Text style={styles.notFound}>Task not found</Text>
      </Screen>
    );
  }

  const onDelete = async () => {
    setConfirmVisible(false);
    router.back();
    await deleteTodo(todo.id);
  };

  return (
    <Screen>
      <BrandHeader
        onBack={() => router.back()}
        right={
          <>
            <HeaderIcon name="time-outline" onPress={() => setShowDeadline((v) => !v)} />
            <HeaderIcon
              name="create-outline"
              onPress={() => router.push({ pathname: '/todo/form', params: { id: todo.id } })}
            />
            <HeaderIcon name="trash-outline" onPress={() => setConfirmVisible(true)} />
          </>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, todo.done && styles.strike]}>{todo.title}</Text>

        {showDeadline && (
          <View style={styles.deadlineRow}>
            <Ionicons name="time-outline" size={14} color={todoColors.accent} />
            <Text style={styles.deadlineText}>
              {todo.deadline ? `Deadline: ${formatDeadline(todo.deadline)}` : 'No deadline set'}
            </Text>
          </View>
        )}

        {todo.description ? <Text style={styles.description}>{todo.description}</Text> : null}

        {todo.imageUri ? (
          <Image source={{ uri: todo.imageUri }} style={styles.image} contentFit="cover" />
        ) : null}

        <Pressable style={styles.doneBtn} onPress={() => toggleDone(todo.id)}>
          <Ionicons
            name={todo.done ? 'checkmark-circle' : 'ellipse-outline'}
            size={18}
            color={todoColors.accent}
          />
          <Text style={styles.doneText}>{todo.done ? 'Done' : 'Mark as done'}</Text>
        </Pressable>
      </ScrollView>

      <Text style={styles.created}>Created at {formatCreated(todo.createdAt)}</Text>

      <ConfirmSheet
        visible={confirmVisible}
        confirmLabel="Delete TODO"
        onConfirm={onDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  title: { fontSize: 18, fontWeight: '700', textTransform: 'uppercase', color: todoColors.text },
  strike: { textDecorationLine: 'line-through', color: todoColors.muted },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  deadlineText: { fontSize: 12, color: todoColors.accent },
  description: { fontSize: 13, color: todoColors.text, marginTop: 14, lineHeight: 19 },
  image: { width: '100%', height: 220, borderRadius: 10, marginTop: 16 },
  doneBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  doneText: { fontSize: 13, color: todoColors.accent },
  created: { textAlign: 'center', fontSize: 10, color: todoColors.muted, paddingVertical: 10 },
  notFound: { textAlign: 'center', marginTop: 48, color: todoColors.muted },
});
