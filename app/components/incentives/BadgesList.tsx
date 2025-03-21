import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Avatar, ProgressBar } from 'react-native-paper';
import { incentivesService } from '../../services/incentives';
import { useAuth } from '../../hooks/useAuth';

export function BadgesList() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [badges, setBadges] = React.useState<any[]>([]);
  const [allBadges, setAllBadges] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (user?.id) {
      loadBadges();
    }
  }, [user?.id]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userBadges, allBadgesData] = await Promise.all([
        incentivesService.getUserBadges(user!.id),
        incentivesService.getBadges()
      ]);
      setBadges(userBadges);
      setAllBadges(allBadgesData);
    } catch (err) {
      setError('Error al cargar las insignias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando insignias...</Text>
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

  const earnedBadgeIds = new Set(badges.map(badge => badge.id));

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Insignias</Text>
          <View style={styles.badgesContainer}>
            {allBadges.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id);
              return (
                <Card key={badge.id} style={[styles.badgeCard, !isEarned && styles.lockedBadge]}>
                  <Card.Content style={styles.badgeContent}>
                    <Avatar.Icon
                      size={48}
                      icon={badge.icon_url || 'star'}
                      style={[styles.badgeIcon, !isEarned && styles.lockedIcon]}
                    />
                    <Text variant="titleMedium" style={styles.badgeName}>
                      {badge.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.badgeDescription}>
                      {badge.description}
                    </Text>
                    <View style={styles.pointsContainer}>
                      <Text variant="bodySmall" style={styles.pointsText}>
                        {badge.points} puntos
                      </Text>
                      <ProgressBar
                        progress={isEarned ? 1 : 0}
                        style={styles.progressBar}
                      />
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  badgeCard: {
    width: '48%',
    marginBottom: 16,
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeContent: {
    alignItems: 'center',
  },
  badgeIcon: {
    backgroundColor: '#6200ee',
  },
  lockedIcon: {
    backgroundColor: '#757575',
  },
  badgeName: {
    marginTop: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    textAlign: 'center',
    marginTop: 4,
  },
  pointsContainer: {
    width: '100%',
    marginTop: 8,
  },
  pointsText: {
    textAlign: 'center',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  error: {
    color: 'red',
  },
}); 