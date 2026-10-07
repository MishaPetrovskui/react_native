import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { todoColors } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  /** Біла кнопка (для використання на салатовій/рожевій панелі) */
  inverted?: boolean;
}

export function PrimaryButton({ label, onPress, loading = false, inverted = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.btn,
        inverted && styles.btnInverted,
        pressed && { opacity: 0.8 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={inverted ? todoColors.accent : todoColors.white} />
      ) : (
        <Text style={[styles.label, inverted && styles.labelInverted]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: todoColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnInverted: { backgroundColor: todoColors.white },
  label: { color: todoColors.white, fontSize: 12, letterSpacing: 1.2, fontWeight: '600' },
  labelInverted: { color: todoColors.accent },
});
