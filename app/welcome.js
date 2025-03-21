import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido a NexWise</Text>
        <Text style={styles.subtitle}>
          Descubre oportunidades de negocio basadas en observaciones del mundo real
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          >
            Iniciar Sesión
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
          >
            Registrarse
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginVertical: 10,
  },
}); 