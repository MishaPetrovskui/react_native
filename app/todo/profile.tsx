import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/todo/auth';
import { BrandHeader } from '@/features/todo/components/BrandHeader';
import { ConfirmSheet } from '@/features/todo/components/ConfirmSheet';
import { PrimaryButton } from '@/features/todo/components/PrimaryButton';
import { Screen } from '@/features/todo/components/Screen';
import { todoColors } from '@/features/todo/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <Screen>
      <BrandHeader onBack={() => router.back()} />

      <View style={styles.illustration}>
        <View style={styles.circle}>
          <Ionicons name="clipboard-outline" size={96} color={todoColors.accent} />
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user?.fullName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Password</Text>
          <Pressable onPress={() => router.push('/todo/change-password')}>
            <Text style={styles.value}>Change Password</Text>
          </Pressable>
        </View>

        <View style={styles.logout}>
          <PrimaryButton label="LOG OUT" onPress={() => setConfirmVisible(true)} />
        </View>
      </View>

      <ConfirmSheet
        visible={confirmVisible}
        confirmLabel="Log out"
        onConfirm={() => {
          setConfirmVisible(false);
          signOut();
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  illustration: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FDEBE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { paddingHorizontal: 24, paddingBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  label: { fontSize: 12, color: todoColors.text },
  value: { fontSize: 12, color: todoColors.accent },
  logout: { marginTop: 12 },
});
