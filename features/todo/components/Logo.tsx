import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { todoColors } from '../theme';

export function Logo() {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.letters}>T O</Text>
        <Ionicons name="checkbox-outline" size={22} color={todoColors.accent} style={styles.check} />
      </View>
      <Text style={styles.letters}>D O</Text>
      <Text style={styles.letters}>L I S T</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center', alignItems: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  letters: {
    fontSize: 34,
    lineHeight: 54,
    letterSpacing: 10,
    fontWeight: '300',
    color: todoColors.accent,
  },
  check: { marginLeft: 6, marginTop: 10 },
});
