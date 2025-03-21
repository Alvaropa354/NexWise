import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { analyticsService } from '../../services/analytics';

interface DemandPredictionProps {
  problemId: string;
}

export function DemandPrediction({ problemId }: DemandPredictionProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [prediction, setPrediction] = React.useState<any>(null);

  React.useEffect(() => {
    loadPrediction();
  }, [problemId]);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.predictDemand(problemId);
      setPrediction(data);
    } catch (err) {
      setError('Error al cargar la predicción de demanda');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando predicción de demanda...</Text>
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.error}>{error}</Text>
        </Card.Content>
      </Card>
    );
  }

  if (!prediction) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">Predicción de Demanda</Text>
        
        <View style={styles.section}>
          <Text variant="titleMedium">Demanda Predicha</Text>
          <Text variant="bodyLarge">
            ${prediction.predicted_demand.toLocaleString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">Nivel de Confianza</Text>
          <ProgressBar
            progress={prediction.confidence_level / 100}
            style={styles.progressBar}
          />
          <Text variant="bodyMedium">{prediction.confidence_level}%</Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">Horizonte Temporal</Text>
          <Text variant="bodyLarge">
            {prediction.timeframe_months} meses
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  section: {
    marginTop: 16,
  },
  progressBar: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
  },
}); 