import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  FAB,
  Portal,
  List,
  Appbar,
  Card,
  Divider,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FABContext } from '../../App';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const navigation = useNavigation();
  const [faqVisible, setFaqVisible] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const { fabState, showFAB, hideFAB } = useContext(FABContext);
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      showFAB('Onboarding', 'navigation');
      setFabOpen(false);
    });

    const blurSubscribe = navigation.addListener('blur', () => {
      hideFAB();
    });

    return () => {
      unsubscribe();
      blurSubscribe();
    };
  }, [navigation]);

  const navigateToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const navigateToSubscriptions = () => {
    navigation.navigate('Subscriptions');
  };

  const handleProfileNavigation = () => {
    navigation.navigate('Profile');
  };

  const navigateToObservations = () => {
    navigation.navigate('Dashboard');
  };

  const navigateToBusinessIdeas = () => {
    navigation.navigate('BusinessIdeas');
  };

  const navigateToNewObservation = () => {
    navigation.navigate('CreateProblem');
  };

  const testimonials = [
    {
      quote: "NexWise me ayudó a descubrir un nicho que duplicó mis ganancias.",
      author: "Emprendedor"
    },
    {
      quote: "La precisión de los análisis facilitó la expansión internacional de nuestra empresa.",
      author: "CEO TEC"
    }
  ];

  const faqs = [
    {
      question: "¿Cómo puedo saber si mi problema es relevante para NexWise?",
      answer: "NexWise utiliza inteligencia artificial para analizar cada observación y determinar su viabilidad, impacto y potencial. Si tienes una necesidad o identificas un desafío en cualquier sector, nuestra plataforma lo evaluará automáticamente para encontrar oportunidades estratégicas."
    },
    {
      question: "¿Necesito conocimientos técnicos para usar NexWise?",
      answer: "No, la plataforma está diseñada para ser intuitiva y fácil de usar. La inteligencia artificial y las herramientas automatizadas te guiarán en cada paso para optimizar la publicación de problemas y la identificación de soluciones."
    },
    {
      question: "¿Cuánto cuesta usar NexWise?",
      answer: "NexWise ofrece funciones básicas gratuitas y modelos de pago por acceso a análisis avanzados, estudios de mercado y oportunidades de negocio detalladas. También cuenta con planes de suscripción adaptados a diferentes necesidades."
    },
    {
      question: "¿Cómo puedo monetizar mis aportes en NexWise?",
      answer: "Si publicas una observación relevante y otros usuarios pagan para acceder a sus detalles, recibirás un porcentaje de los ingresos generados. Además, puedes ganar visibilidad como experto y conectar con inversores o colaboradores interesados en desarrollar soluciones."
    },
    {
      question: "¿Es seguro compartir información en NexWise?",
      answer: "Sí, NexWise implementa protocolos de cifrado avanzados y cumple con normativas internacionales de protección de datos. Además, puedes publicar de forma anónima si prefieres mantener la confidencialidad."
    },
    {
      question: "¿Qué tipo de análisis realiza NexWise sobre un problema?",
      answer: "La plataforma genera estudios de mercado personalizados, análisis de viabilidad, identificación de tendencias y comparación con competidores a nivel local, nacional e internacional."
    },
    {
      question: "¿Puedo eliminar mi cuenta y mis datos en cualquier momento?",
      answer: "Sí, puedes gestionar tu privacidad y eliminar tu cuenta cuando lo desees desde la configuración de usuario."
    },
    {
      question: "¿Qué sectores cubre NexWise?",
      answer: "NexWise abarca sectores como tecnología, salud, sostenibilidad, educación, turismo, agroindustria y más. Puedes personalizar tu experiencia según tus áreas de interés."
    },
    {
      question: "¿Cómo puedo reportar un problema técnico o hacer sugerencias?",
      answer: "Desde la configuración de la app encontrarás la opción de 'Reportar un problema' o 'Enviar sugerencias'. Nuestro equipo de soporte está disponible para atender cualquier inconveniente."
    },
    {
      question: "¿NexWise ofrece oportunidades para empresas y equipos?",
      answer: "Sí, las empresas pueden aprovechar planes personalizados, acceso a estudios estratégicos y API para integrar NexWise en sus operaciones de innovación."
    },
    {
      question: "¿Puedo acceder a NexWise desde cualquier país?",
      answer: "Sí, la plataforma es accesible globalmente y cuenta con herramientas de traducción para facilitar la colaboración internacional."
    }
  ];

  const onStateChange = ({ open }) => setFabOpen(open);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="NexWise" />
        <Appbar.Action icon="eye" onPress={() => navigation.navigate('Dashboard')} />
        <Appbar.Action icon="bell" onPress={navigateToNotifications} />
        <Appbar.Action icon="lightbulb" onPress={navigateToBusinessIdeas} />
        <Appbar.Action icon="crown" color="#FFD700" onPress={navigateToSubscriptions} />
        <Appbar.Action icon="account" onPress={handleProfileNavigation} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Bienvenido a NexWise
          </Text>
          <Text style={styles.heroSubtitle}>
            Descubre cómo puedes beneficiarte de nuestra plataforma
          </Text>
        </Surface>

        <List.Section>
          <List.Accordion
            title="¿Por qué elegir NexWise?"
            style={styles.accordion}>
            <View style={styles.content}>
              <Text style={styles.contentTitle}>Análisis Predictivo Avanzado</Text>
              <Text style={styles.contentText}>
                Ofrecemos análisis exhaustivos mediante IA avanzada, incluyendo:
                • Estudios de mercado potencial
                • Análisis competitivo dinámico
                • Predicción precisa de demanda
              </Text>

              <Text style={styles.contentTitle}>Accesibilidad Premium</Text>
              <Text style={styles.contentText}>
                Precios optimizados para emprendedores y PyMEs, garantizando acceso a información estratégica de alta calidad.
              </Text>

              <Text style={styles.contentTitle}>Retorno de Inversión</Text>
              <Text style={styles.contentText}>
                Accede a información estratégica con potencial de generar retornos significativamente superiores a la inversión inicial.
              </Text>
            </View>
          </List.Accordion>

          <List.Accordion
            title="Sistema de Recompensas"
            style={styles.accordion}>
            <View style={styles.content}>
              <Text style={styles.contentTitle}>Gana por Compartir</Text>
              <Text style={styles.contentText}>
                • 10% de comisión por observaciones de negocio
                • 20% de comisión por ideas de negocio completas
              </Text>

              <Text style={styles.contentTitle}>Ejemplo Práctico</Text>
              <Text style={styles.contentText}>
                Si 100 usuarios acceden a tu observación pagando $20 cada uno, recibirás $200 automáticamente.
              </Text>

              <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>
                  "Convierte tus experiencias en ingresos reales. Cada publicación puede ser una fuente continua de ingresos mientras ayudas a otros emprendedores."
                </Text>
              </View>
            </View>
          </List.Accordion>
        </List.Section>

        <Surface style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>¿Qué es NexWise?</Text>
          <Text style={styles.aboutText}>
            NexWise es una plataforma innovadora que conecta problemas reales con oportunidades de negocio mediante inteligencia artificial avanzada. Su objetivo principal es transformar necesidades identificadas en soluciones viables, optimizando la innovación y colaboración global.
          </Text>
          <Divider style={styles.divider} />
          <Text style={styles.differentiationText}>
            NexWise no solo identifica oportunidades, sino que también proporciona estudios de mercado personalizados, análisis competitivo profundo y recomendaciones estratégicas que permiten a sus usuarios adelantarse a las tendencias emergentes y diferenciarse claramente de su competencia.
          </Text>
        </Surface>

        <Surface style={styles.tutorialSection}>
          <Text style={styles.sectionTitle}>Guía Rápida</Text>
          <List.Section>
            <List.Item
              title="1. Regístrate"
              description="Define claramente tu perfil"
              left={props => <List.Icon {...props} icon="account-plus" />}
            />
            <List.Item
              title="2. Explica un problema"
              description="De manera específica y detallada"
              left={props => <List.Icon {...props} icon="pencil" />}
            />
            <List.Item
              title="3. Recibe análisis"
              description="Análisis automatizado de viabilidad y potencial"
              left={props => <List.Icon {...props} icon="chart-bar" />}
            />
            <List.Item
              title="4. Explora soluciones"
              description="Soluciones estratégicas y oportunidades recomendadas"
              left={props => <List.Icon {...props} icon="lightbulb" />}
            />
            <List.Item
              title="5. Conecta"
              description="Con expertos y emprendedores"
              left={props => <List.Icon {...props} icon="account-group" />}
            />
          </List.Section>
        </Surface>

        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>Testimonios</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {testimonials.map((testimonial, index) => (
              <Surface key={index} style={styles.testimonialCard}>
                <Text style={styles.testimonialQuote}>{testimonial.quote}</Text>
                <Text style={styles.testimonialAuthor}>- {testimonial.author}</Text>
              </Surface>
            ))}
          </ScrollView>
        </View>

        <Surface style={styles.reasonsSection}>
          <Text style={styles.sectionTitle}>¿Por qué elegir NexWise?</Text>
          <View style={styles.reasonsList}>
            <Card style={styles.reasonCard}>
              <Card.Content>
                <Text style={styles.reasonTitle}>Rentabilidad Comprobada</Text>
                <Text style={styles.reasonDescription}>
                  Convierte desafíos cotidianos en fuentes reales de ingresos
                </Text>
              </Card.Content>
            </Card>
            <Card style={styles.reasonCard}>
              <Card.Content>
                <Text style={styles.reasonTitle}>Facilidad de Uso</Text>
                <Text style={styles.reasonDescription}>
                  Acceso inmediato a información estratégica sin grandes inversiones
                </Text>
              </Card.Content>
            </Card>
            <Card style={styles.reasonCard}>
              <Card.Content>
                <Text style={styles.reasonTitle}>Innovación Constante</Text>
                <Text style={styles.reasonDescription}>
                  Actualización continua mediante inteligencia artificial avanzada
                </Text>
              </Card.Content>
            </Card>
          </View>
        </Surface>

        <Surface style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
          <List.Section>
            {faqs.map((faq, index) => (
              <List.Accordion
                key={index}
                title={faq.question}
                style={styles.faqItem}
              >
                <List.Item
                  description={faq.answer}
                  descriptionNumberOfLines={0}
                  style={styles.faqAnswer}
                />
              </List.Accordion>
            ))}
          </List.Section>
        </Surface>
      </ScrollView>

      <Portal>
        <FAB.Group
          open={fabOpen}
          visible={fabState.screen === 'Onboarding' && fabState.type === 'navigation'}
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'lightbulb',
              label: 'Ideas de Negocio',
              onPress: () => {
                hideFAB();
                navigation.navigate('BusinessIdeas');
              },
            },
            {
              icon: 'eye',
              label: 'Observaciones',
              onPress: () => {
                hideFAB();
                navigation.navigate('Dashboard');
              },
            }
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (fabOpen) {
              setFabOpen(false);
            }
          }}
          style={styles.fab}
        />
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    backgroundColor: '#fff',
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a237e',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  accordion: {
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  content: {
    padding: 16,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  highlightBox: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  highlightText: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  aboutSection: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#424242',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  differentiationText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#424242',
  },
  tutorialSection: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  testimonialsSection: {
    padding: 16,
  },
  testimonialCard: {
    width: width * 0.8,
    padding: 16,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  testimonialQuote: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
    color: '#424242',
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  reasonsSection: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  reasonsList: {
    marginTop: 8,
  },
  reasonCard: {
    marginBottom: 16,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a237e',
  },
  reasonDescription: {
    fontSize: 14,
    color: '#616161',
  },
  faqSection: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  faqItem: {
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
    borderRadius: 4,
  },
  faqAnswer: {
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 