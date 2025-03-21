import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MarketProductsList } from './MarketProductsList';
import { ProductComparisons } from './ProductComparisons';
import { InnovationProposals } from './InnovationProposals';
import { marketProductsService } from '../../services/marketProducts';

interface MarketProductsDashboardProps {
  problemId: string;
}

export function MarketProductsDashboard({ problemId }: MarketProductsDashboardProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      await marketProductsService.generateMarketProductsAnalysis(problemId);
    } catch (err) {
      setError('Error al generar el análisis de productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando análisis de productos...</Text>
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Análisis de Productos de Mercado</Text>
        <Button
          mode="contained"
          onPress={handleGenerateAnalysis}
          style={styles.generateButton}
        >
          Generar Análisis
        </Button>
      </View>

      <MarketProductsList problemId={problemId} />
      
      {selectedProductId && (
        <>
          <ProductComparisons productId={selectedProductId} />
          <InnovationProposals productId={selectedProductId} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  generateButton: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
}); 