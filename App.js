// App.js - Punto de entrada principal
import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

// Importamos pantallas
import Welcome from './app/welcome';
import Login from './app/login';
import Register from './app/register';
import DashboardScreen from './app/dashboard';
import CommentObservation from './app/create-problem';
import SubscriptionsScreen from './app/subscriptions';
import CreateProfile from './app/create-profile';
import ProfileScreen from './app/profile';
import NotificationsScreen from './app/notifications';
import ChatScreen from './app/screens/ChatScreen';
import BusinessIdeasScreen from './app/business-ideas';
import CreateBusinessIdeaScreen from './app/create-business-idea';
import OnboardingScreen from './app/screens/Onboarding';

// Crear el contexto para los FABs
export const FABContext = createContext();

const Stack = createStackNavigator();

export default function App() {
  const [fabState, setFabState] = useState({
    screen: null,
    visible: false,
    type: null
  });

  const showFAB = React.useCallback((screen, type) => {
    setFabState({
      screen,
      visible: true,
      type
    });
  }, []);

  const hideFAB = React.useCallback(() => {
    setFabState({
      screen: null,
      visible: false,
      type: null
    });
  }, []);

  const fabContextValue = React.useMemo(() => ({
    fabState,
    showFAB,
    hideFAB
  }), [fabState, showFAB, hideFAB]);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <FABContext.Provider value={fabContextValue}>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Welcome"
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#fff' },
                transitionSpec: {
                  open: {
                    animation: 'timing',
                    config: {
                      duration: 200
                    }
                  },
                  close: {
                    animation: 'timing',
                    config: {
                      duration: 200
                    }
                  }
                }
              }}
            >
              <Stack.Screen 
                name="Welcome" 
                component={Welcome}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="Login" 
                component={Login}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="Register" 
                component={Register}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="Onboarding" 
                component={OnboardingScreen}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="CreateProblem" 
                component={CommentObservation}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="Subscriptions" 
                component={SubscriptionsScreen}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="CreateProfile" 
                component={CreateProfile}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="Notifications" 
                component={NotificationsScreen}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="ChatScreen" 
                component={ChatScreen}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="BusinessIdeas" 
                component={BusinessIdeasScreen}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
              <Stack.Screen 
                name="CreateBusinessIdea" 
                component={CreateBusinessIdeaScreen}
                options={{
                  cardStyle: { backgroundColor: '#fff' }
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </FABContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 