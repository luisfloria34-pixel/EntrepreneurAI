import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  scroll?: boolean;
  padded?: boolean;
  keyboardAvoiding?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  bottomInset?: boolean;
  refreshControl?: React.ReactElement<React.ComponentProps<typeof RefreshControl>>;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  contentStyle,
  scroll = false,
  padded = true,
  keyboardAvoiding = false,
  edges = ['top'],
  bottomInset = false,
  refreshControl,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const containerStyle: ViewStyle[] = [
    {
      flex: 1,
      backgroundColor: colors.background.primary,
      paddingTop: edges.includes('top') ? insets.top : 0,
      paddingBottom: bottomInset ? insets.bottom : 0,
    },
    style as ViewStyle,
  ];

  const contentContainerStyle = [
    padded && styles.padded,
    { paddingBottom: bottomInset ? spacing.lg : insets.bottom + spacing.xxxl },
    contentStyle,
  ];

  const content = scroll ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, padded && styles.padded, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={containerStyle}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1 },
  scroll: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
  keyboard: { flex: 1 },
});
