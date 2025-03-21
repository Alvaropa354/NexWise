import React from 'react';
import { registerRootComponent } from 'expo';
import AppNavigation from './navigation';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Tema personalizado
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0088ff',
    accent: '#4CAF50',
  },
};

export default function AppEntry() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppNavigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// Esta función registra el componente raíz de la aplicación
registerRootComponent(AppEntry); 