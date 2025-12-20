// EntrepreneurAI Design System
// Modern, Dark, Premium UI Theme

export const colors = {
  // Backgrounds
  background: {
    primary: '#0A0E1A',      // Deep navy black
    secondary: '#111827',    // Dark slate
    tertiary: '#1A2235',     // Elevated surface
    card: '#151C2C',         // Card background
    elevated: '#1E2640',     // Elevated elements
  },
  
  // Accent Colors
  accent: {
    primary: '#00D4FF',      // Neon Cyan
    secondary: '#0EA5E9',    // Sky Blue
    tertiary: '#06B6D4',     // Teal
    gradient: ['#00D4FF', '#0EA5E9'],
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',      // Primary white
    secondary: '#94A3B8',    // Muted gray
    tertiary: '#64748B',     // Dim gray
    inverse: '#0A0E1A',      // Dark text on light bg
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',      // Green
    warning: '#F59E0B',      // Amber
    error: '#EF4444',        // Red
    info: '#3B82F6',         // Blue
  },
  
  // Border Colors
  border: {
    default: '#1E293B',      // Subtle border
    light: '#334155',        // Light border
    accent: '#00D4FF',       // Accent border
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  // Font Families (using system fonts)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
};

export default theme;
