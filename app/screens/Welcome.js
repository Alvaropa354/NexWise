import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Surface style={styles.logoContainer} elevation={4}>
          <Text style={styles.logoText}>N</Text>
        </Surface>
        
        <Text style={styles.title}>Nexwise</Text>
        <Text style={styles.slogan}>
          Transformando Problemas en Soluciones y Oportunidades
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            Iniciar Sesión
          </Button>
          
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => navigation.navigate('Register')}
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#2196F3',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slogan: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginVertical: 8,
  },
}); 