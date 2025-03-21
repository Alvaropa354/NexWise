import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { marketProductsService } from '../../services/marketProducts';

interface ProductComparisonsProps {
  productId: string;
}

export function ProductComparisons({ productId }: ProductComparisonsProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [comparisons, setComparisons] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadComparisons();
  }, [productId]);

  const loadComparisons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketProductsService.getProductComparisons(productId);
      setComparisons(data);
    } catch (err) {
      setError('Error al cargar las comparaciones de producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando comparaciones de producto...</Text>
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
        <Text variant="titleLarge">Análisis Comparativo</Text>
        {comparisons.length === 0 ? (
          <Text style={styles.emptyText}>No hay comparaciones disponibles</Text>
        ) : (
          comparisons.map((comparison) => (
            <Card key={comparison.id} style={styles.comparisonCard}>
              <Card.Content>
                <Text variant="titleMedium">{comparison.feature_name}</Text>
                <Text variant="bodyMedium" style={styles.featureValue}>
                  {comparison.feature_value}
                </Text>
                
                <View style={styles.scoreContainer}>
                  <Text variant="bodySmall">Puntuación</Text>
                  <ProgressBar
                    progress={comparison.comparison_score / 5}
                    style={styles.progressBar}
                  />
                  <Text variant="bodySmall">{comparison.comparison_score}/5</Text>
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
  comparisonCard: {
    marginTop: 16,
  },
  featureValue: {
    marginTop: 8,
  },
  scoreContainer: {
    marginTop: 16,
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