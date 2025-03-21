import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { ProblemDetails } from '../components/problems/ProblemDetails';
import { problemsService } from '../services/problems';

interface Problem {
  id: string;
  title: string;
  description: string;
  sector: string;
  impactLevel: number;
  urgencyLevel: number;
  potentialScore: number;
  price: number;
  isVerified: boolean;
}

export default function ProblemDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    loadProblem();
  }, [id]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      setError(null);
      const problemData = await problemsService.getProblem(id as string);
      setProblem(problemData);
    } catch (err) {
      setError('Error al cargar los detalles del problema');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !problem) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'No se encontró el problema'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProblemDetails {...problem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#B00020',
    textAlign: 'center',
  },
}); 