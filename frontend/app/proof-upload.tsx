import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProofUploadScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<'image' | 'video' | null>(null);

  const handleUpload = () => {
    Alert.alert(
      'Upload Successful!',
      'Your proof has been uploaded. (Demo only - no actual upload)',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <ScreenWrapper>
      <AppHeader 
        title="Upload Proof" 
        showBack 
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        {/* Upload Area */}
        <View style={styles.uploadSection}>
          <Text style={styles.label}>Select Media Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity 
              style={[styles.typeButton, selectedType === 'image' && styles.typeButtonActive]}
              onPress={() => setSelectedType('image')}
            >
              <Ionicons 
                name="image" 
                size={32} 
                color={selectedType === 'image' ? colors.accent.primary : colors.text.tertiary} 
              />
              <Text style={[styles.typeText, selectedType === 'image' && styles.typeTextActive]}>
                Image
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.typeButton, selectedType === 'video' && styles.typeButtonActive]}
              onPress={() => setSelectedType('video')}
            >
              <Ionicons 
                name="videocam" 
                size={32} 
                color={selectedType === 'video' ? colors.accent.primary : colors.text.tertiary} 
              />
              <Text style={[styles.typeText, selectedType === 'video' && styles.typeTextActive]}>
                Video
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upload Box */}
        {selectedType && (
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="cloud-upload-outline" size={48} color={colors.accent.primary} />
            <Text style={styles.uploadText}>Tap to select {selectedType}</Text>
            <Text style={styles.uploadHint}>Max 10MB • JPG, PNG, MP4</Text>
          </TouchableOpacity>
        )}

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Landing Page Screenshot"
            placeholderTextColor={colors.text.muted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What does this proof show?"
            placeholderTextColor={colors.text.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.accent.primary} />
          <Text style={styles.infoText}>
            Proof of Work shows your real progress. Upload screenshots, videos, or any evidence of your hustle!
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.footer}>
        <PrimaryButton 
          title="Upload Proof"
          onPress={handleUpload}
          disabled={!selectedType || !title.trim()}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  uploadSection: {
    marginBottom: spacing.xxl,
  },
  label: {
    ...typography.smallMedium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeButton: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}10`,
  },
  typeText: {
    ...typography.bodyMedium,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  typeTextActive: {
    color: colors.accent.primary,
  },
  uploadBox: {
    backgroundColor: colors.background.card,
    borderRadius: radius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.xxl,
  },
  uploadText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  uploadHint: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...typography.body,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.accent.primary}10`,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    ...typography.small,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
