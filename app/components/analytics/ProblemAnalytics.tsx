import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { MarketAnalysis } from './MarketAnalysis';
import { CompetitionAnalysis } from './CompetitionAnalysis';
import { DemandPrediction } from './DemandPrediction';
import { EntryBarriers } from './EntryBarriers';
import { SectorTrends } from './SectorTrends';
import { analyticsService } from '../../services/analytics';

interface ProblemAnalyticsProps {
  problemId: string;
}

export function ProblemAnalytics({ problemId }: ProblemAnalyticsProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [potential, setPotential] = React.useState<number | null>(null);

  React.useEffect(() => {
    loadPotential();
  }, [problemId]);

  const loadPotential = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getProblemPotential(problemId);
      setPotential(data);
    } catch (err) {
      setError('Error al cargar el potencial del problema');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
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
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Potencial Total del Problema</Text>
          <View style={styles.potentialSection}>
            <ProgressBar
              progress={potential ? potential / 100 : 0}
              style={styles.progressBar}
            />
            <Text variant="headlineMedium" style={styles.potentialValue}>
              {potential}%
            </Text>
          </View>
        </Card.Content>
      </Card>

      <MarketAnalysis problemId={problemId} />
      <CompetitionAnalysis problemId={problemId} />
      <DemandPrediction problemId={problemId} />
      <EntryBarriers problemId={problemId} />
      <SectorTrends problemId={problemId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  potentialSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 16,
    borderRadius: 8,
  },
  potentialValue: {
    marginTop: 8,
  },
  error: {
    color: 'red',
  },
}); 