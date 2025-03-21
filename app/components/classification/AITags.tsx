import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, ProgressBar } from 'react-native-paper';
import { classificationService } from '../../services/classification';

interface AITagsProps {
  problemId: string;
}

export function AITags({ problemId }: AITagsProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tags, setTags] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadTags();
  }, [problemId]);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classificationService.generateAITags(problemId);
      setTags(data);
    } catch (err) {
      setError('Error al cargar las etiquetas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text>Cargando etiquetas...</Text>
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
        <Text variant="titleLarge">Etiquetas IA</Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View key={tag.id} style={styles.tagItem}>
              <Chip
                mode="outlined"
                onPress={() => {}}
                style={styles.chip}
              >
                {tag.name}
              </Chip>
              <View style={styles.confidenceContainer}>
                <ProgressBar
                  progress={tag.confidence_score / 100}
                  style={styles.progressBar}
                />
                <Text variant="bodySmall" style={styles.confidenceText}>
                  {tag.confidence_score}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagItem: {
    margin: 4,
    width: '45%',
  },
  chip: {
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  confidenceText: {
    marginLeft: 4,
    fontSize: 10,
  },
  error: {
    color: 'red',
  },
}); 