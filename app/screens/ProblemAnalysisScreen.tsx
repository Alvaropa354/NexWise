import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { ProblemAnalytics } from '../components/analytics/ProblemAnalytics';

export function ProblemAnalysisScreen() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();

  if (!problemId) {
    return (
      <View style={styles.centered}>
        <Text>Error: ID de problema no proporcionado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProblemAnalytics problemId={problemId} />
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