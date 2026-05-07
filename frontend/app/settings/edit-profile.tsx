import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Animated, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('name, bio, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) console.log('[EditProfile] load error:', error.message);
        if (data) {
          setName(data.name ?? '');
          setBio(data.bio ?? '');
          setAvatarUri(data.avatar_url ?? null);
        }
        setLoading(false);
      });
  }, [user]);

  function showToast() {
    toastOpacity.setValue(1);
    Animated.sequence([
      Animated.delay(1500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  async function pickAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!user || saving) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim(), bio: bio.trim() })
        .eq('id', user.id);

      if (error) {
        console.log('[EditProfile] save error:', error.message, error.code, error.details);
        throw error;
      }

      // Upload avatar separately — non-blocking for the profile update
      if (avatarUri && avatarUri.startsWith('file')) {
        try {
          const ext = avatarUri.split('.').pop() ?? 'jpg';
          const filename = `${user.id}/avatar.${ext}`;
          const response = await fetch(avatarUri);
          const blob = await response.blob();
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filename, blob, { upsert: true, contentType: `image/${ext}` });
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filename);
            await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', user.id);
          } else {
            console.log('[EditProfile] avatar upload error:', uploadError.message);
          }
        } catch (uploadErr) {
          console.log('[EditProfile] avatar upload exception:', uploadErr);
        }
      }

      showToast();
      setTimeout(() => router.back(), 2000);
    } catch (e: any) {
      Alert.alert('Could not save profile', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Edit Profile" showBack onBack={() => router.back()} />
        <View style={styles.loadingContainer}><ActivityIndicator color={colors.accent.primary} /></View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Edit Profile" showBack onBack={() => router.back()} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.content}>
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatar} onPress={pickAvatar}>
              <Text style={styles.avatarText}>{initials}</Text>
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={20} color={colors.text.inverse} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changeAvatarBtn} onPress={pickAvatar}>
              <Ionicons name="camera" size={16} color={colors.accent.primary} />
              <Text style={styles.changeAvatarText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.text.muted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={user?.email ?? ''}
                editable={false}
                placeholderTextColor={colors.text.muted}
              />
              <Text style={styles.helperText}>Email cannot be changed here</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor={colors.text.muted}
                multiline
                numberOfLines={3}
                maxLength={150}
              />
              <Text style={styles.charCount}>{bio.length}/150</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={saving} />
        </View>
      </KeyboardAvoidingView>

      {/* Success toast */}
      <Animated.View style={[styles.toast, { opacity: toastOpacity }]} pointerEvents="none">
        <Ionicons name="checkmark-circle" size={18} color={colors.text.inverse} />
        <Text style={styles.toastText}>Profile saved!</Text>
      </Animated.View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1 },
  content: { flex: 1 },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xxl },
  avatar: {
    width: 100, height: 100, borderRadius: radius.full,
    backgroundColor: colors.accent.primary, alignItems: 'center',
    justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarText: { ...typography.h1, color: colors.text.inverse },
  cameraOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: radius.full,
    backgroundColor: colors.background.elevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background.primary,
  },
  changeAvatarBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  changeAvatarText: { ...typography.smallMedium, color: colors.accent.primary },
  form: { flex: 1 },
  inputGroup: { marginBottom: spacing.xl },
  label: { ...typography.smallMedium, color: colors.text.secondary, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.lg, ...typography.body, color: colors.text.primary,
  },
  inputDisabled: { opacity: 0.5 },
  helperText: { ...typography.caption, color: colors.text.muted, marginTop: spacing.xs },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  charCount: { ...typography.caption, color: colors.text.muted, textAlign: 'right', marginTop: spacing.xs },
  footer: { paddingVertical: spacing.lg },
  toast: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.semantic.success,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  toastText: { ...typography.smallMedium, color: colors.text.inverse },
});
