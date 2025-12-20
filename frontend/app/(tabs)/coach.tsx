import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput as RNTextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { aiChatMessages, quickPrompts, suggestedPrompts } from '../../src/data/dummyData';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>(aiChatMessages);
  const [inputText, setInputText] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputText('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "That's a great question! As your AI business coach, I'd recommend starting by identifying your target market and understanding their specific pain points. Would you like me to walk you through a quick market research exercise?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

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
                onPress={() => {
                  setInputText(item.prompt);
                  setShowPrompts(false);
                }}
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
                  <Text style={[
                    styles.messageText,
                    message.role === 'user' && styles.userText,
                  ]}>
                    {message.content}
                  </Text>
                </View>
              </View>
            ))}
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

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
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
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() ? colors.text.inverse : colors.text.tertiary} 
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
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  messageBubble: {
    flexDirection: 'row',
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: `${colors.accent.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  messageContent: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    maxWidth: '100%',
  },
  userContent: {
    backgroundColor: colors.accent.primary,
    borderBottomRightRadius: radius.xs,
  },
  assistantContent: {
    backgroundColor: colors.background.card,
    borderBottomLeftRadius: radius.xs,
  },
  messageText: {
    ...typography.body,
    color: colors.text.primary,
  },
  userText: {
    color: colors.text.inverse,
  },
  promptsContainer: {
    flex: 1,
  },
  promptsContent: {
    padding: spacing.lg,
  },
  promptsTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  promptsSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xxl,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  promptIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  promptContent: {
    flex: 1,
  },
  promptCategory: {
    ...typography.caption,
    color: colors.accent.primary,
    marginBottom: spacing.xs,
  },
  promptText: {
    ...typography.body,
    color: colors.text.primary,
  },
  quickPromptsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    paddingVertical: spacing.sm,
  },
  quickPromptsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  quickPromptChip: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  quickPromptText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  inputContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.background.elevated,
  },
});
