import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, Avatar } from 'react-native-paper';
import { incentivesService } from '../../services/incentives';
import { useAuth } from '../../hooks/useAuth';

export function PopularityBonuses() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [bonuses, setBonuses] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (user?.id) {
      loadBonuses();
    }
  }, [user?.id]);

  const loadBonuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incentivesService.getPopularityBonuses(user!.id);
      setBonuses(data);
    } catch (err) {
      setError('Error al cargar las bonificaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando bonificaciones...</Text>
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
        <Text variant="titleLarge">Bonificaciones por Popularidad</Text>
        {bonuses.length === 0 ? (
          <Text style={styles.emptyText}>No tienes bonificaciones disponibles</Text>
        ) : (
          bonuses.map((bonus) => (
            <List.Item
              key={bonus.id}
              title={`${bonus.bonus_amount}€`}
              description={bonus.reason}
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="star"
                  style={styles.bonusIcon}
                />
              )}
              right={props => (
                <Text {...props} style={styles.dateText}>
                  {new Date(bonus.created_at).toLocaleDateString()}
                </Text>
              )}
            />
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
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#757575',
  },
  bonusIcon: {
    backgroundColor: '#FFD700',
  },
  dateText: {
    color: '#757575',
    fontSize: 12,
  },
  error: {
    color: 'red',
  },
}); 