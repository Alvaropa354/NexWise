import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, List, Divider } from 'react-native-paper';
import { problemLifecycleService, ProblemLifecycle, ProblemLifecycleHistory, ProblemMetrics } from '../../services/problemLifecycle';

interface ProblemLifecycleStatusProps {
  problemId: string;
}

const stageColors = {
  validation: '#FF6200',
  processing: '#03DAC6',
  publication: '#3700B3',
  monitoring: '#6200ee'
};

const stageLabels = {
  validation: 'Validación',
  processing: 'Procesamiento',
  publication: 'Publicación',
  monitoring: 'Seguimiento'
};

export const ProblemLifecycleStatus: React.FC<ProblemLifecycleStatusProps> = ({ problemId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lifecycle, setLifecycle] = useState<ProblemLifecycle | null>(null);
  const [history, setHistory] = useState<ProblemLifecycleHistory[]>([]);
  const [metrics, setMetrics] = useState<ProblemMetrics | null>(null);

  useEffect(() => {
    loadData();
  }, [problemId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lifecycleData, historyData, metricsData] = await Promise.all([
        problemLifecycleService.getProblemLifecycle(problemId),
        problemLifecycleService.getProblemLifecycleHistory(problemId),
        problemLifecycleService.getProblemMetrics(problemId)
      ]);

      setLifecycle(lifecycleData);
      setHistory(historyData);
      setMetrics(metricsData);
    } catch (err) {
      setError('Error al cargar el estado del ciclo de vida');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStageProgress = (stage: string) => {
    if (!lifecycle) return 0;
    const status = lifecycle[`${stage}Status` as keyof ProblemLifecycle];
    return status === 'completed' ? 1 : status === 'in_progress' ? 0.5 : 0;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando estado del ciclo de vida...</Text>
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

  if (!lifecycle) {
    return (
      <View style={styles.container}>
        <Text>No se encontró información del ciclo de vida</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Estado Actual</Text>
          <Text style={styles.subtitle}>Etapa: {stageLabels[lifecycle.currentStage as keyof typeof stageLabels]}</Text>

          <View style={styles.stagesContainer}>
            {Object.entries(stageLabels).map(([stage, label]) => (
              <View key={stage} style={styles.stage}>
                <Text style={styles.stageLabel}>{label}</Text>
                <ProgressBar
                  progress={getStageProgress(stage)}
                  color={stageColors[stage as keyof typeof stageColors]}
                  style={styles.progressBar}
                />
                <Text style={styles.stageStatus}>
                  {lifecycle[`${stage}Status` as keyof ProblemLifecycle]}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {metrics && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Métricas</Text>
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Vistas</Text>
                <Text style={styles.metricValue}>{metrics.viewsCount}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Interacciones</Text>
                <Text style={styles.metricValue}>{metrics.interactionsCount}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Engagement</Text>
                <ProgressBar
                  progress={metrics.engagementScore / 100}
                  color="#03DAC6"
                  style={styles.metricBar}
                />
                <Text style={styles.metricValue}>
                  {Math.round(metrics.engagementScore)}%
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Relevancia</Text>
                <ProgressBar
                  progress={metrics.relevanceScore / 100}
                  color="#3700B3"
                  style={styles.metricBar}
                />
                <Text style={styles.metricValue}>
                  {Math.round(metrics.relevanceScore)}%
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Historial</Text>
          {history.map((item) => (
            <React.Fragment key={item.id}>
              <List.Item
                title={stageLabels[item.stage as keyof typeof stageLabels]}
                description={`Estado: ${item.status}`}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={item.status === 'completed' ? 'check-circle' : 'clock-outline'}
                    color={item.status === 'completed' ? '#03DAC6' : '#FF6200'}
                  />
                )}
              />
              {item.details && (
                <View style={styles.detailsContainer}>
                  {Object.entries(item.details).map(([key, value]) => (
                    <Text key={key} style={styles.detail}>
                      {key}: {JSON.stringify(value)}
                    </Text>
                  ))}
                </View>
              )}
              <Divider style={styles.divider} />
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  stagesContainer: {
    gap: 12,
  },
  stage: {
    marginBottom: 8,
  },
  stageLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  stageStatus: {
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
  },
  metricsContainer: {
    gap: 16,
  },
  metric: {
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  metricValue: {
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '500',
  },
  metricBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },
  detailsContainer: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    marginBottom: 2,
  },
  divider: {
    marginVertical: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 