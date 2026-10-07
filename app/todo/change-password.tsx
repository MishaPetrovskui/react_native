import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useAuth } from '@/features/todo/auth';
import { AppInput } from '@/features/todo/components/AppInput';
import { AuthLayout } from '@/features/todo/components/AuthLayout';
import { PrimaryButton } from '@/features/todo/components/PrimaryButton';
import { todoColors } from '@/features/todo/theme';

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const err = await changePassword(password);
    setLoading(false);
    if (err) setError(err);
    else router.back();
  };

  return (
    <AuthLayout onBack={() => router.back()}>
      <AppInput placeholder="New Password" value={password} onChangeText={setPassword} secure />
      <AppInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secure />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton label="CHANGE PASSWORD" onPress={onSubmit} loading={loading} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  error: { color: todoColors.error, fontSize: 12, marginBottom: 8 },
});
