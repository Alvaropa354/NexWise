import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await signUp(email, password, { full_name: fullName });

    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Éxito', 'Revisa tu email para confirmar tu cuenta');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        label="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={signUpWithEmail} 
        loading={loading}
        style={styles.button}
      >
        Registrarse
      </Button>
      <Button 
        mode="text" 
        onPress={() => router.push('/login')}
      >
        ¿Ya tienes cuenta? Iniciar sesión
      </Button>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginVertical: 16,
  },
}); 