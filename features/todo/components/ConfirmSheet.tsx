import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { todoColors } from '../theme';

interface Props {
  visible: boolean;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Нижній "шит" з підтвердженням (макет "Delete TODO").
 * Працює однаково на iOS, Android і web — на відміну від Alert.alert.
 */
export function ConfirmSheet({ visible, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.sheet}>
          <Pressable style={styles.btn} onPress={onConfirm}>
            <Text style={styles.confirm}>{confirmLabel}</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: todoColors.overlay,
    justifyContent: 'flex-end',
    padding: 16,
  },
  sheet: { gap: 8 },
  btn: {
    height: 46,
    borderRadius: 10,
    backgroundColor: todoColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirm: { color: todoColors.error, fontSize: 15 },
  cancel: { color: '#3BAA5B', fontSize: 15 },
});
