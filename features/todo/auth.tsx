import * as Crypto from 'expo-crypto';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loadSession, loadUsers, saveSession, saveUsers } from './storage';
import type { StoredUser, User } from './types';

/** Усі дії повертають текст помилки або null, якщо все пройшло успішно. */
type AuthResult = Promise<string | null>;

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => AuthResult;
  signUp: (email: string, fullName: string, password: string) => AuthResult;
  resetPassword: (email: string, newPassword: string) => AuthResult;
  changePassword: (newPassword: string) => AuthResult;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 6;

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const hashPassword = (password: string, salt: string): Promise<string> =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);

const toPublic = (u: StoredUser): User => ({ id: u.id, email: u.email, fullName: u.fullName });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Відновлення сесії при запуску
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [sessionId, users] = await Promise.all([loadSession(), loadUsers()]);
      const found = users.find((u) => u.id === sessionId);
      if (!cancelled) {
        setUser(found ? toPublic(found) : null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const users = await loadUsers();
    const found = users.find((u) => u.email === normalizeEmail(email));
    if (!found) return 'Account with this email was not found';
    const hash = await hashPassword(password, found.salt);
    if (hash !== found.passwordHash) return 'Wrong password';
    await saveSession(found.id);
    setUser(toPublic(found));
    return null;
  }, []);

  const signUp = useCallback(async (email: string, fullName: string, password: string) => {
    const normalized = normalizeEmail(email);
    if (!EMAIL_RE.test(normalized)) return 'Enter a valid email';
    if (fullName.trim().length === 0) return 'Enter your full name';
    if (password.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters`;

    const users = await loadUsers();
    if (users.some((u) => u.email === normalized)) return 'Account with this email already exists';

    const salt = Crypto.randomUUID();
    const created: StoredUser = {
      id: Crypto.randomUUID(),
      email: normalized,
      fullName: fullName.trim(),
      salt,
      passwordHash: await hashPassword(password, salt),
    };
    await saveUsers([...users, created]);
    await saveSession(created.id);
    setUser(toPublic(created));
    return null;
  }, []);

  const updatePassword = useCallback(async (userId: string, newPassword: string) => {
    if (newPassword.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters`;
    const users = await loadUsers();
    const found = users.find((u) => u.id === userId);
    if (!found) return 'Account was not found';
    const salt = Crypto.randomUUID();
    const updated: StoredUser = { ...found, salt, passwordHash: await hashPassword(newPassword, salt) };
    await saveUsers(users.map((u) => (u.id === userId ? updated : u)));
    return null;
  }, []);

  const resetPassword = useCallback(
    async (email: string, newPassword: string) => {
      const users = await loadUsers();
      const found = users.find((u) => u.email === normalizeEmail(email));
      if (!found) return 'Account with this email was not found';
      return updatePassword(found.id, newPassword);
    },
    [updatePassword]
  );

  const changePassword = useCallback(
    async (newPassword: string) => {
      if (!user) return 'You are not signed in';
      return updatePassword(user.id, newPassword);
    },
    [user, updatePassword]
  );

  const signOut = useCallback(async () => {
    await saveSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signUp, resetPassword, changePassword, signOut }),
    [user, loading, signIn, signUp, resetPassword, changePassword, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
