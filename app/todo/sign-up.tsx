import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/todo/auth';
import { AppInput } from '@/features/todo/components/AppInput';
import { AuthLayout } from '@/features/todo/components/AuthLayout';
import { PrimaryButton } from '@/features/todo/components/PrimaryButton';
import { todoColors } from '@/features/todo/theme';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
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
    const err = await signUp(email, fullName, password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <AuthLayout onBack={() => router.back()}>
      <AppInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
      />
      <AppInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />
      <AppInput placeholder="Password" value={password} onChangeText={setPassword} secure />
      <AppInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secure />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton label="SIGN UP" onPress={onSubmit} loading={loading} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Have an account? </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.footerText, styles.link]}>Log in</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  error: { color: todoColors.error, fontSize: 12, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  footerText: { fontSize: 11, color: todoColors.muted },
  link: { color: todoColors.accent },
});
