import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/todo/auth';
import { AppInput } from '@/features/todo/components/AppInput';
import { AuthLayout } from '@/features/todo/components/AuthLayout';
import { PrimaryButton } from '@/features/todo/components/PrimaryButton';
import { todoColors } from '@/features/todo/theme';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Enter email and password');
      return;
    }
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    // При успіху Stack.Protected сам перенаправить на головний екран
    if (err) setError(err);
  };

  return (
    <AuthLayout>
      <AppInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
      />
      <AppInput placeholder="Password" value={password} onChangeText={setPassword} secure />

      <Pressable style={styles.forgot} onPress={() => router.push('/todo/forgot-password')}>
        <Text style={styles.small}>Forgot Password?</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton label="SIGN IN" onPress={onSubmit} loading={loading} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Pressable onPress={() => router.push('/todo/sign-up')}>
          <Text style={[styles.footerText, styles.link]}>Sign up</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', marginBottom: 12 },
  small: { fontSize: 11, color: todoColors.accent },
  error: { color: todoColors.error, fontSize: 12, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  footerText: { fontSize: 11, color: todoColors.muted },
  link: { color: todoColors.accent },
});
