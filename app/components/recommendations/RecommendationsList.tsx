import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar, List, Divider } from 'react-native-paper';
import { recommendationsService, Recommendation } from '../../services/recommendations';
import { useRouter } from 'expo-router';

interface RecommendationsListProps {
  userId: string;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const userRecommendations = await recommendationsService.getUserRecommendations(userId);
      setRecommendations(userRecommendations);
    } catch (err) {
      setError('Error al cargar las recomendaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewRecommendations = async () => {
    try {
      setLoading(true);
      await recommendationsService.generateRecommendations(userId);
      await loadRecommendations();
    } catch (err) {
      setError('Error al generar nuevas recomendaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemPress = (problemId: string) => {
    router.push(`/problems/${problemId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando recomendaciones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recomendaciones Personalizadas</Text>
        <Button
          mode="contained"
          onPress={handleGenerateNewRecommendations}
          loading={loading}
        >
          Generar Nuevas
        </Button>
      </View>

      {recommendations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text>No hay recomendaciones disponibles</Text>
          <Button
            mode="contained"
            onPress={handleGenerateNewRecommendations}
            style={styles.generateButton}
          >
            Generar Primera Recomendación
          </Button>
        </View>
      ) : (
        recommendations.map((recommendation) => (
          <Card
            key={recommendation.id}
            style={styles.card}
            onPress={() => handleProblemPress(recommendation.problemId)}
          >
            <Card.Content>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreTitle}>Score Total</Text>
                <ProgressBar
                  progress={recommendation.totalScore / 100}
                  color="#6200ee"
                  style={styles.scoreBar}
                />
                <Text style={styles.scoreValue}>
                  {Math.round(recommendation.totalScore * 100)}%
                </Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.metricsContainer}>
                <View style={styles.metric}>
                  <Text style={styles.metricTitle}>Relevancia</Text>
                  <ProgressBar
                    progress={recommendation.relevanceScore / 100}
                    color="#03DAC6"
                    style={styles.metricBar}
                  />
                  <Text style={styles.metricValue}>
                    {Math.round(recommendation.relevanceScore * 100)}%
                  </Text>
                </View>

                <View style={styles.metric}>
                  <Text style={styles.metricTitle}>Capacidad</Text>
                  <ProgressBar
                    progress={recommendation.capacityScore / 100}
                    color="#FF6200"
                    style={styles.metricBar}
                  />
                  <Text style={styles.metricValue}>
                    {Math.round(recommendation.capacityScore * 100)}%
                  </Text>
                </View>

                <View style={styles.metric}>
                  <Text style={styles.metricTitle}>Potencial</Text>
                  <ProgressBar
                    progress={recommendation.potentialScore / 100}
                    color="#3700B3"
                    style={styles.metricBar}
                  />
                  <Text style={styles.metricValue}>
                    {Math.round(recommendation.potentialScore * 100)}%
                  </Text>
                </View>
              </View>

              <List.Item
                title="Tipo de Recomendación"
                description={recommendation.recommendationType}
                left={props => <List.Icon {...props} icon="star" />}
              />
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  scoreContainer: {
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  scoreValue: {
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  metricsContainer: {
    gap: 12,
  },
  metric: {
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  metricBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },
  metricValue: {
    textAlign: 'right',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  generateButton: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 