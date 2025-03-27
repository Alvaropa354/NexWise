import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Chip, Divider, Surface, List, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function MarketStudyDetail({ route }) {
  const { study } = route.params;
  const navigation = useNavigation();

  const renderSection = (title, content) => (
    <Surface style={styles.section}>
      <Title style={styles.sectionTitle}>{title}</Title>
      {content}
    </Surface>
  );

  const renderList = (items) => (
    <View style={styles.listContainer}>
      {items.map((item, index) => (
        <Text key={index} style={styles.listItem}>• {item}</Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Title style={styles.headerTitle}>Detalles del Estudio</Title>
      </View>
      <ScrollView>
        {/* Tamaño del Mercado */}
        {renderSection('Tamaño del Mercado', (
          <View>
            <View style={styles.marketSizeContainer}>
              <Text style={styles.mainMetric}>€100.000.000</Text>
            </View>
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Crecimiento Histórico</Text>
                <Text style={styles.metricValue}>{study.marketSize.historical.pastGrowth}%</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Proyección 5 años</Text>
                <Text style={styles.metricValue}>{study.marketSize.projections.fiveYears}%</Text>
              </View>
            </View>
            <Title style={styles.subsectionTitle}>Tendencias Clave</Title>
            {renderList(study.marketSize.historical.keyTrends)}
          </View>
        ))}

        {/* Segmentación */}
        {renderSection('Segmentación del Mercado', (
          <View>
            <List.Section>
              <List.Accordion title="Demografía" id="1">
                <View style={styles.chipContainer}>
                  {study.segmentation.demographic.age.map((age, index) => (
                    <Chip key={`age-${index}`} style={styles.chip}>{age}</Chip>
                  ))}
                </View>
                <Divider style={styles.divider} />
                <View style={styles.chipContainer}>
                  {study.segmentation.demographic.socioeconomic.map((level, index) => (
                    <Chip key={`socio-${index}`} style={styles.chip}>{level}</Chip>
                  ))}
                </View>
              </List.Accordion>
              <List.Accordion title="Psicografía" id="2">
                <Title style={styles.subsectionTitle}>Intereses</Title>
                {renderList(study.segmentation.psychographic.interests)}
                <Title style={styles.subsectionTitle}>Valores</Title>
                {renderList(study.segmentation.psychographic.values)}
              </List.Accordion>
            </List.Section>
          </View>
        ))}

        {/* Viabilidad */}
        {renderSection('Viabilidad y Rentabilidad', (
          <View>
            <View style={styles.viabilityScore}>
              <Text style={styles.viabilityValue}>{study.viability.score}%</Text>
              <Text style={styles.viabilityLabel}>Puntuación de Viabilidad</Text>
            </View>
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>ROI Estimado</Text>
                <Text style={styles.metricValue}>{study.viability.estimatedROI}%</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Aceptación Local</Text>
                <Text style={styles.metricValue}>{study.viability.localAcceptance}%</Text>
              </View>
            </View>
            <Title style={styles.subsectionTitle}>Fortalezas</Title>
            {renderList(study.viability.strengths)}
            <Title style={styles.subsectionTitle}>Debilidades</Title>
            {renderList(study.viability.weaknesses)}
          </View>
        ))}

        {/* Competencia */}
        {renderSection('Análisis Competitivo', (
          <View>
            {Object.entries(study.competition).map(([level, data]) => {
              if (level === 'opportunities') return null;
              return (
                <View key={level}>
                  <Title style={styles.subsectionTitle}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Title>
                  {data.companies.map((company, index) => (
                    <Card key={index} style={styles.companyCard}>
                      <Card.Content>
                        <Title>{company.name}</Title>
                        <Paragraph>Cuota de mercado: {data.marketShare}%</Paragraph>
                        <View style={styles.strengthsWeaknesses}>
                          <View style={styles.half}>
                            <Text style={styles.swTitle}>Fortalezas</Text>
                            {renderList(company.strengths)}
                          </View>
                          <View style={styles.half}>
                            <Text style={styles.swTitle}>Debilidades</Text>
                            {renderList(company.weaknesses)}
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  ))}
                </View>
              );
            })}
          </View>
        ))}

        {/* Ubicación Óptima */}
        {renderSection('Ubicación Óptima', (
          <View>
            <Title style={styles.locationTitle}>{study.optimalLocation.city}</Title>
            <Paragraph style={styles.locationSubtitle}>
              {study.optimalLocation.region}, {study.optimalLocation.country}
            </Paragraph>
            <Title style={styles.subsectionTitle}>Ventajas</Title>
            {renderList(study.optimalLocation.advantages)}
            <Title style={styles.subsectionTitle}>Consideraciones</Title>
            {renderList(study.optimalLocation.considerations)}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  marketSizeContainer: {
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  mainMetric: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 44,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    marginLeft: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip: {
    margin: 4,
  },
  divider: {
    marginVertical: 16,
  },
  viabilityScore: {
    alignItems: 'center',
    marginBottom: 24,
  },
  viabilityValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  viabilityLabel: {
    fontSize: 16,
    color: '#666',
  },
  companyCard: {
    marginVertical: 8,
  },
  strengthsWeaknesses: {
    flexDirection: 'row',
    marginTop: 16,
  },
  half: {
    flex: 1,
    paddingHorizontal: 8,
  },
  swTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
}); 