import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente para manejar errores en toda la aplicación
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('Error en la aplicación:', error, errorInfo);
  }

  // Función para reintentar cargar la aplicación
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Renderiza una UI alternativa
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              ¡Ups! Algo salió mal
            </Text>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>
              La aplicación encontró un error inesperado. Por favor, intenta de nuevo.
            </Text>
            <Button
              title="Reintentar"
              onPress={this.handleRetry}
            />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
} 