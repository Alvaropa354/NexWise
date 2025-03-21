import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, Button, Chip } from 'react-native-paper';
import { incentivesService } from '../../services/incentives';
import { useAuth } from '../../hooks/useAuth';

export function SpecialEvents() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [events, setEvents] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incentivesService.getSpecialEvents();
      setEvents(data);
    } catch (err) {
      setError('Error al cargar los eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      if (user?.id) {
        await incentivesService.joinEvent(eventId, user.id);
        // Recargar eventos para actualizar el estado
        loadEvents();
      }
    } catch (err) {
      console.error('Error al unirse al evento:', err);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando eventos...</Text>
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
        <Text variant="titleLarge">Eventos Especiales</Text>
        {events.length === 0 ? (
          <Text style={styles.emptyText}>No hay eventos activos</Text>
        ) : (
          events.map((event) => (
            <Card key={event.id} style={styles.eventCard}>
              <Card.Content>
                <Text variant="titleMedium">{event.name}</Text>
                <Text variant="bodyMedium" style={styles.eventDescription}>
                  {event.description}
                </Text>
                <View style={styles.dateContainer}>
                  <Text variant="bodySmall">
                    Inicio: {new Date(event.start_date).toLocaleDateString()}
                  </Text>
                  <Text variant="bodySmall">
                    Fin: {new Date(event.end_date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.rewardsContainer}>
                  <Text variant="bodySmall" style={styles.rewardsTitle}>
                    Recompensas:
                  </Text>
                  {Object.entries(event.rewards).map(([key, value]) => (
                    <Chip key={key} style={styles.rewardChip}>
                      {key}: {value}
                    </Chip>
                  ))}
                </View>
                <Button
                  mode="contained"
                  onPress={() => handleJoinEvent(event.id)}
                  style={styles.joinButton}
                >
                  Unirse al Evento
                </Button>
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
  eventCard: {
    marginTop: 16,
  },
  eventDescription: {
    marginTop: 8,
  },
  dateContainer: {
    marginTop: 8,
  },
  rewardsContainer: {
    marginTop: 16,
  },
  rewardsTitle: {
    marginBottom: 8,
  },
  rewardChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  joinButton: {
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