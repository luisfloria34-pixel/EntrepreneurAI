import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePostScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handlePost = () => {
    router.back();
  };

  return (
    <ScreenWrapper keyboardAvoiding>
      <AppHeader 
        showBack 
        onBack={() => router.back()} 
        title="Create Post" 
      />
      
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
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

        <View style={styles.attachments}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="image-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.attachText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="link-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.attachText}>Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomCta}>
        <PrimaryButton 
          title="Post"
          onPress={handlePost}
          disabled={!content.trim()}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.bodyMedium,
    color: colors.text.inverse,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  attachments: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  attachText: {
    ...typography.smallMedium,
    color: colors.text.secondary,
  },
  bottomCta: {
    paddingVertical: spacing.lg,
  },
});
