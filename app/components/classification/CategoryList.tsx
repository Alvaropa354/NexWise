import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text, Card } from 'react-native-paper';
import { classificationService } from '../../services/classification';

interface CategoryListProps {
  onCategorySelect?: (categoryId: string) => void;
}

export function CategoryList({ onCategorySelect }: CategoryListProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classificationService.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando categorías...</Text>
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
        <Text variant="titleLarge">Categorías</Text>
        {categories.map((category) => (
          <List.Item
            key={category.id}
            title={category.name}
            description={category.description}
            left={props => <List.Icon {...props} icon="folder" />}
            onPress={() => onCategorySelect?.(category.id)}
            style={[
              styles.categoryItem,
              { paddingLeft: category.level * 16 }
            ]}
          />
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  categoryItem: {
    marginVertical: 4,
  },
  error: {
    color: 'red',
  },
}); 