import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    // Simulamos un registro exitoso
    setTimeout(() => {
      setLoading(false);
      // En un caso real, aquí iría la lógica de registro
      // como llamar a API, crear usuario, etc.
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Surface style={styles.logoContainer} elevation={4}>
            <Text style={styles.logoText}>N</Text>
          </Surface>
          
          <Text style={styles.title}>Crear Cuenta</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            label="Nombre completo"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          
          <TextInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <TextInput
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <Button 
            mode="contained" 
            onPress={handleRegister}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Registrarse
          </Button>
          
          <View style={styles.footer}>
            <Text>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
          
          <Button 
            mode="text" 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Volver
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#2196F3',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    maxWidth: 300,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  linkText: {
    color: '#2196F3',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  }
}); 