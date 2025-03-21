import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MarketProductsDashboard } from '../components/marketProducts/MarketProductsDashboard';
import { useLocalSearchParams } from 'expo-router';

export function MarketProductsScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();

  if (!problemId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No se proporcionó ID del problema</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MarketProductsDashboard problemId={problemId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
}); 