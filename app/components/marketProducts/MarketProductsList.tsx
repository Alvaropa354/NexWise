import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { marketProductsService } from '../../services/marketProducts';

interface MarketProductsListProps {
  problemId: string;
}

export function MarketProductsList({ problemId }: MarketProductsListProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadProducts();
  }, [problemId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketProductsService.getMarketProducts(problemId);
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los productos de mercado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando productos de mercado...</Text>
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
        <Text variant="titleLarge">Productos de Mercado</Text>
        {products.length === 0 ? (
          <Text style={styles.emptyText}>No se han identificado productos de mercado</Text>
        ) : (
          products.map((product) => (
            <Card key={product.id} style={styles.productCard}>
              <Card.Content>
                <Text variant="titleMedium">{product.name}</Text>
                <Text variant="bodyMedium" style={styles.company}>
                  {product.company}
                </Text>
                <Text variant="bodyMedium" style={styles.description}>
                  {product.description}
                </Text>
                
                <View style={styles.marketShareContainer}>
                  <Text variant="bodySmall">Cuota de Mercado</Text>
                  <ProgressBar
                    progress={product.market_share / 100}
                    style={styles.progressBar}
                  />
                  <Text variant="bodySmall">{product.market_share}%</Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text variant="bodySmall">Rango de Precios</Text>
                  <Text variant="bodyMedium">
                    {product.price_range.min} - {product.price_range.max} {product.price_range.currency}
                  </Text>
                </View>

                <View style={styles.featuresContainer}>
                  <Text variant="titleSmall">Características Principales</Text>
                  {Object.entries(product.features).map(([key, value]) => (
                    <List.Item
                      key={key}
                      title={key}
                      description={value as string}
                      left={props => <List.Icon {...props} icon="check-circle" />}
                    />
                  ))}
                </View>

                <View style={styles.limitationsContainer}>
                  <Text variant="titleSmall">Limitaciones</Text>
                  {product.limitations.map((limitation: string, index: number) => (
                    <List.Item
                      key={index}
                      title={limitation}
                      left={props => <List.Icon {...props} icon="alert-circle" />}
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
  productCard: {
    marginTop: 16,
  },
  company: {
    color: '#666',
    marginTop: 4,
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
  priceContainer: {
    marginTop: 16,
  },
  featuresContainer: {
    marginTop: 16,
  },
  limitationsContainer: {
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