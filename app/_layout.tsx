import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { supabase } from './services/supabase';
import { stripeService } from './services/stripe';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        // Inicializar Stripe
        await stripeService.initialize();
        
        // Verificar la conexión con Supabase
        const { data, error } = await supabase.from('testing_connection').select('*').limit(1).maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          // PGRST116 significa que la tabla no existe, lo que es normal
          // Si es otro tipo de error, podría ser un problema de conexión
          console.warn('Error al verificar conexión con Supabase:', error);
          // No lanzamos error para permitir que la app continúe
        }
        
        setIsReady(true);
      } catch (err) {
        console.error('Error al inicializar la aplicación:', err);
        setError('Hubo un problema al inicializar la aplicación. Por favor, intenta de nuevo.');
        setIsReady(true); // Permitimos que la app continúe para mostrar mensajes de error
      }
    }

    initialize();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando NexWise...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorSubtext}>
              La aplicación continuará funcionando, pero algunas características podrían no estar disponibles.
            </Text>
          </View>
        ) : null}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffcccc',
    borderRadius: 5,
    margin: 10,
  },
  errorText: {
    color: '#cc0000',
    fontWeight: 'bold',
  },
  errorSubtext: {
    color: '#cc0000',
    marginTop: 5,
  },
}); 