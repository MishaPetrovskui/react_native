import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BrandHeader, HeaderIcon } from '@/features/todo/components/BrandHeader';
import { PrimaryButton } from '@/features/todo/components/PrimaryButton';
import { Screen } from '@/features/todo/components/Screen';
import { deadlineToInput, parseDeadlineInput } from '@/features/todo/date';
import { useTasks } from '@/features/todo/tasks';
import { todoColors } from '@/features/todo/theme';

/** Екран "Add TODO" (без параметра id) та "Edit TODO" (з id). */
export default function TodoFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getTodo, addTodo, updateTodo } = useTasks();
  const editing = id ? getTodo(id) : undefined;

  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [deadline, setDeadline] = useState(editing?.deadline ? deadlineToInput(editing.deadline) : '');
  const [imageUri, setImageUri] = useState<string | null>(editing?.imageUri ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async () => {
    if (title.trim().length === 0) {
      setError('Title is required');
      return;
    }
    const parsed = parseDeadlineInput(deadline);
    if (parsed === 'invalid') {
      setError('Deadline must be a real date in DD.MM.YYYY format');
      return;
    }

    setSaving(true);
    const input = {
      title: title.trim(),
      description: description.trim(),
      deadline: parsed,
      imageUri,
    };
    if (editing) await updateTodo(editing.id, input);
    else await addTodo(input);
    setSaving(false);
    router.back();
  };

  return (
    <Screen>
      <BrandHeader
        onBack={() => router.back()}
        right={<HeaderIcon name="settings-outline" onPress={() => router.push('/todo/profile')} />}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.panel}>
          <View style={styles.handle} />
          <ScrollView
            contentContainerStyle={styles.panelContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              style={styles.field}
              placeholder="Title"
              placeholderTextColor="rgba(255,255,255,0.8)"
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
            <TextInput
              style={[styles.field, styles.multiline]}
              placeholder="Description"
              placeholderTextColor="rgba(255,255,255,0.8)"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <View style={[styles.field, styles.row, styles.fieldDim]}>
              <TextInput
                style={styles.rowInput}
                placeholder="Deadline (Optional) DD.MM.YYYY"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={deadline}
                onChangeText={setDeadline}
                keyboardType="numbers-and-punctuation"
              />
              <Ionicons name="calendar-outline" size={18} color="rgba(255,255,255,0.8)" />
            </View>

            <Pressable style={[styles.field, styles.row, styles.fieldDim]} onPress={pickImage}>
              <Text style={styles.rowInput}>{imageUri ? 'Change image' : 'Add image (Optional)'}</Text>
              <Ionicons name="image-outline" size={18} color="rgba(255,255,255,0.8)" />
            </Pressable>

            {imageUri ? (
              <View style={styles.previewWrap}>
                <Image source={{ uri: imageUri }} style={styles.preview} contentFit="cover" />
                <Pressable style={styles.removeImg} onPress={() => setImageUri(null)} hitSlop={8}>
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </Pressable>
              </View>
            ) : null}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton
              label={editing ? 'EDIT TODO' : 'ADD TODO'}
              onPress={onSubmit}
              loading={saving}
              inverted
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  panel: {
    flex: 1,
    backgroundColor: todoColors.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  panelContent: { padding: 20, paddingBottom: 32 },
  field: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  multiline: { height: 220, paddingTop: 10 },
  fieldDim: { borderColor: 'rgba(255,255,255,0.6)' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowInput: { flex: 1, color: '#fff', fontSize: 14, height: 40 , lineHeight: 40 },
  previewWrap: { marginBottom: 12 },
  preview: { width: '100%', height: 160, borderRadius: 10 },
  removeImg: { position: 'absolute', top: 6, right: 6 },
  error: { color: '#fff', backgroundColor: 'rgba(214,69,69,0.85)', padding: 8, borderRadius: 8, fontSize: 12, marginBottom: 10 },
});
