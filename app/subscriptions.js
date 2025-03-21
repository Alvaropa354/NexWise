import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Text, Button, Card, Chip, Divider, Switch, ActivityIndicator, Surface, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';

// Planes de suscripción según el Context.md del cliente
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Básico',
    monthlyPrice: 15,
    annualPrice: 10,
    features: [
      'Acceso mensual limitado a problemas estándar dentro de sectores seleccionados',
      'Informes generales sobre tendencias del mercado',
      'Alertas sobre oportunidades populares en tu sector',
      'Búsquedas básicas por sector y palabras clave',
      'Soporte por correo electrónico',
    ],
    badge: '',
    color: '#2196F3',
  },
  {
    id: 'advanced',
    name: 'Avanzado',
    monthlyPrice: 50,
    annualPrice: 25,
    features: [
      'Acceso mensual ilimitado a problemas destacados y populares',
      'Estudios avanzados con análisis predictivo generado por IA',
      'Alertas personalizadas sobre oportunidades relevantes',
      'Búsquedas avanzadas con filtros detallados',
      'Análisis competitivo de mercado',
      'Soporte prioritario 24/5',
      'Exportación de datos en múltiples formatos',
    ],
    badge: 'Más Popular',
    color: '#FF9800',
  },
  {
    id: 'corporate',
    name: 'Corporativo',
    monthlyPrice: 'Personalizado',
    annualPrice: 'Personalizado',
    features: [
      'Acceso completo e ilimitado a todos los sectores y problemas',
      'Informes estratégicos personalizados para necesidades empresariales',
      'Análisis profundos adaptados a su industria',
      'Integración con sistemas empresariales',
      'Panel de control personalizado para equipos',
      'Gerente de cuenta dedicado',
      'Formación y soporte premium 24/7',
      'API de acceso a datos',
    ],
    badge: 'Empresas',
    color: '#4CAF50',
  }
];

