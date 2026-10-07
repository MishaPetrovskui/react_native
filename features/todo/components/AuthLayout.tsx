import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { BrandHeader } from './BrandHeader';
import { Logo } from './Logo';
import { Screen } from './Screen';

/** Спільна розмітка екранів входу / реєстрації / відновлення пароля. */
export function AuthLayout({
  children,
  onBack,
}: {
  children: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <Screen>
      {onBack ? <BrandHeader onBack={onBack} /> : null}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logo}>
            <Logo />
          </View>
          <View style={styles.form}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24 },
  logo: { flex: 1, justifyContent: 'center', paddingVertical: 32 },
  form: { width: '100%' },
});
