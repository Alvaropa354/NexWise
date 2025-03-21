import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { ProblemLifecycleStatus } from '../problemLifecycle/ProblemLifecycleStatus';
import { useRouter } from 'expo-router';

interface ProblemDetailsProps {
  problemId: string;
  title: string;
  description: string;
  sector: string;
  impactLevel: number;
  urgencyLevel: number;
  potentialScore: number;
  price: number;
  isVerified: boolean;
}

export const ProblemDetails: React.FC<ProblemDetailsProps> = ({
  problemId,
  title,
  description,
  sector,
  impactLevel,
  urgencyLevel,
  potentialScore,
  price,
  isVerified
}) => {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verificado</Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{description}</Text>

          <Divider style={styles.divider} />

          <View style={styles.metricsContainer}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Sector</Text>
              <Text style={styles.metricValue}>{sector}</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Nivel de Impacto</Text>
              <Text style={styles.metricValue}>{impactLevel}/10</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Nivel de Urgencia</Text>
              <Text style={styles.metricValue}>{urgencyLevel}/5</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Potencial</Text>
              <Text style={styles.metricValue}>{potentialScore}%</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Precio</Text>
              <Text style={styles.metricValue}>${price}</Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={() => router.push(`/problems/${problemId}/market-study`)}
            style={styles.button}
          >
            Ver Estudio de Mercado
          </Button>
        </Card.Content>
      </Card>

      <ProblemLifecycleStatus problemId={problemId} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#03DAC6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  metricsContainer: {
    gap: 12,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
  },
}); 