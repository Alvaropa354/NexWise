import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, ActivityIndicator, Button } from 'react-native-paper';
import { monitoringService, SystemMetric, SystemAlert, PerformanceMetric } from '../../services/monitoring';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const SystemMetricsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metrics, systemAlerts, perfMetrics] = await Promise.all([
        monitoringService.getSystemMetrics(),
        monitoringService.getSystemAlerts(),
        monitoringService.getPerformanceMetrics()
      ]);

      setSystemMetrics(metrics);
      setAlerts(systemAlerts);
      setPerformanceMetrics(perfMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadData} style={styles.retryButton}>
          Reintentar
        </Button>
      </View>
    );
  }

  const chartData = {
    labels: systemMetrics.slice(-7).map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [{
      data: systemMetrics.slice(-7).map(m => m.metricValue)
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Métricas del Sistema</Title>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Alertas Activas</Title>
          {alerts.filter(a => a.status === 'active').map(alert => (
            <View key={alert.id} style={styles.alertItem}>
              <Text style={[styles.alertSeverity, { color: getSeverityColor(alert.severity) }]}>
                {alert.severity.toUpperCase()}
              </Text>
              <Text>{alert.message}</Text>
              <Text style={styles.alertTime}>
                {new Date(alert.createdAt).toLocaleString()}
              </Text>
              <Button
                mode="outlined"
                onPress={() => monitoringService.resolveSystemAlert(alert.id)}
                style={styles.resolveButton}
              >
                Resolver
              </Button>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Rendimiento</Title>
          {performanceMetrics.slice(0, 5).map(metric => (
            <View key={metric.id} style={styles.performanceItem}>
              <Text>{metric.endpoint || 'Endpoint no especificado'}</Text>
              <Text>Tiempo de respuesta: {metric.responseTime}ms</Text>
              <Text style={getStatusCodeStyle(metric.statusCode)}>
                Estado: {metric.statusCode}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return '#ff3b30';
    case 'high':
      return '#ff9500';
    case 'medium':
      return '#ffcc00';
    case 'low':
      return '#34c759';
    default:
      return '#8e8e93';
  }
};

const getStatusCodeStyle = (statusCode?: number): { color: string } => {
  if (!statusCode) return { color: '#8e8e93' };
  
  if (statusCode >= 200 && statusCode < 300) {
    return { color: '#34c759' };
  } else if (statusCode >= 300 && statusCode < 400) {
    return { color: '#ffcc00' };
  } else if (statusCode >= 400 && statusCode < 500) {
    return { color: '#ff9500' };
  } else {
    return { color: '#ff3b30' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  alertItem: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  alertSeverity: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 4,
  },
  resolveButton: {
    marginTop: 8,
  },
  performanceItem: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
}); 