import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 