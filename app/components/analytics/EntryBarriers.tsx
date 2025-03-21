import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { analyticsService } from '../../services/analytics';

interface EntryBarriersProps {
  problemId: string;
}

export function EntryBarriers({ problemId }: EntryBarriersProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [barriers, setBarriers] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadBarriers();
  }, [problemId]);

  const loadBarriers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.analyzeEntryBarriers(problemId);
      setBarriers(data);
    } catch (err) {
      setError('Error al cargar las barreras de entrada');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando barreras de entrada...</Text>
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
        <Text variant="titleLarge">Barreras de Entrada</Text>
        
        {barriers.map((barrier, index) => (
          <View key={index} style={styles.barrierSection}>
            <Text variant="titleMedium">{barrier.barrier_type}</Text>
            
            <View style={styles.impactSection}>
              <Text variant="bodyMedium">Nivel de Impacto</Text>
              <ProgressBar
                progress={barrier.impact_level / 5}
                style={styles.progressBar}
              />
              <Text variant="bodyMedium">{barrier.impact_level}/5</Text>
            </View>

            <Text variant="bodyMedium" style={styles.description}>
              {barrier.description}
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
  barrierSection: {
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