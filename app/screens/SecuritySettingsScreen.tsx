import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, TextInput, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';
import QRCode from 'react-native-qrcode-svg';

export function SecuritySettingsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.enable2FA(user!.id);
      setQrCode(result.qrCode);
    } catch (err) {
      setError('Error al habilitar 2FA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      const isValid = await authService.verify2FA(user!.id, token);
      if (isValid) {
        setIs2FAEnabled(true);
      } else {
        setError('Código inválido');
      }
    } catch (err) {
      setError('Error al verificar 2FA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.disable2FA(user!.id);
      setIs2FAEnabled(false);
      setQrCode(null);
    } catch (err) {
      setError('Error al deshabilitar 2FA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Autenticación de Dos Factores</Text>
          <Text variant="bodyMedium" style={styles.description}>
            La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta.
          </Text>

          {error && (
            <Text style={styles.error}>{error}</Text>
          )}

          {loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <>
              {!is2FAEnabled ? (
                <>
                  <Button
                    mode="contained"
                    onPress={handleEnable2FA}
                    style={styles.button}
                  >
                    Habilitar 2FA
                  </Button>

                  {qrCode && (
                    <View style={styles.qrContainer}>
                      <QRCode
                        value={qrCode}
                        size={200}
                      />
                      <Text variant="bodySmall" style={styles.qrInstructions}>
                        Escanea este código QR con tu aplicación de autenticación
                      </Text>
                      <TextInput
                        label="Código de verificación"
                        value={token}
                        onChangeText={setToken}
                        keyboardType="number-pad"
                        style={styles.input}
                      />
                      <Button
                        mode="contained"
                        onPress={handleVerify2FA}
                        style={styles.button}
                      >
                        Verificar
                      </Button>
                    </View>
                  )}
                </>
              ) : (
                <Button
                  mode="outlined"
                  onPress={handleDisable2FA}
                  style={styles.button}
                >
                  Deshabilitar 2FA
                </Button>
              )}
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  qrInstructions: {
    marginTop: 16,
    textAlign: 'center',
  },
  input: {
    marginTop: 16,
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  loader: {
    marginTop: 16,
  },
}); 