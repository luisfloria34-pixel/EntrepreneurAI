import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput as RNTextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { aiChatMessages, quickPrompts } from '../../src/data/dummyData';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>(aiChatMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate AI response (this is just UI demo, no real AI)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "That's a great question! As your AI business coach, I'd recommend starting by identifying your target market and understanding their specific pain points. Would you like me to walk you through a quick market research exercise?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.header}>
        <AppHeader 
          title="AI Coach"
          subtitle="Your personal business mentor"
        />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
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
                onPress={() => handleQuickPrompt(prompt)}
              >
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <RNTextInput
              style={styles.input}
              placeholder="Ask your AI coach anything..."
              placeholderTextColor={colors.text.tertiary}
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
    paddingHorizontal: spacing.md,
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
    padding: spacing.md,
    gap: spacing.md,
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
    padding: spacing.md,
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
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  userText: {
    color: colors.text.inverse,
  },
  quickPromptsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    paddingVertical: spacing.sm,
  },
  quickPromptsContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  quickPromptChip: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  quickPromptText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  inputContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
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
