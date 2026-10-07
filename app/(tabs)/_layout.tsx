import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="page"
        options={{
          title: 'Page',
          tabBarIcon: ({ color }) => <Foundation name="page-csv" size={28} color="white" />,
        }}
      />
      <Tabs.Screen
        name="formulas"
        options={{
          title: 'Formulas',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="math-integral" size={28} color="white" />,
        }}
      />
      <Tabs.Screen
        name="Shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cart-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="todoHub"
        options={{
          title: 'To-do',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
        }}
      />
    </Tabs>
  );
}
