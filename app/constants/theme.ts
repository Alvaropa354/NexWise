import { MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0A66C2',
    secondary: '#0077B5',
    tertiary: '#00A0DC',
    accent: '#0073B1',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F3F2F1',
    error: '#D62246',
    success: '#057642',
    warning: '#F5A623',
    info: '#0077B5',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#191919',
    onSurface: '#191919',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F9F9F9',
      level3: '#F3F3F3',
      level4: '#ECECEC',
      level5: '#E6E6E6',
    },
  },
  fonts: {
    ...MD3LightTheme.fonts,
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontWeight: '700',
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontWeight: '600',
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontWeight: '600',
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontWeight: '400',
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontWeight: '400',
    },
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};
