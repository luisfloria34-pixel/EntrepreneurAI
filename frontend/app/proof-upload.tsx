import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Alert, Image,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../src/services/supabase';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';

export default function ProofUploadScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors: c } = useTheme();
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo library access to upload proof.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  async function handleUpload() {
    if (!user || !title.trim() || !imageUri || uploading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUploading(true);
    try {
      const ext = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const filename = `${user.id}/${Date.now()}.${ext}`;
      const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('proof-images')
        .upload(filename, blob, { contentType });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('proof-images')
        .getPublicUrl(filename);

      const { error: dbError } = await supabase.from('proofs').insert({
        user_id: user.id,
        title: title.trim(),
        image_url: urlData.publicUrl,
      });

      if (dbError) throw dbError;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e: any) {
      Alert.alert('Upload failed', e?.message ?? 'Could not upload proof. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Upload Proof" showBack onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, paddingTop: spacing.lg }}>
          {/* Image picker */}
          <TouchableOpacity
            onPress={pickImage}
            style={{
              height: 200,
              borderRadius: radius.xl,
              borderWidth: 2,
              borderColor: imageUri ? c.accent.primary : c.border.default,
              borderStyle: imageUri ? 'solid' : 'dashed',
              backgroundColor: imageUri ? 'transparent' : c.background.card,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.xxl,
              overflow: 'hidden',
            }}
            activeOpacity={0.8}
          >
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <View style={{
                  position: 'absolute', bottom: spacing.sm, right: spacing.sm,
                  backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: radius.full,
                  padding: spacing.sm,
                }}>
                  <Ionicons name="pencil" size={16} color="#fff" />
                </View>
              </>
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={48} color={c.accent.primary} />
                <Text style={{ ...typography.bodyMedium, color: c.text.primary, marginTop: spacing.md }}>
                  Tap to select image
                </Text>
                <Text style={{ ...typography.caption, color: c.text.tertiary, marginTop: spacing.sm }}>
                  JPG, PNG · Max 10 MB
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Title input */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={{ ...typography.smallMedium, color: c.text.secondary, marginBottom: spacing.sm }}>
              Title *
            </Text>
            <TextInput
              style={{
                backgroundColor: c.background.card,
                borderRadius: radius.lg,
                padding: spacing.lg,
                ...typography.body,
                color: c.text.primary,
                borderWidth: 1,
                borderColor: c.border.default,
              }}
              placeholder="e.g., First paying customer!"
              placeholderTextColor={c.text.muted}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
            <Text style={{ ...typography.caption, color: c.text.muted, textAlign: 'right', marginTop: spacing.xs }}>
              {title.length}/80
            </Text>
          </View>

          {/* Info box */}
          <View style={{
            flexDirection: 'row', gap: spacing.md,
            backgroundColor: `${c.accent.primary}10`,
            borderRadius: radius.lg, padding: spacing.lg,
          }}>
            <Ionicons name="information-circle-outline" size={20} color={c.accent.primary} />
            <Text style={{ flex: 1, ...typography.small, color: c.text.secondary, lineHeight: 20 }}>
              Proof of Work shows your real progress. Upload screenshots, wins, or any evidence of your hustle!
            </Text>
          </View>
        </View>

        {/* Submit */}
        <View style={{ paddingVertical: spacing.lg }}>
          {uploading ? (
            <View style={{ alignItems: 'center', gap: spacing.md }}>
              <ActivityIndicator color={c.accent.primary} />
              <Text style={{ ...typography.small, color: c.text.secondary }}>Uploading...</Text>
            </View>
          ) : (
            <PrimaryButton
              title="Upload Proof"
              onPress={handleUpload}
              disabled={!title.trim() || !imageUri}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
