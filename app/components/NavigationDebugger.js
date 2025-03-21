import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePathname, useSegments } from 'expo-router';

export function NavigationDebugger() {
  const pathname = usePathname();
  const segments = useSegments();

  if (__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Depurador de navegación</Text>
        <Text>Ruta actual: {pathname}</Text>
        <Text>Segmentos: {segments.join('/')}</Text>
      </View>
    );
  }
  
  return null;
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#ffecb3',
    borderWidth: 1,
    borderColor: '#ffd54f',
  },
  title: {
    fontWeight: 'bold',
  }
}); 