import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, ProgressBar } from 'react-native-paper';
import { marketStudiesService } from '../../services/marketStudies';

interface LocationRecommendationsProps {
  studyId: string;
}

export function LocationRecommendations({ studyId }: LocationRecommendationsProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [locations, setLocations] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadLocations();
  }, [studyId]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketStudiesService.getLocationRecommendations(studyId);
      setLocations(data);
    } catch (err) {
      setError('Error al cargar las recomendaciones de localización');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando recomendaciones de localización...</Text>
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
        <Text variant="titleLarge">Recomendaciones de Localización</Text>
        {locations.length === 0 ? (
          <Text style={styles.emptyText}>No hay recomendaciones de localización disponibles</Text>
        ) : (
          locations.map((location) => (
            <Card key={location.id} style={styles.locationCard}>
              <Card.Content>
                <Text variant="titleMedium">{location.location}</Text>
                
                <View style={styles.potentialContainer}>
                  <Text variant="bodySmall">Potencial de Mercado</Text>
                  <ProgressBar
                    progress={location.market_potential / 100}
                    style={styles.progressBar}
                  />
                  <Text variant="bodySmall">{location.market_potential}%</Text>
                </View>

                <View style={styles.advantagesContainer}>
                  <Text variant="titleSmall">Ventajas</Text>
                  {location.advantages.map((advantage: string, index: number) => (
                    <List.Item
                      key={index}
                      title={advantage}
                      left={props => <List.Icon {...props} icon="check-circle" />}
                    />
                  ))}
                </View>

                <View style={styles.disadvantagesContainer}>
                  <Text variant="titleSmall">Desventajas</Text>
                  {location.disadvantages.map((disadvantage: string, index: number) => (
                    <List.Item
                      key={index}
                      title={disadvantage}
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
  locationCard: {
    marginTop: 16,
  },
  potentialContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  advantagesContainer: {
    marginTop: 16,
  },
  disadvantagesContainer: {
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