import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { CategoryList } from './CategoryList';
import { AITags } from './AITags';
import { UserFilters } from './UserFilters';

interface ProblemClassificationProps {
  problemId: string;
  onCategorySelect?: (categoryId: string) => void;
  onFilterSelect?: (filter: any) => void;
}

export function ProblemClassification({
  problemId,
  onCategorySelect,
  onFilterSelect,
}: ProblemClassificationProps) {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Clasificación del Problema</Text>
        </Card.Content>
      </Card>

      <CategoryList onCategorySelect={onCategorySelect} />
      <AITags problemId={problemId} />
      <UserFilters onFilterSelect={onFilterSelect} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
}); 