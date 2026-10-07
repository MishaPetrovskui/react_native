import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { todoColors } from '../theme';

interface Props {
  /** Показати стрілку "назад" замість назви застосунку */
  onBack?: () => void;
  /** Іконки справа */
  right?: React.ReactNode;
}

export function BrandHeader({ onBack, right }: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={todoColors.text} />
        </Pressable>
      ) : (
        <Text style={styles.brand}>TO DO LIST</Text>
      )}
      <View style={styles.right}>{right}</View>
    </View>
  );
}

export function HeaderIcon({
  name,
  onPress,
  color = todoColors.text,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Ionicons name={name} size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brand: { color: todoColors.accent, fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
