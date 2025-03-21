import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { analyticsService } from '../../services/analytics';

interface SectorTrendsProps {
  problemId: string;
}

export function SectorTrends({ problemId }: SectorTrendsProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [trends, setTrends] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadTrends();
  }, [problemId]);

  const loadTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.analyzeSectorTrends(problemId);
      setTrends(data);
    } catch (err) {
      setError('Error al cargar las tendencias del sector');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando tendencias del sector...</Text>
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

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">Tendencias del Sector</Text>
        
        {trends.map((trend, index) => (
          <View key={index} style={styles.trendSection}>
            <Text variant="titleMedium">{trend.trend_name}</Text>
            
            <View style={styles.impactSection}>
              <Text variant="bodyMedium">Nivel de Impacto</Text>
              <ProgressBar
                progress={trend.impact_level / 5}
                style={styles.progressBar}
              />
              <Text variant="bodyMedium">{trend.impact_level}/5</Text>
            </View>

            <Text variant="bodyMedium" style={styles.description}>
              {trend.description}
            </Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  trendSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  impactSection: {
    marginTop: 8,
  },
  progressBar: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    marginTop: 8,
  },
  error: {
    color: 'red',
  },
}); 