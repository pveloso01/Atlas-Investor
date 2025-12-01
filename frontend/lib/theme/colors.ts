/**
 * Color palette following the 60-30-10 rule:
 * - 60% neutral (backgrounds, text)
 * - 30% secondary (supporting elements)
 * - 10% accent (CTAs, highlights)
 * 
 * Color-blind friendly palette
 */

export const colors = {
  // Neutral (60%)
  neutral: {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
  
  // Primary Brand Color (30%)
  primary: {
    main: '#1976d2', // Blue
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#FFFFFF',
  },
  
  // Accent Color (10%)
  accent: {
    main: '#FF6B35', // Vibrant orange for CTAs
    light: '#FF8C5A',
    dark: '#E55A2B',
    contrastText: '#FFFFFF',
  },
  
  // Semantic Colors
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },
} as const;

// Color-blind friendly data visualization colors
export const chartColors = {
  primary: '#1976d2',
  secondary: '#FF6B35',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  // Additional colors for multi-series charts
  series1: '#1976d2',
  series2: '#FF6B35',
  series3: '#4CAF50',
  series4: '#FF9800',
  series5: '#9C27B0',
  series6: '#00BCD4',
} as const;



