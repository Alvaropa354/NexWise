import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { analyticsService } from '../../services/analytics';

interface CompetitionAnalysisProps {
  problemId: string;
}

export function CompetitionAnalysis({ problemId }: CompetitionAnalysisProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [competitors, setCompetitors] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadAnalysis();
  }, [problemId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.analyzeCompetition(problemId);
      setCompetitors(data);
    } catch (err) {
      setError('Error al cargar el análisis de competencia');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando análisis de competencia...</Text>
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
        <Text variant="titleLarge">Análisis de Competencia</Text>
        
        {competitors.map((competitor, index) => (
          <View key={index} style={styles.competitorSection}>
            <Text variant="titleMedium">{competitor.competitor_name}</Text>
            
            <View style={styles.marketShareSection}>
              <Text variant="bodyMedium">Cuota de Mercado</Text>
              <ProgressBar
                progress={competitor.market_share / 100}
                style={styles.progressBar}
              />
              <Text variant="bodyMedium">{competitor.market_share}%</Text>
            </View>

            <View style={styles.strengthsSection}>
              <Text variant="bodyMedium">Fortalezas</Text>
              {competitor.strengths.map((strength: string, idx: number) => (
                <List.Item
                  key={idx}
                  title={strength}
                  left={props => <List.Icon {...props} icon="check" />}
                />
              ))}
            </View>

            <View style={styles.weaknessesSection}>
              <Text variant="bodyMedium">Debilidades</Text>
              {competitor.weaknesses.map((weakness: string, idx: number) => (
                <List.Item
                  key={idx}
                  title={weakness}
                  left={props => <List.Icon {...props} icon="close" />}
                />
              ))}
            </View>
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
  competitorSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  marketShareSection: {
    marginTop: 8,
  },
  progressBar: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
  },
  strengthsSection: {
    marginTop: 16,
  },
  weaknessesSection: {
    marginTop: 16,
  },
  error: {
    color: 'red',
  },
}); 