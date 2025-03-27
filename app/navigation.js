import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import ROUTES from './routes';

// Importar pantallas
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/Dashboard';
import BusinessIdeasScreen from './screens/BusinessIdeas';
import CreateProblemScreen from './screens/CreateProblem';
import CreateBusinessIdeaScreen from './screens/CreateBusinessIdea';
import ProfileScreen from './profile';
import ConfigScreen from './screens/ConfigScreen';
import SubscriptionsScreen from './subscriptions';
import OnboardingScreen from './screens/Onboarding';
import MarketStudyScreen from './market-study';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  const theme = useTheme();
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.ONBOARDING}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          cardStyle: { backgroundColor: theme.colors.background },
          cardOverlayEnabled: true,
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
            close: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
          },
        }}
      >
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen 
          name={ROUTES.ONBOARDING} 
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name={ROUTES.DASHBOARD} 
          component={DashboardScreen}
          options={{ 
            headerLeft: () => null,
            headerShown: true,
            headerTitle: 'Observaciones',
            headerBackVisible: true 
          }}
        />
        <Stack.Screen 
          name={ROUTES.BUSINESS_IDEAS} 
          component={BusinessIdeasScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Ideas de Negocio',
            headerBackVisible: true 
          }}
        />
        <Stack.Screen 
          name={ROUTES.CREATE_BUSINESS_IDEA} 
          component={CreateBusinessIdeaScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Nueva Idea de Negocio',
            headerBackVisible: true 
          }}
        />
        <Stack.Screen 
          name={ROUTES.CREATE_PROBLEM} 
          component={CreateProblemScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Nueva Observación',
            headerBackVisible: true 
          }}
        />
        <Stack.Screen 
          name={ROUTES.PROFILE} 
          component={ProfileScreen}
          options={{ title: 'Perfil' }}
        />
        <Stack.Screen 
          name={ROUTES.CONFIG} 
          component={ConfigScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Configuración',
            headerBackVisible: true 
          }}
        />
        <Stack.Screen
          name={ROUTES.SUBSCRIPTIONS}
          component={SubscriptionsScreen}
          options={{ title: 'Suscripciones' }}
        />
        <Stack.Screen
          name={ROUTES.MARKET_STUDY}
          component={MarketStudyScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Estudio de Mercado',
            headerBackVisible: true,
            headerRight: () => (
              <IconButton
                icon="chart-bar"
                size={24}
                color="#fff"
                onPress={() => navigation.navigate(ROUTES.MARKET_STUDY)}
              />
            )
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 