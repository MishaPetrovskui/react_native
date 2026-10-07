import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from '@/features/todo/auth';
import { TasksProvider } from '@/features/todo/tasks';
import { todoColors } from '@/features/todo/theme';

function TodoNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator color={todoColors.accent} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: todoColors.white } }}>
      {/* Гість: тільки екрани авторизації */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>

      {/* Авторизований користувач */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" />
        <Stack.Screen name="form" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="[id]" />
      </Stack.Protected>
    </Stack>
  );
}

export default function TodoLayout() {
  return (
    <AuthProvider>
      <TasksProvider>
        <StatusBar style="dark" />
        <TodoNavigator />
      </TasksProvider>
    </AuthProvider>
  );
}
