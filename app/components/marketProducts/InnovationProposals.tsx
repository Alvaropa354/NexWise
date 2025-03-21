import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { marketProductsService } from '../../services/marketProducts';

interface InnovationProposalsProps {
  productId: string;
}

export function InnovationProposals({ productId }: InnovationProposalsProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [proposals, setProposals] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadProposals();
  }, [productId]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketProductsService.getInnovationProposals(productId);
      setProposals(data);
    } catch (err) {
      setError('Error al cargar las propuestas de innovación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando propuestas de innovación...</Text>
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
        <Text variant="titleLarge">Propuestas de Innovación</Text>
        {proposals.length === 0 ? (
          <Text style={styles.emptyText}>No hay propuestas de innovación disponibles</Text>
        ) : (
          proposals.map((proposal) => (
            <Card key={proposal.id} style={styles.proposalCard}>
              <Card.Content>
                <Text variant="titleMedium">{proposal.title}</Text>
                <Text variant="bodyMedium" style={styles.description}>
                  {proposal.description}
                </Text>
                
                <View style={styles.metricsContainer}>
                  <View style={styles.metric}>
                    <Text variant="bodySmall">Impacto Potencial</Text>
                    <ProgressBar
                      progress={proposal.potential_impact / 5}
                      style={styles.progressBar}
                    />
                    <Text variant="bodySmall">{proposal.potential_impact}/5</Text>
                  </View>

                  <View style={styles.metric}>
                    <Text variant="bodySmall">Complejidad de Implementación</Text>
                    <ProgressBar
                      progress={proposal.implementation_complexity / 5}
                      style={styles.progressBar}
                    />
                    <Text variant="bodySmall">{proposal.implementation_complexity}/5</Text>
                  </View>

                  <View style={styles.metric}>
                    <Text variant="bodySmall">Potencial de Mercado</Text>
                    <ProgressBar
                      progress={proposal.market_potential / 100}
                      style={styles.progressBar}
                    />
                    <Text variant="bodySmall">{proposal.market_potential}%</Text>
                  </View>
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
  proposalCard: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
  },
  metricsContainer: {
    marginTop: 16,
  },
  metric: {
    marginTop: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
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