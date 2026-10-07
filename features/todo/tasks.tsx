import * as Crypto from 'expo-crypto';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAuth } from './auth';
import { loadTodos, saveTodos } from './storage';
import type { Todo, TodoInput } from './types';

interface TasksContextValue {
  /** Задачі поточного акаунту, найновіші першими */
  todos: Todo[];
  ready: boolean;
  getTodo: (id: string) => Todo | undefined;
  addTodo: (input: TodoInput) => Promise<void>;
  updateTodo: (id: string, input: TodoInput) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [ready, setReady] = useState(false);
  const todosRef = useRef<Todo[]>([]);

  // Завантажуємо задачі саме цього акаунту (і очищаємо при виході / зміні акаунту)
  useEffect(() => {
    let cancelled = false;
    todosRef.current = [];
    setTodos([]);
    setReady(false);
    if (!userId) return;

    loadTodos(userId).then((loaded) => {
      if (cancelled) return;
      todosRef.current = loaded;
      setTodos(loaded);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const mutate = useCallback(
    async (fn: (prev: Todo[]) => Todo[]) => {
      if (!userId) return;
      const next = fn(todosRef.current);
      todosRef.current = next;
      setTodos(next);
      await saveTodos(userId, next);
    },
    [userId]
  );

  const addTodo = useCallback(
    (input: TodoInput) =>
      mutate((prev) => [
        {
          ...input,
          id: Crypto.randomUUID(),
          done: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]),
    [mutate]
  );

  const updateTodo = useCallback(
    (id: string, input: TodoInput) =>
      mutate((prev) => prev.map((t) => (t.id === id ? { ...t, ...input } : t))),
    [mutate]
  );

  const toggleDone = useCallback(
    (id: string) => mutate((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [mutate]
  );

  const deleteTodo = useCallback(
    (id: string) => mutate((prev) => prev.filter((t) => t.id !== id)),
    [mutate]
  );

  const getTodo = useCallback((id: string) => todos.find((t) => t.id === id), [todos]);

  const value = useMemo<TasksContextValue>(
    () => ({ todos, ready, getTodo, addTodo, updateTodo, toggleDone, deleteTodo }),
    [todos, ready, getTodo, addTodo, updateTodo, toggleDone, deleteTodo]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used inside <TasksProvider>');
  return ctx;
}
