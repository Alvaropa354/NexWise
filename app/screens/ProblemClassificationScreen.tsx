import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { ProblemClassification } from '../components/classification/ProblemClassification';

export function ProblemClassificationScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();

  if (!problemId) {
    return (
      <View style={styles.centered}>
        <Text>Error: ID de problema no proporcionado</Text>
      </View>
    );
  }

  const handleCategorySelect = (categoryId: string) => {
    // Implementar lógica para filtrar por categoría
    console.log('Categoría seleccionada:', categoryId);
  };

  const handleFilterSelect = (filter: any) => {
    // Implementar lógica para aplicar filtro
    console.log('Filtro seleccionado:', filter);
  };

  return (
    <View style={styles.container}>
      <ProblemClassification
        problemId={problemId}
        onCategorySelect={handleCategorySelect}
        onFilterSelect={handleFilterSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 