import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
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
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FABContext } from '../../App';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ title, description, image, index, totalScreens }) => {
  const theme = useTheme();
  
  return (
    <View style={styles.onboardingScreen}>
      <View style={styles.onboardingImageContainer}>
        <Image 
          source={{ uri: image }}
          style={styles.onboardingImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.onboardingContent}>
        <Text style={[styles.onboardingTitle, { color: theme.colors.primary }]}>{title}</Text>
        <Text style={styles.onboardingDescription}>{description}</Text>
        
        <View style={styles.paginationContainer}>
          {Array.from({ length: totalScreens }).map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.paginationDot, 
                { backgroundColor: i === index ? theme.colors.primary : '#E0E0E0' }
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default function Onboarding() {
  const navigation = useNavigation();
  const [faqVisible, setFaqVisible] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const { fabState, showFAB, hideFAB } = useContext(FABContext);
  const theme = useTheme();
  const [currentScreen, setCurrentScreen] = useState(0);
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onboardingScreens = [
    {
      title: "Descubre Oportunidades",
      description: "NexWise conecta problemas reales con oportunidades de negocio mediante inteligencia artificial avanzada.",
      image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80"
    },
    {
      title: "Analiza con IA",
      description: "Obtén análisis detallados de viabilidad, mercado y competencia para cada idea u observación.",
      image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80"
    },
    {
      title: "Monetiza tu Conocimiento",
      description: "Gana comisiones cuando otros usuarios acceden a tus observaciones e ideas de negocio.",
      image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80"
    }
  ];

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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

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

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      const nextScreen = currentScreen + 1;
      setCurrentScreen(nextScreen);
      scrollViewRef.current?.scrollTo({ x: nextScreen * width, animated: true });
    } else {
      // Navigate to dashboard or main screen
      navigation.navigate('Dashboard');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Dashboard');
  };

  const testimonials = [
    {
      quote: "NexWise me ayudó a descubrir un nicho que duplicó mis ganancias.",
      author: "Emprendedor",
      company: "Startup Tech",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    {
      quote: "La precisión de los análisis facilitó la expansión internacional de nuestra empresa.",
      author: "CEO",
      company: "Global Solutions",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
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
    }
  ];

  const onStateChange = ({ open }) => setFabOpen(open);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={[styles.appBar, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nexwise' }}
            style={styles.logo}
          />
          <Text style={[styles.logoText, { color: theme.colors.primary }]}>NexWise</Text>
        </View>
        <View style={styles.appBarActions}>
          <Appbar.Action icon="eye" color={theme.colors.primary} onPress={navigateToObservations} />
          <Appbar.Action icon="bell" color={theme.colors.primary} onPress={navigateToNotifications} />
          <Appbar.Action icon="lightbulb" color={theme.colors.primary} onPress={navigateToBusinessIdeas} />
          <Appbar.Action icon="account" color={theme.colors.primary} onPress={handleProfileNavigation} />
        </View>
      </Appbar.Header>

      {/* Onboarding Carousel */}
      <View style={styles.onboardingContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.onboardingScroll}
        >
          {onboardingScreens.map((screen, index) => (
            <OnboardingScreen
              key={index}
              title={screen.title}
              description={screen.description}
              image={screen.image}
              index={index}
              totalScreens={onboardingScreens.length}
            />
          ))}
        </Animated.ScrollView>
        
        <View style={styles.onboardingButtonsContainer}>
          <Button 
            mode="text" 
            onPress={handleSkip}
            style={styles.skipButton}
          >
            Saltar
          </Button>
          
          <Button 
            mode="contained" 
            onPress={handleNext}
            style={styles.nextButton}
            contentStyle={styles.nextButtonContent}
          >
            {currentScreen === onboardingScreens.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Button>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Surface style={[styles.section, styles.aboutSection]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>¿Qué es NexWise?</Text>
          <Text style={styles.sectionText}>
            NexWise es una plataforma innovadora que conecta problemas reales con oportunidades de negocio mediante inteligencia artificial avanzada. Su objetivo principal es transformar necesidades identificadas en soluciones viables, optimizando la innovación y colaboración global.
          </Text>
        </Surface>

        <Surface style={[styles.section, styles.featuresSection]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Características Principales</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <IconButton icon="brain" size={32} iconColor={theme.colors.primary} style={styles.featureIcon} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Análisis con IA</Text>
                <Text style={styles.featureDescription}>Análisis predictivo avanzado de mercados y tendencias</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <IconButton icon="chart-line" size={32} iconColor={theme.colors.primary} style={styles.featureIcon} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Estudios de Mercado</Text>
                <Text style={styles.featureDescription}>Datos precisos sobre competidores y oportunidades</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <IconButton icon="cash-multiple" size={32} iconColor={theme.colors.primary} style={styles.featureIcon} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Monetización</Text>
                <Text style={styles.featureDescription}>Gana comisiones por tus observaciones e ideas</Text>
              </View>
            </View>
          </View>
        </Surface>

        <Surface style={[styles.section, styles.testimonialsSection]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Testimonios</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsScroll}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} style={styles.testimonialCard}>
                <Card.Content>
                  <View style={styles.testimonialHeader}>
                    <Image 
                      source={{ uri: testimonial.avatar }}
                      style={styles.testimonialAvatar}
                    />
                    <View style={styles.testimonialAuthorInfo}>
                      <Text style={styles.testimonialAuthor}>{testimonial.author}</Text>
                      <Text style={styles.testimonialCompany}>{testimonial.company}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </Surface>

        <Surface style={[styles.section, styles.faqSection]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Preguntas Frecuentes</Text>
          
          {faqs.map((faq, index) => (
            <List.Accordion
              key={index}
              title={faq.question}
              titleStyle={styles.faqQuestion}
              style={styles.faqItem}
            >
              <View style={styles.faqAnswerContainer}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            </List.Accordion>
          ))}
          
          <Button 
            mode="outlined" 
            onPress={() => setFaqVisible(true)}
            style={styles.moreFaqButton}
            labelStyle={{ color: theme.colors.primary }}
          >
            Ver más preguntas
          </Button>
        </Surface>

        <View style={styles.getStartedSection}>
          <Text style={styles.getStartedTitle}>¿Listo para comenzar?</Text>
          <Button 
            mode="contained" 
            onPress={navigateToObservations}
            style={styles.getStartedButton}
            contentStyle={styles.getStartedButtonContent}
            labelStyle={styles.getStartedButtonLabel}
          >
            Explorar Observaciones
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={navigateToBusinessIdeas}
            style={styles.exploreIdeasButton}
            contentStyle={styles.getStartedButtonContent}
            labelStyle={{ color: theme.colors.primary }}
          >
            Ver Ideas de Negocio
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <FAB.Group
          open={fabOpen}
          visible={fabState.screen === 'Onboarding' && fabState.type === 'navigation'}
          icon={fabOpen ? 'close' : 'plus'}
          fabStyle={{ backgroundColor: theme.colors.primary }}
          actions={[
            {
              icon: 'lightbulb',
              label: 'Ideas de Negocio',
              onPress: () => {
                hideFAB();
                navigation.navigate('BusinessIdeas');
              },
              color: theme.colors.primary
            },
            {
              icon: 'eye',
              label: 'Observaciones',
              onPress: () => {
                hideFAB();
                navigation.navigate('Dashboard');
              },
              color: theme.colors.primary
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
  },
  appBar: {
    elevation: 2,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  appBarActions: {
    flexDirection: 'row',
  },
  onboardingContainer: {
    height: height * 0.6,
  },
  onboardingScroll: {
    flex: 1,
  },
  onboardingScreen: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  onboardingImageContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingImage: {
    width: '80%',
    height: '80%',
  },
  onboardingContent: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  onboardingDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    color: '#666',
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  onboardingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  skipButton: {
    alignSelf: 'center',
  },
  nextButton: {
    borderRadius: 8,
    elevation: 0,
  },
  nextButtonContent: {
    paddingHorizontal: 16,
    height: 48,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 24,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  featuresSection: {
    marginTop: 8,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    margin: 0,
    backgroundColor: '#F5F5F5',
  },
  featureContent: {
    flex: 1,
    marginLeft: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  testimonialsScroll: {
    marginTop: 8,
  },
  testimonialCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 12,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  testimonialAuthorInfo: {
    flex: 1,
  },
  testimonialAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testimonialCompany: {
    fontSize: 14,
    color: '#666',
  },
  testimonialQuote: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    color: '#424242',
  },
  faqSection: {
    marginTop: 8,
  },
  faqItem: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
  },
  faqAnswerContainer: {
    padding: 16,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
  },
  moreFaqButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  getStartedSection: {
    margin: 16,
    marginTop: 8,
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  getStartedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  getStartedButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 0,
  },
  exploreIdeasButton: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1.5,
  },
  getStartedButtonContent: {
    height: 48,
  },
  getStartedButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 