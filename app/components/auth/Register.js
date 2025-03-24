import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { signUp } = useAuth();
  const theme = useTheme();

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await signUp(email, password, { full_name: fullName });

    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Éxito', 'Revisa tu email para confirmar tu cuenta');
    setLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nexwise' }}
          style={styles.logo}
        />
        <Text style={[styles.logoText, { color: theme.colors.primary }]}>NexWise</Text>
      </View>

      <Text style={styles.title}>Registrarse</Text>
      <Text style={styles.subtitle}>Crea tu cuenta para comenzar</Text>

      <View style={styles.formContainer}>
        <TextInput
          label="Nombre completo"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
          outlineStyle={styles.inputOutline}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
          outlineStyle={styles.inputOutline}
          keyboardType="email-address"
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          outlineStyle={styles.inputOutline}
        />

        <Button
          mode="contained"
          onPress={signUpWithEmail}
          loading={loading}
          style={styles.registerButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Registrarse
        </Button>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          <Text style={[styles.dividerText, { color: theme.colors.outline }]}>O</Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[styles.loginLink, { color: theme.colors.primary }]}> Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  inputOutline: {
    borderRadius: 8,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 8,
    elevation: 0,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
