import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    // Simulamos un login exitoso
    setTimeout(() => {
      setLoading(false);
      // En un caso real, aquí iría la lógica de autenticación
      // como llamar a API, verificar credenciales, etc.
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Surface style={styles.logoContainer} elevation={4}>
          <Text style={styles.logoText}>N</Text>
        </Surface>
        
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
        
        <Button 
          mode="contained" 
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Iniciar Sesión
        </Button>
        
        <View style={styles.footer}>
          <Text>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Regístrate</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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