import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput as RNTextInput, KeyboardAvoidingView, Platform,
  Animated, Image, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { quickPrompts, suggestedPrompts } from '../../src/data/dummyData';
import { sendMessage, GroqMessage } from '../../src/services/groq';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
};

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! I'm your AI Business Coach. Ready to help you build your entrepreneurial skills. What would you like to work on today?",
  timestamp: new Date(),
};

// ─── Animated 3-dot typing indicator ────────────────────────────────────────
function TypingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ([dot1, dot2, dot3] as Animated.Value[]).forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: -5, duration: 250, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.delay(600 - i * 150),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={dotStyles.row}>
      {([dot1, dot2, dot3] as Animated.Value[]).map((dot, i) => (
        <Animated.View key={i} style={[dotStyles.dot, { transform: [{ translateY: dot }] }]} />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent.primary },
});
// ────────────────────────────────────────────────────────────────────────────

export default function CoachScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  // Load last conversation from Supabase on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('conversations')
        .select('id, messages')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.messages?.length) {
        setConversationId(data.id);
        setMessages(
          (data.messages as Message[]).map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
      }
    })();
  }, [user]);

  const saveConversation = async (msgs: Message[]) => {
    if (!user) return;
    const payload = { user_id: user.id, messages: msgs, updated_at: new Date().toISOString() };
    if (conversationId) {
      await supabase.from('conversations').update(payload).eq('id', conversationId);
    } else {
      const { data } = await supabase.from('conversations').insert(payload).select('id').single();
      if (data) setConversationId(data.id);
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const filename = `${user!.id}/${Date.now()}.${ext}`;

    // fetch the local file as a blob, then upload to Supabase Storage
    const fileResponse = await fetch(uri);
    const blob = await fileResponse.blob();

    const { error } = await supabase.storage
      .from('chat-images')
      .upload(filename, blob, { contentType });

    if (error) {
      console.error('[Storage] Upload error:', error.message);
      throw error;
    }

    return supabase.storage.from('chat-images').getPublicUrl(filename).data.publicUrl;
  };

  const handlePickImage = () => {
    Alert.alert('Add Image', 'Choose source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission required', 'Camera access is needed to take photos.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            quality: 0.8,
          });
          if (!result.canceled) setSelectedImage(result.assets[0].uri);
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission required', 'Photo library access is needed to pick images.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.8,
          });
          if (!result.canceled) setSelectedImage(result.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;
    if (isTyping) return;

    let uploadedUrl: string | undefined;

    if (selectedImage) {
      try {
        uploadedUrl = await uploadImage(selectedImage);
      } catch {
        Alert.alert('Upload failed', 'Could not upload image. Please try again.');
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      imageUrl: uploadedUrl,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);
    scrollRef.current?.scrollToEnd({ animated: true });

    try {
      const history: GroqMessage[] = updatedMessages.map(({ role, content, imageUrl }) => ({
        role,
        content,
        imageUrl,
      }));
      const reply = await sendMessage(history);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      await saveConversation(finalMessages);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check your connection and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  const canSend = (inputText.trim().length > 0 || !!selectedImage) && !isTyping;

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.header}>
        <AppHeader
          title="AI Coach"
          subtitle="Your personal business mentor"
          rightIcon="sparkles-outline"
          onRightPress={() => setShowPrompts(!showPrompts)}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {showPrompts ? (
          <ScrollView style={styles.promptsContainer} contentContainerStyle={styles.promptsContent}>
            <Text style={styles.promptsTitle}>Suggested Prompts</Text>
            <Text style={styles.promptsSubtitle}>Tap any prompt to start a conversation</Text>
            {suggestedPrompts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.promptCard}
                onPress={() => { setInputText(item.prompt); setShowPrompts(false); }}
                activeOpacity={0.7}
              >
                <View style={styles.promptIcon}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.accent.primary} />
                </View>
                <View style={styles.promptContent}>
                  <Text style={styles.promptCategory}>{item.category}</Text>
                  <Text style={styles.promptText}>{item.prompt}</Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={16} color={colors.accent.primary} />
                  </View>
                )}
                <View style={[
                  styles.messageContent,
                  message.role === 'user' ? styles.userContent : styles.assistantContent,
                ]}>
                  {message.imageUrl && (
                    <Image
                      source={{ uri: message.imageUrl }}
                      style={styles.chatImage}
                      resizeMode="cover"
                    />
                  )}
                  {message.content.length > 0 && (
                    <Text style={[styles.messageText, message.role === 'user' && styles.userText]}>
                      {message.content}
                    </Text>
                  )}
                </View>
              </View>
            ))}

            {isTyping && (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={16} color={colors.accent.primary} />
                </View>
                <View style={[styles.messageContent, styles.assistantContent]}>
                  <TypingDots />
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Quick Prompts */}
        <View style={styles.quickPromptsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsContent}
          >
            {quickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickPromptChip}
                onPress={() => setInputText(prompt)}
              >
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Image preview above input */}
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />
            <TouchableOpacity style={styles.previewRemove} onPress={() => setSelectedImage(null)}>
              <Ionicons name="close-circle" size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.imageButton} onPress={handlePickImage} disabled={isTyping}>
              <Ionicons
                name="camera-outline"
                size={22}
                color={isTyping ? colors.text.muted : colors.accent.primary}
              />
            </TouchableOpacity>

            <RNTextInput
              style={styles.input}
              placeholder="Ask your AI coach anything..."
              placeholderTextColor={colors.text.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!canSend}
            >
              <Ionicons
                name="send"
                size={20}
                color={canSend ? colors.text.inverse : colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  keyboardView: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: spacing.lg, gap: spacing.lg },
  messageBubble: { flexDirection: 'row', maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end' },
  assistantBubble: { alignSelf: 'flex-start' },
  aiAvatar: {
    width: 32, height: 32,
    borderRadius: radius.full,
    backgroundColor: `${colors.accent.primary}20`,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  messageContent: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    maxWidth: '100%',
    gap: spacing.sm,
  },
  userContent: { backgroundColor: colors.accent.primary, borderBottomRightRadius: radius.xs },
  assistantContent: { backgroundColor: colors.background.card, borderBottomLeftRadius: radius.xs },
  chatImage: {
    width: 200,
    height: 150,
    borderRadius: radius.md,
  },
  messageText: { ...typography.body, color: colors.text.primary },
  userText: { color: colors.text.inverse },
  promptsContainer: { flex: 1 },
  promptsContent: { padding: spacing.lg },
  promptsTitle: { ...typography.h2, color: colors.text.primary, marginBottom: spacing.xs },
  promptsSubtitle: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.xxl },
  promptCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md,
  },
  promptIcon: {
    width: 40, height: 40, borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  promptContent: { flex: 1 },
  promptCategory: { ...typography.caption, color: colors.accent.primary, marginBottom: spacing.xs },
  promptText: { ...typography.body, color: colors.text.primary },
  quickPromptsContainer: {
    borderTopWidth: 1, borderTopColor: colors.border.default, paddingVertical: spacing.sm,
  },
  quickPromptsContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  quickPromptChip: {
    backgroundColor: colors.background.tertiary, borderRadius: radius.full,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderWidth: 1, borderColor: colors.border.default,
  },
  quickPromptText: { ...typography.small, color: colors.text.secondary },
  previewContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
  },
  previewRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.full,
  },
  inputContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm,
  },
  imageButton: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.xs,
  },
  input: {
    flex: 1, ...typography.body, color: colors.text.primary,
    maxHeight: 100, paddingVertical: spacing.sm, paddingHorizontal: spacing.sm,
  },
  sendButton: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center', justifyContent: 'center', marginLeft: spacing.xs,
  },
  sendButtonDisabled: { backgroundColor: colors.background.elevated },
});
