import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome({ navigation }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
          }}
          style={styles.backgroundImage}
        />

        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nexwise' }}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>NexWise</Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
          Descubre oportunidades de negocio basadas en observaciones del mundo real
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Iniciar Sesión
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Register')}
            style={[styles.button, styles.registerButton]}
            contentStyle={styles.buttonContent}
            labelStyle={{ color: theme.colors.primary }}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.05,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    maxWidth: 320,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  button: {
    marginVertical: 8,
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
  registerButton: {
    borderWidth: 1.5,
  },
});
