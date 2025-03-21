import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { marketStudiesService } from '../../services/marketStudies';

interface EntryBarriersProps {
  studyId: string;
}

export function EntryBarriers({ studyId }: EntryBarriersProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [barriers, setBarriers] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadBarriers();
  }, [studyId]);

  const loadBarriers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketStudiesService.getEntryBarriers(studyId);
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
        {barriers.length === 0 ? (
          <Text style={styles.emptyText}>No se han identificado barreras de entrada</Text>
        ) : (
          barriers.map((barrier) => (
            <Card key={barrier.id} style={styles.barrierCard}>
              <Card.Content>
                <Text variant="titleMedium">{barrier.type}</Text>
                <Text variant="bodyMedium" style={styles.description}>
                  {barrier.description}
                </Text>
                
                <View style={styles.impactContainer}>
                  <Text variant="bodySmall">Nivel de Impacto</Text>
                  <ProgressBar
                    progress={barrier.impact_level / 5}
                    style={styles.progressBar}
                  />
                  <Text variant="bodySmall">{barrier.impact_level}/5</Text>
                </View>

                <View style={styles.strategiesContainer}>
                  <Text variant="titleSmall">Estrategias de Mitigación</Text>
                  {barrier.mitigation_strategies.map((strategy: string, index: number) => (
                    <List.Item
                      key={index}
                      title={strategy}
                      left={props => <List.Icon {...props} icon="lightbulb" />}
                    />
                  ))}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  barrierCard: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
  },
  impactContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  strategiesContainer: {
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#757575',
  },
  error: {
    color: 'red',
  },
}); 