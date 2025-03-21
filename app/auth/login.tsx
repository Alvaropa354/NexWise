import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { signIn } from '../services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, ingresa tu correo electrónico y contraseña');
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);

      const { data, error } = await signIn(email, password);

      if (error) {
        console.error('Error al iniciar sesión:', error);
        setError(error.message || 'Error al iniciar sesión');
        return;
      }

      if (!data?.session?.user) {
        setError('No se pudo iniciar sesión. Por favor, intenta de nuevo.');
        return;
      }

      // Navegar a la pantalla principal si el login es exitoso
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error inesperado al iniciar sesión:', err);
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Bienvenido de nuevo
      </Text>

      <View style={styles.form}>
        <TextInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Iniciar sesión
        </Button>
      </View>

      <View style={styles.footer}>
        <Text variant="bodyMedium">¿No tienes una cuenta? </Text>
        <Link href="/auth/register">
          <Text variant="bodyMedium" style={styles.link}>
            Regístrate
          </Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    color: '#2563eb',
  },
}); 