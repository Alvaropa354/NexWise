import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, Button, Portal, Dialog } from 'react-native-paper';
import { incentivesService } from '../../services/incentives';
import { useAuth } from '../../hooks/useAuth';

export function RedeemableCredits() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [credits, setCredits] = React.useState<any[]>([]);
  const [selectedCredit, setSelectedCredit] = React.useState<any>(null);
  const [dialogVisible, setDialogVisible] = React.useState(false);

  React.useEffect(() => {
    if (user?.id) {
      loadCredits();
    }
  }, [user?.id]);

  const loadCredits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incentivesService.getRedeemableCredits(user!.id);
      setCredits(data);
    } catch (err) {
      setError('Error al cargar los créditos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (credit: any) => {
    setSelectedCredit(credit);
    setDialogVisible(true);
  };

  const confirmRedeem = async () => {
    try {
      // Aquí implementaríamos la lógica para canjear el crédito
      // Por ahora solo cerramos el diálogo
      setDialogVisible(false);
      setSelectedCredit(null);
    } catch (err) {
      console.error('Error al canjear el crédito:', err);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando créditos...</Text>
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.error}>{error}</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">Créditos Canjeables</Text>
        {credits.length === 0 ? (
          <Text style={styles.emptyText}>No tienes créditos disponibles</Text>
        ) : (
          credits.map((credit) => (
            <List.Item
              key={credit.id}
              title={`${credit.amount} créditos`}
              description={`Fuente: ${credit.source}`}
              left={props => <List.Icon {...props} icon="credit-card" />}
              right={props => (
                <Button
                  {...props}
                  mode="contained"
                  onPress={() => handleRedeem(credit)}
                  disabled={credit.expires_at && new Date(credit.expires_at) < new Date()}
                >
                  Canjear
                </Button>
              )}
            />
          ))
        )}

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Confirmar Canje</Dialog.Title>
            <Dialog.Content>
              <Text>
                ¿Estás seguro de que deseas canjear {selectedCredit?.amount} créditos?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
              <Button onPress={confirmRedeem}>Confirmar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#757575',
  },
  error: {
    color: 'red',
  },
}); 