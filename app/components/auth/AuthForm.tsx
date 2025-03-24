import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, HelperText, useTheme } from 'react-native-paper';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: { email: string; password: string; fullName?: string }) => void;
  isLoading: boolean;
  error?: string;
}

export default function AuthForm({ type, onSubmit, isLoading, error }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleSubmit = () => {
    onSubmit({
      email,
      password,
      ...(type === 'register' ? { fullName } : {}),
    });
  };

  return (
    <View style={styles.container}>
      {type === 'register' && (
        <TextInput
          label="Nombre Completo"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          autoCapitalize="words"
          left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
          outlineStyle={styles.inputOutline}
          mode="outlined"
        />
      )}

      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
        outlineStyle={styles.inputOutline}
        mode="outlined"
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={styles.input}
        outlineStyle={styles.inputOutline}
        mode="outlined"
      />

      {error && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  inputOutline: {
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    elevation: 0,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
