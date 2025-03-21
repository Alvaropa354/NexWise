import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, List } from 'react-native-paper';
import { analyticsService } from '../../services/analytics';

interface MarketAnalysisProps {
  problemId: string;
}

export function MarketAnalysis({ problemId }: MarketAnalysisProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [analysis, setAnalysis] = React.useState<any>(null);

  React.useEffect(() => {
    loadAnalysis();
  }, [problemId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.analyzeMarket(problemId);
      setAnalysis(data);
    } catch (err) {
      setError('Error al cargar el análisis de mercado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando análisis de mercado...</Text>
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

  if (!analysis) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">Análisis de Mercado</Text>
        
        <View style={styles.section}>
          <Text variant="titleMedium">Tamaño del Mercado</Text>
          <Text variant="bodyLarge">${analysis.market_size.toLocaleString()}</Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">Potencial de Mercado</Text>
          <ProgressBar
            progress={analysis.market_potential / 100}
            style={styles.progressBar}
          />
          <Text variant="bodyMedium">{analysis.market_potential}%</Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">Nivel de Urgencia</Text>
          <ProgressBar
            progress={analysis.urgency_level / 5}
            style={styles.progressBar}
          />
          <Text variant="bodyMedium">{analysis.urgency_level}/5</Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">Complejidad de Implementación</Text>
          <ProgressBar
            progress={analysis.implementation_complexity / 5}
            style={styles.progressBar}
          />
          <Text variant="bodyMedium">{analysis.implementation_complexity}/5</Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium">ROI Estimado</Text>
          <Text variant="bodyLarge">{analysis.roi_estimate}%</Text>
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