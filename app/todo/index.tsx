import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandHeader, HeaderIcon } from '@/features/todo/components/BrandHeader';
import { Screen } from '@/features/todo/components/Screen';
import { formatCreated } from '@/features/todo/date';
import { useTasks } from '@/features/todo/tasks';
import { todoColors } from '@/features/todo/theme';
import type { Todo } from '@/features/todo/types';

type Filter = 'all' | 'active' | 'done';
const NEXT_FILTER: Record<Filter, Filter> = { all: 'active', active: 'done', done: 'all' };
const FILTER_LABEL: Record<Filter, string> = { all: 'All', active: 'Active', done: 'Done' };

export default function HomeScreen() {
  const { todos, ready } = useTasks();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () =>
      todos.filter((t) => (filter === 'all' ? true : filter === 'done' ? t.done : !t.done)),
    [todos, filter]
  );

  const renderItem = ({ item, index }: { item: Todo; index: number }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/todo/[id]', params: { id: item.id } })}
      style={[
        styles.card,
        { backgroundColor: index % 2 === 0 ? todoColors.cardRed : todoColors.cardSalmon },
        item.done && styles.cardDone,
      ]}
    >
      <View style={styles.cardTop}>
        <Text style={[styles.cardTitle, item.done && styles.strike]} numberOfLines={1}>
          {item.title}
        </Text>
        {item.deadline ? <Ionicons name="time-outline" size={14} color="#fff" /> : null}
      </View>
      {item.description ? (
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}
      <Text style={styles.cardDate}>Created at {formatCreated(item.createdAt)}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <BrandHeader
        right={<HeaderIcon name="settings-outline" onPress={() => router.push('/todo/profile')} />}
      />

      <View style={styles.listHeader}>
        <View style={styles.listTitleRow}>
          <Ionicons name="list" size={22} color={todoColors.accent} />
          <Text style={styles.listTitle}>LIST OF TODO</Text>
        </View>
        <Pressable style={styles.filter} onPress={() => setFilter(NEXT_FILTER[filter])} hitSlop={10}>
          <Text style={styles.filterLabel}>{FILTER_LABEL[filter]}</Text>
          <Ionicons name="funnel-outline" size={18} color={todoColors.accent} />
        </Pressable>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          ready ? (
            <Text style={styles.empty}>
              {todos.length === 0 ? 'No tasks yet. Tap + to add your first one.' : 'Nothing here.'}
            </Text>
          ) : null
        }
      />

      <Pressable style={styles.fab} onPress={() => router.push('/todo/form')}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  listTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  listTitle: { fontSize: 20, fontWeight: '700', color: todoColors.accent, letterSpacing: 0.5 },
  filter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterLabel: { fontSize: 12, color: todoColors.accent },
  listContent: { paddingHorizontal: 20, paddingBottom: 100, gap: 12 },
  card: { borderRadius: 10, padding: 14, minHeight: 90 },
  cardDone: { opacity: 0.6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 14, flex: 1, marginRight: 8 },
  strike: { textDecorationLine: 'line-through' },
  cardDesc: { color: '#fff', fontSize: 12, marginTop: 6 },
  cardDate: { color: '#fff', fontSize: 9, marginTop: 10, opacity: 0.9 },
  empty: { textAlign: 'center', color: todoColors.muted, marginTop: 48, fontSize: 14 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: todoColors.cardRed,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
