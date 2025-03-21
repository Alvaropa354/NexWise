import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { signUp } from '../services/auth';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);

      const { data, error } = await signUp(email, password, { fullName, company });

      if (error) {
        console.error('Error al registrarse:', error);
        setError(error.message || 'Error al registrarse');
        return;
      }

      // Mostrar mensaje de éxito
      Alert.alert(
        'Registro exitoso',
        'Por favor, verifica tu correo electrónico para activar tu cuenta.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (err) {
      console.error('Error inesperado al registrarse:', err);
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Crear una cuenta
      </Text>

      <View style={styles.form}>
        <TextInput
          label="Nombre completo *"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />

        <TextInput
          label="Correo electrónico *"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Contraseña *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Empresa (opcional)"
          value={company}
          onChangeText={setCompany}
          style={styles.input}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Registrarse
        </Button>
      </View>

      <View style={styles.footer}>
        <Text variant="bodyMedium">¿Ya tienes una cuenta? </Text>
        <Link href="/auth/login">
          <Text variant="bodyMedium" style={styles.link}>
            Inicia sesión
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