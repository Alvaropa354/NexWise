import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Aquí iría la lógica de registro
    navigation.navigate('CreateProfile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Crear Cuenta</Text>
          
          <TextInput
            label="Nombre completo"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
          
          <TextInput
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
          
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
          >
            Registrarse
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
  },
}); 