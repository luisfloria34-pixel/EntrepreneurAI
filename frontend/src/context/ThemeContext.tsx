import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { spacing, radius, typography, shadows } from '../theme';

export type ThemeMode = 'dark' | 'light' | 'system';

// ─── Color palettes ───────────────────────────────────────────────────────────

const darkColors = {
  background: {
    primary: '#0A0E1A',
    secondary: '#111827',
    tertiary: '#1A2235',
    card: '#151C2C',
    elevated: '#1E2640',
    overlay: 'rgba(0,0,0,0.6)',
  },
  accent: {
    primary: '#00D4FF',
    secondary: '#0EA5E9',
    tertiary: '#06B6D4',
    gradient: ['#00D4FF', '#0EA5E9'] as string[],
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
    tertiary: '#64748B',
    inverse: '#0A0E1A',
    muted: '#475569',
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
  },
  border: {
    default: '#1E293B',
    light: '#334155',
    accent: '#00D4FF',
  },
  tabBar: '#0D1526',
};

const lightColors = {
  background: {
    primary: '#F0F4F8',
    secondary: '#E8EFF7',
    tertiary: '#DDE6F0',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.4)',
  },
  accent: {
    primary: '#0099BB',
    secondary: '#0EA5E9',
    tertiary: '#06B6D4',
    gradient: ['#0099BB', '#0EA5E9'] as string[],
  },
  text: {
    primary: '#0A0F1E',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
    muted: '#CBD5E1',
  },
  semantic: {
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#3B82F6',
    purple: '#7C3AED',
  },
  border: {
    default: '#E2E8F0',
    light: '#CBD5E1',
    accent: '#0099BB',
  },
  tabBar: '#FFFFFF',
};

export type AppColors = typeof darkColors;

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextType {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  colors: AppColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  setTheme: () => {},
  colors: darkColors,
  isDark: true,
});

const STORAGE_KEY = '@theme_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val === 'dark' || val === 'light' || val === 'system') setMode(val);
    });
  }, []);

  async function setTheme(newMode: ThemeMode) {
    setMode(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode);
  }

  const isDark =
    mode === 'dark' ||
    (mode === 'system' && systemScheme !== 'light');

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, setTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Re-export static values that don't change with theme
export { spacing, radius, typography, shadows };
