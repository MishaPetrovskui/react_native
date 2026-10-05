import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type MoodId = 'sad' | 'meh' | 'neutral' | 'good' | 'happy';

interface Mood {
  id: MoodId;
  emoji: string;
  bg: string;
}

interface Entry {
  id: string;
  moodId: MoodId;
  date: string;
}

interface TopMood {
  mood: Mood;
  count: number;
}

const MOODS: Mood[] = [
  { id: 'sad', emoji: '😢', bg: '#FAD4D8' },
  { id: 'meh', emoji: '😕', bg: '#FAE0B0' },
  { id: 'neutral', emoji: '😐', bg: '#D3E4FA' },
  { id: 'good', emoji: '🙂', bg: '#CFEBCF' },
  { id: 'happy', emoji: '😄', bg: '#C2E8C2' },
];

const moodById = (id: MoodId): Mood => MOODS.find((m) => m.id === id) as Mood;

const pad = (n: number): string => String(n).padStart(2, '0');

const formatDate = (iso: string): { day: string; time: string } => {
  const d = new Date(iso);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  const startOfDay = (x: Date): number =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86400000);

  let day: string;
  if (diffDays === 0) day = 'Сьогодні';
  else if (diffDays === 1) day = 'Вчора';
  else if (diffDays === 2) day = 'Позавчора';
  else day = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

  return { day, time };
};

export default function Tracker(): React.JSX.Element {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selected, setSelected] = useState<MoodId | null>(null);

  const addEntry = (mood: Mood): void => {
    setSelected(mood.id);
    const entry: Entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      moodId: mood.id,
      date: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
  };

  const confirmDelete = (entry: Entry): void => {
    Alert.alert('Видалити запис?', 'Цю дію неможливо скасувати.', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => setEntries((prev) => prev.filter((e) => e.id !== entry.id)),
      },
    ]);
  };

  const confirmClearAll = (): void => {
    if (entries.length === 0) {
      Alert.alert('Історія порожня', 'Немає що очищати.');
      return;
    }
    Alert.alert('Очистити всю історію?', 'Усі записи буде видалено безповоротно.', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Очистити', style: 'destructive', onPress: () => setEntries([]) },
    ]);
  };

  const topMood = useMemo<TopMood | null>(() => {
    if (entries.length === 0) return null;
    const counts: Partial<Record<MoodId, number>> = {};
    entries.forEach((e) => {
      counts[e.moodId] = (counts[e.moodId] ?? 0) + 1;
    });
    let topId: MoodId = entries[0].moodId;
    (Object.keys(counts) as MoodId[]).forEach((id) => {
      if ((counts[id] ?? 0) > (counts[topId] ?? 0)) topId = id;
    });
    return { mood: moodById(topId), count: counts[topId] ?? 0 };
  }, [entries]);

  const renderItem: ListRenderItem<Entry> = ({ item }) => {
    const mood = moodById(item.moodId);
    const { day, time } = formatDate(item.date);
    return (
      <Pressable
        onPress={() => confirmDelete(item)}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        <View style={[styles.avatar, { backgroundColor: mood.bg }]}>
          <Text style={styles.avatarEmoji}>{mood.emoji}</Text>
        </View>
        <Text style={styles.rowText}>
          {day}, <Text style={styles.rowTime}>{time}</Text>
        </Text>
        <Text style={styles.trash}>🗑</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Трекер настрою</Text>
        <Text style={styles.subtitle}>Як ти почуваєшся сьогодні?</Text>

        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => addEntry(m)}
              style={({ pressed }) => [
                styles.moodBtn,
                { backgroundColor: m.bg },
                selected === m.id && styles.moodBtnSelected,
                pressed && { transform: [{ scale: 0.92 }] },
              ]}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Історія</Text>
          <Text style={styles.summary}>
            найчастіше: {topMood ? `${topMood.mood.emoji} (${topMood.count})` : '—'}
          </Text>
        </View>

        <FlatList<Entry>
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.empty}>Поки що немає записів. Обери свій настрій вище 👆</Text>
          }
        />

        <Pressable
          onPress={confirmClearAll}
          style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.clearText}>Очистити всю історію</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, paddingHorizontal: 18, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#111', marginTop: 16 },
  subtitle: { fontSize: 15, color: '#666', marginTop: 4 },

  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 12,
    marginTop: 18,
  },
  moodBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodBtnSelected: { borderColor: '#6FA3E8' },
  moodEmoji: { fontSize: 26 },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  historyTitle: { fontSize: 16, fontWeight: '600', color: '#555' },
  summary: { fontSize: 14, color: '#666' },

  list: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowPressed: { backgroundColor: '#F3F4F6' },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 20 },
  rowText: { flex: 1, marginLeft: 14, fontSize: 16, color: '#222' },
  rowTime: { fontWeight: '700' },
  trash: { fontSize: 18, opacity: 0.5 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#e3e3e3' },
  empty: { textAlign: 'center', color: '#888', marginTop: 32, fontSize: 15 },

  clearBtn: {
    borderWidth: 1,
    borderColor: '#E8A0A5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  clearText: { color: '#A12A33', fontSize: 16 },
});