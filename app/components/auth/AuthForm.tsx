import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';

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
        />
      )}
      
      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={styles.input}
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
  button: {
    marginTop: 8,
  },
}); 