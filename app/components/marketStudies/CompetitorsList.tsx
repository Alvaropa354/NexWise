import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { marketStudiesService } from '../../services/marketStudies';

interface CompetitorsListProps {
  studyId: string;
}

export function CompetitorsList({ studyId }: CompetitorsListProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [competitors, setCompetitors] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadCompetitors();
  }, [studyId]);

  const loadCompetitors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketStudiesService.getCompetitors(studyId);
      setCompetitors(data);
    } catch (err) {
      setError('Error al cargar los competidores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando competidores...</Text>
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
        <Text variant="titleLarge">Competidores Identificados</Text>
        {competitors.length === 0 ? (
          <Text style={styles.emptyText}>No se han identificado competidores</Text>
        ) : (
          competitors.map((competitor) => (
            <Card key={competitor.id} style={styles.competitorCard}>
              <Card.Content>
                <Text variant="titleMedium">{competitor.name}</Text>
                <Text variant="bodyMedium" style={styles.description}>
                  {competitor.description}
                </Text>
                
                <View style={styles.marketShareContainer}>
                  <Text variant="bodySmall">Cuota de Mercado</Text>
                  <ProgressBar
                    progress={competitor.market_share / 100}
                    style={styles.progressBar}
                  />
                  <Text variant="bodySmall">{competitor.market_share}%</Text>
                </View>

                <View style={styles.strengthsContainer}>
                  <Text variant="titleSmall">Fortalezas</Text>
                  {competitor.strengths.map((strength: string, index: number) => (
                    <List.Item
                      key={index}
                      title={strength}
                      left={props => <List.Icon {...props} icon="check-circle" />}
                    />
                  ))}
                </View>

                <View style={styles.weaknessesContainer}>
                  <Text variant="titleSmall">Debilidades</Text>
                  {competitor.weaknesses.map((weakness: string, index: number) => (
                    <List.Item
                      key={index}
                      title={weakness}
                      left={props => <List.Icon {...props} icon="close-circle" />}
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
  competitorCard: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
  },
  marketShareContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  strengthsContainer: {
    marginTop: 16,
  },
  weaknessesContainer: {
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