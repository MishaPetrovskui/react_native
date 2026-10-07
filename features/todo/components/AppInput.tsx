import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { todoColors } from '../theme';

interface Props extends TextInputProps {
  /** Поле пароля з іконкою "показати / сховати" */
  secure?: boolean;
}

export function AppInput({ secure = false, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.box}>
      <TextInput
        placeholderTextColor={todoColors.muted}
        autoCapitalize="none"
        {...rest}
        secureTextEntry={secure && hidden}
        style={[styles.input, style]}
      />
      {secure && (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} style={styles.eye}>
          <Ionicons
            name={hidden ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={todoColors.muted}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: todoColors.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: todoColors.white,
  },
  input: { flex: 1, height: 42, fontSize: 14, color: todoColors.text },
  eye: { paddingLeft: 8 },
});
