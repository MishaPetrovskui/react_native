import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useAuth } from '@/features/todo/auth';
import { AppInput } from '@/features/todo/components/AppInput';
import { AuthLayout } from '@/features/todo/components/AuthLayout';
import { PrimaryButton } from '@/features/todo/components/PrimaryButton';
import { todoColors } from '@/features/todo/theme';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const err = await resetPassword(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setDone(true);
    setTimeout(() => router.back(), 1200);
  };

  return (
    <AuthLayout onBack={() => router.back()}>
      {/* Email потрібен, щоб знайти акаунт у локальному сховищі */}
      <AppInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
      />
      <AppInput placeholder="Password" value={password} onChangeText={setPassword} secure />
      <AppInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secure />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {done ? <Text style={styles.success}>Password changed. You can sign in now.</Text> : null}

      <PrimaryButton label="CHANGE PASSWORD" onPress={onSubmit} loading={loading} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  error: { color: todoColors.error, fontSize: 12, marginBottom: 8 },
  success: { color: '#3BAA5B', fontSize: 12, marginBottom: 8 },
});
