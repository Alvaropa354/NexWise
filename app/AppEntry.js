import React from 'react';
import { registerRootComponent } from 'expo';
import AppNavigation from './navigation';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme } from './constants/theme';

export default function AppEntry() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <AppNavigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// Esta función registra el componente raíz de la aplicación
registerRootComponent(AppEntry);
