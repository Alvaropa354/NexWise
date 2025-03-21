import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { 
  Text, 
  Surface, 
  Button 
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const navigation = useNavigation();
  
  const handleContinue = () => {
    navigation.navigate('Welcome');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a1a', '#0f1035', '#0a0a1a']}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Surface style={styles.logoSurface}>
              <View style={styles.logo}>
                <View style={styles.logoDots}>
                  {/* Círculos decorativos alrededor del logo */}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.dot, 
                        { 
                          transform: [{ 
                            rotate: `${i * 15}deg` 
                          }],
                          backgroundColor: i % 3 === 0 ? '#00c8ff' : '#0055aa',
                          opacity: 0.7 + (i % 5) * 0.06,
                        }
                      ]} 
                    />
                  ))}
                </View>
                <View style={styles.logoStar}>
                  <Text style={styles.logoText}>N</Text>
                </View>
              </View>
            </Surface>
            <Text style={styles.appName}>NEXWISE</Text>
          </View>
          
          <Text style={styles.subtitle}>
            Transformando Problemas en Oportunidades
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={handleContinue}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Continuar a la aplicación
            </Button>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const logoSize = width * 0.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoSurface: {
    width: logoSize,
    height: logoSize,
    borderRadius: logoSize / 2,
    elevation: 8,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDots: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: '50%',
    left: '50%',
    marginLeft: -6,
    marginTop: -logoSize / 2.5,
  },
  logoStar: {
    width: logoSize * 0.6,
    height: logoSize * 0.6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },
  logoText: {
    fontSize: logoSize * 0.4,
    fontWeight: 'bold',
    color: '#fff',
    transform: [{ rotate: '-45deg' }],
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#00c8ff',
    textShadowColor: 'rgba(0, 200, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 80,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '70%',
    paddingVertical: 8,
    backgroundColor: '#00c8ff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 