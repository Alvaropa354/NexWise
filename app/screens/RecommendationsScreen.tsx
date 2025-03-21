import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { RecommendationsDashboard } from '../components/recommendations/RecommendationsDashboard';
import { useAuth } from '../hooks/useAuth';

export const RecommendationsScreen: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Debes iniciar sesión para ver tus recomendaciones</Text>
      </View>
    );
  }

  return <RecommendationsDashboard userId={user.id} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
}); 