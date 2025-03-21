import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, Button, Portal, Dialog, TextInput, IconButton } from 'react-native-paper';
import { classificationService } from '../../services/classification';
import { useAuth } from '../../hooks/useAuth';

interface UserFiltersProps {
  onFilterSelect?: (filter: any) => void;
}

export function UserFilters({ onFilterSelect }: UserFiltersProps) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<any[]>([]);
  const [visible, setVisible] = React.useState(false);
  const [newFilterName, setNewFilterName] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<any>(null);

  React.useEffect(() => {
    if (user?.id) {
      loadFilters();
    }
  }, [user?.id]);

  const loadFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classificationService.getUserFilters(user!.id);
      setFilters(data);
    } catch (err) {
      setError('Error al cargar los filtros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFilter = async () => {
    try {
      const newFilter = await classificationService.createUserFilter(user!.id, {
        name: newFilterName,
        filter_criteria: {
          categories: [],
          tags: [],
          impact_level: 0,
          urgency_level: 0,
          scope: '',
        },
      });
      setFilters([...filters, newFilter]);
      setNewFilterName('');
      setVisible(false);
    } catch (err) {
      console.error('Error al crear el filtro:', err);
    }
  };

  const handleDeleteFilter = async (filterId: string) => {
    try {
      await classificationService.deleteUserFilter(filterId);
      setFilters(filters.filter(f => f.id !== filterId));
    } catch (err) {
      console.error('Error al eliminar el filtro:', err);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando filtros...</Text>
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
        <View style={styles.header}>
          <Text variant="titleLarge">Filtros Personalizados</Text>
          <IconButton
            icon="plus"
            size={24}
            onPress={() => setVisible(true)}
          />
        </View>

        {filters.map((filter) => (
          <List.Item
            key={filter.id}
            title={filter.name}
            left={props => <List.Icon {...props} icon="filter" />}
            right={props => (
              <IconButton
                {...props}
                icon="delete"
                onPress={() => handleDeleteFilter(filter.id)}
              />
            )}
            onPress={() => onFilterSelect?.(filter)}
          />
        ))}

        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>Nuevo Filtro</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nombre del filtro"
                value={newFilterName}
                onChangeText={setNewFilterName}
                mode="outlined"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)}>Cancelar</Button>
              <Button onPress={handleCreateFilter}>Crear</Button>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  error: {
    color: 'red',
  },
}); 