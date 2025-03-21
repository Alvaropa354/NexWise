import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import { 
  Text, 
  Surface, 
  TextInput, 
  Button, 
  Switch, 
  Title, 
  Divider,
  useTheme,
  List
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Importar servicios de API de Google AI
import { saveApiKey, getApiKey, removeApiKey, hasApiKey } from '../services/ai-service';

const ConfigScreen = ({ navigation }) => {
  const theme = useTheme();
  
  // Estados para configuración
  const [googleAiEnabled, setGoogleAiEnabled] = useState(true);
  const [isMaskingKey, setIsMaskingKey] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  
  // Cargar configuración almacenada al iniciar
  useEffect(() => {
    loadStoredConfig();
  }, []);
  
  // Cargar la API key y otras configuraciones
  const loadStoredConfig = async () => {
    try {
      // Verificar si hay API key configurada
      const apiKey = await getApiKey();
      if (apiKey) {
        // Si hay API key, mostrarla enmascarada
        setGoogleAiEnabled(true);
      }
      
      // Cargar otras preferencias
      const aiEnabledSetting = await AsyncStorage.getItem('ai_analysis_enabled');
      if (aiEnabledSetting !== null) {
        setGoogleAiEnabled(aiEnabledSetting === 'true');
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Guardar API key
  const handleSaveApiKey = async () => {
    if (!googleAiEnabled) {
      Alert.alert(
        'API Key Requerida',
        'Por favor ingresa una API key válida para Google AI.'
      );
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Guardar la API key
      await saveApiKey(googleAiEnabled.toString());
      
      // Guardar preferencia de uso de IA
      await AsyncStorage.setItem('ai_analysis_enabled', googleAiEnabled.toString());
      
      ToastAndroid.show('Configuración guardada correctamente', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar la configuración. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Eliminar API key
  const handleResetApiKey = async () => {
    Alert.alert(
      'Eliminar API Key',
      '¿Estás seguro de que deseas eliminar tu API key de Google AI?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await removeApiKey();
              setGoogleAiEnabled(false);
              await AsyncStorage.setItem('ai_analysis_enabled', 'false');
              ToastAndroid.show('API key eliminada', ToastAndroid.SHORT);
            } catch (error) {
              console.error('Error al eliminar la API key:', error);
              Alert.alert('Error', 'No se pudo eliminar la API key');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };
  
  // Alternar visibilidad de la API key
  const toggleKeyVisibility = () => {
    setIsMaskingKey(!isMaskingKey);
  };
  
  // Renderizar API key enmascarada o completa
  const getMaskedApiKey = (key) => {
    if (!key) return '';
    if (isMaskingKey) {
      return `${key.substring(0, 5)}${'•'.repeat(10)}${key.substring(key.length - 5)}`;
    }
    return key;
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando configuración...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Configuración</Title>
      
      <Surface style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="key-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>API de Google AI</Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.description}>
          Google AI proporciona análisis avanzado de ideas de negocio utilizando inteligencia artificial.
          Introduce tu API key para activar esta función.
        </Text>
        
        <View style={styles.apiKeyContainer}>
          <TextInput
            label="API Key de Google AI"
            value={getMaskedApiKey(googleAiEnabled.toString())}
            onChangeText={setGoogleAiEnabled}
            mode="outlined"
            style={styles.apiKeyInput}
            secureTextEntry={isMaskingKey}
            right={
              <TextInput.Icon 
                icon={isMaskingKey ? "eye" : "eye-off"} 
                onPress={toggleKeyVisibility} 
              />
            }
          />
        </View>
        
        <View style={styles.switchContainer}>
          <Text>Usar análisis con IA</Text>
          <Switch
            value={googleAiEnabled}
            onValueChange={setGoogleAiEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={googleAiEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.buttonsContainer}>
          <Button
            mode="contained"
            onPress={handleSaveApiKey}
            style={styles.button}
          >
            Guardar
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleResetApiKey}
            style={styles.button}
            disabled={!googleAiEnabled}
          >
            Eliminar API Key
          </Button>
        </View>
        
        <Text style={styles.disclaimer}>
          Tu API key se almacena de forma segura y solo se utiliza para 
          comunicarse con Google AI. No compartimos tus credenciales con ningún tercero.
        </Text>
      </Surface>
      
      <Surface style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Acerca de</Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.version}>Nexwise v1.0.0</Text>
        <Text style={styles.copyright}>© 2023 Nexwise. Todos los derechos reservados.</Text>
      </Surface>

      <List.Section>
        <List.Subheader>Apariencia</List.Subheader>
        <List.Item
          title="Modo Oscuro"
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          )}
        />
        <Divider />
        <List.Subheader>Notificaciones</List.Subheader>
        <List.Item
          title="Notificaciones Push"
          right={() => (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          )}
        />
        <List.Item
          title="Actualizaciones por Email"
          right={() => (
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
            />
          )}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  divider: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  apiKeyContainer: {
    marginBottom: 16,
  },
  apiKeyInput: {
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
  version: {
    textAlign: 'center',
    marginBottom: 4,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
});

export default ConfigScreen; 