import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const theme = useTheme();

  const handleRegister = () => {
    // Aquí iría la lógica de registro
    navigation.navigate('CreateProfile');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nexwise' }}
              style={styles.logo}
            />
            <Text style={[styles.logoText, { color: theme.colors.primary }]}>NexWise</Text>
          </View>

          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a nuestra comunidad de innovadores</Text>

          <View style={styles.formContainer}>
            <TextInput
              label="Nombre completo"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
              outlineStyle={styles.inputOutline}
            />

            <TextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
              outlineStyle={styles.inputOutline}
            />

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={secureTextEntry}
              left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye' : 'eye-off'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              outlineStyle={styles.inputOutline}
            />

            <TextInput
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={secureConfirmTextEntry}
              left={<TextInput.Icon icon="lock-check" color={theme.colors.primary} />}
              right={
                <TextInput.Icon
                  icon={secureConfirmTextEntry ? 'eye' : 'eye-off'}
                  onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                />
              }
              outlineStyle={styles.inputOutline}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
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
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                  {' '}
                  Inicia sesión
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    margin: 8,
    alignSelf: 'flex-start',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
