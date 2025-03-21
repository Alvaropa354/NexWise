import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { supabase, testAPI } from '../services/supabase';
import { Link, useRouter } from 'expo-router';

// Modo de prueba para desarrollo
const TEST_MODE = true; // Debe coincidir con el valor en supabase.ts

export default function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProblems();
  }, []);

  async function fetchProblems() {
    setLoading(true);
    try {
      let result;
      
      if (TEST_MODE) {
        // Usar API de prueba
        result = await testAPI.getProblems();
      } else {
        // Usar Supabase real
        result = await supabase
          .from('problems')
          .select('*')
          .order('created_at', { ascending: false });
      }
      
      const { data, error } = result;
      
      if (error) throw error;
      setProblems(data || []);
    } catch (error) {
      console.error('Error fetching problems:', error.message);
      // Puedes mostrar un mensaje de error aquí
    } finally {
      setLoading(false);
    }
  }

  function renderProblemCard({ item }) {
    // Define el color según el nivel de urgencia
    const urgencyColor = 
      item.urgency_level >= 4 ? 'red' : 
      item.urgency_level >= 3 ? 'orange' : 
      'blue';
    
    return (
      <Card style={styles.card} onPress={() => router.push(`/(authenticated)/problem/${item.id}`)}>
        <Card.Content>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardDetails}>
            <Text>Sector: {item.sector}</Text>
            <Text>Impacto: {item.impact_level}/10</Text>
            <Text style={{ color: urgencyColor }}>
              Urgencia: {item.urgency_level}/5
            </Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => router.push(`/(authenticated)/problem/${item.id}`)}>
            Ver detalles
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando problemas...</Text>
        </View>
      ) : problems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay problemas disponibles</Text>
          <Button 
            mode="contained" 
            onPress={() => router.push('/(authenticated)/problem/new')}
            style={styles.createButton}
          >
            Crear Primer Problema
          </Button>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Problemas Destacados</Text>
          <Button 
            mode="contained" 
            icon="plus"
            onPress={() => router.push('/(authenticated)/problem/new')}
            style={styles.createButton}
          >
            Nueva Observación
          </Button>
          <FlatList
            data={problems}
            keyExtractor={(item) => item.id}
            renderItem={renderProblemCard}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={fetchProblems}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
  },
}); 