export default function SubscriptionsScreen({ navigation }) {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' | 'monthly'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simular carga de la suscripción actual del usuario
  useEffect(() => {
    // Aquí se cargaría la suscripción actual del usuario desde el backend
  }, []);
  
  // Función para manejar la selección de un plan
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };
  
  // Función para manejar la suscripción
  const handleSubscribe = async (plan) => {
    try {
      setLoading(true);
      
      // Simulamos la petición al backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (plan.id === 'corporate') {
        Alert.alert(
          "Contáctanos",
          "Para el plan Corporativo, nuestro equipo de ventas se pondrá en contacto contigo para brindarte un presupuesto personalizado.",
          [{ text: "Entendido", onPress: () => setLoading(false) }]
        );
      } else {
        Alert.alert(
          "Suscripción realizada",
          `¡Felicidades! Te has suscrito al plan ${plan.name} con facturación ${billingCycle === 'annual' ? 'anual' : 'mensual'}.`,
          [{ text: "Continuar", onPress: () => {
            setLoading(false);
            navigation.navigate('Dashboard');
          }}]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Ha ocurrido un error al procesar tu suscripción. Por favor, intenta de nuevo.");
      setLoading(false);
    }
  };
  
  // Renderizar un elemento de característica
  const renderFeature = (text, isPrimary = false) => (
    <View style={styles.featureItem} key={text}>
      <Ionicons 
        name="checkmark-circle" 
        size={18} 
        color={isPrimary ? '#4CAF50' : '#2196F3'} 
        style={styles.featureIcon} 
      />
      <Text style={[styles.featureText, isPrimary && styles.featurePrimaryText]}>
        {text}
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Suscripciones" />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Potencia tu Acceso a Oportunidades</Text>
          <Text style={styles.subtitle}>
            Encuentra el plan que mejor se adapte a tus necesidades para descubrir nuevas oportunidades de negocio.
          </Text>
        </View>
        
        <View style={styles.billingToggle}>
          <Text style={[
            styles.billingOption, 
            billingCycle === 'annual' && styles.billingOptionActive
          ]}>
            Facturación Anual
          </Text>
          <Switch
            value={billingCycle === 'monthly'}
            onValueChange={(value) => setBillingCycle(value ? 'monthly' : 'annual')}
            color="#2196F3"
          />
          <Text style={[
            styles.billingOption, 
            billingCycle === 'monthly' && styles.billingOptionActive
          ]}>
            Facturación Mensual
          </Text>
        </View>
        
        <View style={styles.savingsBanner}>
          <Ionicons name="star" size={16} color="#FFC107" style={{marginRight: 8}} />
          <Text style={styles.savingsBannerText}>
            Ahorra hasta un 50% con la facturación anual
          </Text>
        </View>
        
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlanCard,
              { borderColor: plan.color, borderWidth: selectedPlan === plan.id ? 2 : 0 }
            ]}
            onPress={() => handleSelectPlan(plan.id)}
          >
            {plan.badge && (
              <Chip style={[styles.badgeChip, {backgroundColor: plan.color}]} textStyle={{color: 'white'}}>
                {plan.badge}
              </Chip>
            )}
            
            <Card.Content>
              <Text style={styles.planName}>{plan.name}</Text>
              
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>$</Text>
                <Text style={styles.price}>
                  {billingCycle === 'annual' 
                    ? (typeof plan.annualPrice === 'number' ? plan.annualPrice : plan.annualPrice) 
                    : (typeof plan.monthlyPrice === 'number' ? plan.monthlyPrice : plan.monthlyPrice)
                  }
                </Text>
                {typeof plan.monthlyPrice === 'number' && (
                  <Text style={styles.pricePeriod}>
                    {billingCycle === 'annual' ? '/mes (facturado anualmente)' : '/mes'}
                  </Text>
                )}
              </View>
              
              <Divider style={styles.divider} />
              
              <Text style={styles.featuresTitle}>Características:</Text>
              
              {plan.features.map((feature, index) => 
                renderFeature(feature, index === 0)
              )}
              
              <Button 
                mode="contained" 
                style={[styles.subscribeButton, {backgroundColor: plan.color}]}
                labelStyle={styles.buttonLabel}
                onPress={() => handleSubscribe(plan)}
                disabled={loading}
                loading={loading && selectedPlan === plan.id}
              >
                {plan.id === 'corporate' ? 'Solicitar Información' : 'Suscribirse Ahora'}
              </Button>
            </Card.Content>
          </Card>
        ))}
        
        <View style={styles.guaranteeContainer}>
          <Ionicons name="shield-checkmark" size={24} color="#4CAF50" style={styles.guaranteeIcon} />
          <Text style={styles.guaranteeText}>
            Garantía de devolución del dinero de 30 días. Cancela en cualquier momento.
          </Text>
        </View>
        
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Preguntas Frecuentes</Text>
          
          <Surface style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Puedo cambiar de plan en cualquier momento?</Text>
            <Text style={styles.faqAnswer}>
              Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán inmediatamente.
            </Text>
          </Surface>
          
          <Surface style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Qué métodos de pago aceptan?</Text>
            <Text style={styles.faqAnswer}>
              Aceptamos todas las tarjetas de crédito principales (Visa, Mastercard, American Express) y PayPal.
            </Text>
          </Surface>
          
          <Surface style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Cómo puedo cancelar mi suscripción?</Text>
            <Text style={styles.faqAnswer}>
              Puedes cancelar tu suscripción en cualquier momento desde la sección de "Mi Cuenta". La cancelación se hará efectiva al final del período de facturación actual.
            </Text>
          </Surface>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  billingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  billingOption: {
    fontSize: 14,
    marginHorizontal: 8,
    color: '#666',
  },
  billingOptionActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E1',
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  savingsBannerText: {
    color: '#F57C00',
    fontSize: 14,
  },
  planCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
  },
  selectedPlanCard: {
    elevation: 5,
  },
  badgeChip: {
    position: 'absolute',
    top: -12,
    right: 20,
    zIndex: 1,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 15,
  },
  currency: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    marginLeft: 5,
  },
  divider: {
    marginVertical: 15,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  featurePrimaryText: {
    fontWeight: 'bold',
    color: '#333',
  },
  subscribeButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  guaranteeIcon: {
    marginRight: 10,
  },
  guaranteeText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  faqContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  faqItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
  },
}); 