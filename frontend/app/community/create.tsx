import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useProfile } from '../../src/hooks/useProfile';
import { getIsPro } from '../../src/services/proStatus';

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  // Gate: check Pro before allowing post
  async function checkProGate(): Promise<boolean> {
    const pro = await getIsPro();
    if (!pro) {
      router.push({ pathname: '/paywall', params: { message: 'Community posting is a Pro feature' } });
      return false;
    }
    return true;
  }

  const initials = (profile?.name ?? user?.email ?? 'U')[0].toUpperCase();

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handlePost() {
    if (!user || !content.trim() || posting) return;
    if (!(await checkProGate())) return;
    setPosting(true);
    try {
      let image_url: string | null = null;

      if (imageUri) {
        const ext = imageUri.split('.').pop() ?? 'jpg';
        const filename = `${user.id}/${Date.now()}.${ext}`;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filename, blob, { contentType: `image/${ext}` });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(filename);
          image_url = urlData.publicUrl;
        }
      }

      await supabase.from('community_posts').insert({
        user_id: user.id,
        content: content.trim(),
        image_url,
      });

      router.back();
    } catch {
      Alert.alert('Error', 'Could not create post. Please try again.');
    } finally {
      setPosting(false);
    }
  }

  return (
    <ScreenWrapper keyboardAvoiding>
      <AppHeader showBack onBack={() => router.back()} title="Create Post" />

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Share your thoughts, wins, or questions..."
            placeholderTextColor={colors.text.muted}
            value={content}
            onChangeText={setContent}
            multiline
            autoFocus
          />
        </View>

        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImage} onPress={() => setImageUri(null)}>
              <Ionicons name="close-circle" size={24} color={colors.semantic.error} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.attachments}>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.attachText}>Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomCta}>
        <PrimaryButton
          title={posting ? 'Posting...' : 'Post'}
          onPress={handlePost}
          disabled={!content.trim() || posting}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.lg,
  },
  avatar: {
    width: 44, height: 44, borderRadius: radius.full,
    backgroundColor: colors.accent.primary, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.md,
  },
  avatarText: { ...typography.bodyMedium, color: colors.text.inverse },
  input: {
    flex: 1, ...typography.body, color: colors.text.primary,
    minHeight: 150, textAlignVertical: 'top',
  },
  imagePreviewContainer: { marginTop: spacing.lg, position: 'relative' },
  imagePreview: { width: '100%', height: 200, borderRadius: radius.lg },
  removeImage: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  attachments: {
    flexDirection: 'row', gap: spacing.lg, paddingTop: spacing.lg,
    borderTopWidth: 1, borderTopColor: colors.border.default,
  },
  attachButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.lg,
  },
  attachText: { ...typography.smallMedium, color: colors.text.secondary },
  bottomCta: { paddingVertical: spacing.lg },
});
