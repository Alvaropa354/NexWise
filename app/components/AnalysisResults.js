import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, List, Divider, useTheme } from 'react-native-paper';

const AnalysisResults = ({ analysis }) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      {/* Productos Existentes */}
      <Card style={styles.card}>
        <Card.Title title="Soluciones Existentes en el Mercado" />
        <Card.Content>
          {analysis.existingProducts.map((product, index) => (
            <View key={index} style={styles.productSection}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.description}>{product.description}</Text>
              
              <List.Section>
                <List.Subheader>Fortalezas</List.Subheader>
                {product.strengths.map((strength, idx) => (
                  <List.Item
                    key={idx}
                    left={props => <List.Icon {...props} icon="check" />}
                    title={strength}
                  />
                ))}
                
                <List.Subheader>Debilidades</List.Subheader>
                {product.weaknesses.map((weakness, idx) => (
                  <List.Item
                    key={idx}
                    left={props => <List.Icon {...props} icon="alert" />}
                    title={weakness}
                  />
                ))}
              </List.Section>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Oportunidades de Innovación */}
      <Card style={styles.card}>
        <Card.Title title="Oportunidades de Innovación" />
        <Card.Content>
          {analysis.innovationOpportunities.map((opportunity, index) => (
            <View key={index} style={styles.opportunitySection}>
              <Text style={styles.opportunityTitle}>{opportunity.area}</Text>
              <Text style={styles.description}>{opportunity.description}</Text>
              <Text style={styles.impact}>
                Impacto Potencial: {opportunity.potentialImpact}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Recomendaciones Estratégicas */}
      <Card style={styles.card}>
        <Card.Title title="Recomendaciones Estratégicas" />
        <Card.Content>
          <List.Section>
            {analysis.strategicRecommendations.map((recommendation, index) => (
              <List.Item
                key={index}
                left={props => <List.Icon {...props} icon="lightbulb-outline" />}
                title={recommendation}
                titleNumberOfLines={3}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  productSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  opportunitySection: {
    marginBottom: 16,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  impact: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  }
});

export default AnalysisResults; 