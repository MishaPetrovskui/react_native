import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StoredUser, Todo } from './types';

const USERS_KEY = 'todo:users';
const SESSION_KEY = 'todo:session';
const tasksKey = (userId: string): string => `todo:tasks:${userId}`;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const loadUsers = (): Promise<StoredUser[]> => readJson<StoredUser[]>(USERS_KEY, []);
export const saveUsers = (users: StoredUser[]): Promise<void> => writeJson(USERS_KEY, users);

export const loadSession = (): Promise<string | null> => readJson<string | null>(SESSION_KEY, null);
export const saveSession = (userId: string | null): Promise<void> =>
  userId === null ? AsyncStorage.removeItem(SESSION_KEY) : writeJson(SESSION_KEY, userId);

/** Задачі зберігаються окремо для кожного акаунту. */
export const loadTodos = (userId: string): Promise<Todo[]> => readJson<Todo[]>(tasksKey(userId), []);
export const saveTodos = (userId: string, todos: Todo[]): Promise<void> =>
  writeJson(tasksKey(userId), todos);
