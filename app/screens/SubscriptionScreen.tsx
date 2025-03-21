import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, List } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { stripeService } from '../services/stripe';

const SUBSCRIPTION_PLANS = [
  {
    id: 'price_basic',
    name: 'Básico',
    price: 10,
    features: [
      'Acceso limitado a problemas estándar',
      'Informes generales de tendencias',
      'Soporte por correo electrónico'
    ]
  },
  {
    id: 'price_advanced',
    name: 'Avanzado',
    price: 25,
    features: [
      'Acceso ilimitado a problemas destacados',
      'Estudios avanzados con análisis predictivo',
      'Soporte prioritario',
      'Acceso a contenido exclusivo'
    ]
  },
  {
    id: 'price_enterprise',
    name: 'Corporativo',
    price: 50,
    features: [
      'Acceso completo e ilimitado',
      'Informes estratégicos personalizados',
      'Soporte dedicado 24/7',
      'API personalizada',
      'Entrenamiento personalizado'
    ]
  }
];

export function SubscriptionScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  useEffect(() => {
    loadCurrentSubscription();
  }, []);

  const loadCurrentSubscription = async () => {
    try {
      setLoading(true);
      // Aquí iría la lógica para cargar la suscripción actual
      // Por ahora, simulamos que no hay suscripción
      setCurrentSubscription(null);
    } catch (err) {
      setError('Error al cargar la suscripción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Crear método de pago
      const paymentMethod = await stripeService.createPaymentMethod({
        number: '4242424242424242', // Tarjeta de prueba
        expMonth: 12,
        expYear: 2025,
        cvc: '123'
      });

      // Crear suscripción
      const subscription = await stripeService.createSubscription(
        user!.id,
        planId,
        paymentMethod.id
      );

      setCurrentSubscription(subscription);
    } catch (err) {
      setError('Error al procesar la suscripción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await stripeService.cancelSubscription(currentSubscription.id);
      setCurrentSubscription(null);
    } catch (err) {
      setError('Error al cancelar la suscripción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      {currentSubscription ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Suscripción Actual</Text>
            <Text variant="bodyMedium">
              Plan: {currentSubscription.plan_type}
            </Text>
            <Text variant="bodyMedium">
              Estado: {currentSubscription.status}
            </Text>
            <Button
              mode="outlined"
              onPress={handleCancelSubscription}
              style={styles.button}
            >
              Cancelar Suscripción
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <>
          <Text variant="titleLarge" style={styles.title}>
            Planes de Suscripción
          </Text>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card
              key={plan.id}
              style={[
                styles.card,
                selectedPlan === plan.id && styles.selectedCard
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <Card.Content>
                <Text variant="titleMedium">{plan.name}</Text>
                <Text variant="headlineMedium">${plan.price}/mes</Text>
                <List.Section>
                  {plan.features.map((feature, index) => (
                    <List.Item
                      key={index}
                      title={feature}
                      left={props => <List.Icon {...props} icon="check" />}
                    />
                  ))}
                </List.Section>
                <Button
                  mode="contained"
                  onPress={() => handleSubscribe(plan.id)}
                  style={styles.button}
                >
                  Suscribirse
                </Button>
              </Card.Content>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  selectedCard: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 