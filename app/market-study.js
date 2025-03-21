import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Appbar,
  Surface,
  Divider,
  Dialog,
  Portal,
  ProgressBar,
  Chip,
  IconButton,
  Avatar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ROUTES from './routes';

export default function MarketStudy() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Estado para almacenar la idea seleccionada para el estudio de mercado
  const [selectedIdea, setSelectedIdea] = useState(null);
  
  // Estado para la lista de ideas de negocio del usuario
  const [userIdeas, setUserIdeas] = useState([]);
  
  // Estados para carga y diálogos
  const [isLoading, setIsLoading] = useState(true);
  const [studyDialogVisible, setStudyDialogVisible] = useState(false);
  const [currentStudy, setCurrentStudy] = useState(null);
  const [isGeneratingStudy, setIsGeneratingStudy] = useState(false);
  
  // Cargar ideas al inicio
  useEffect(() => {
    loadUserIdeas();
  }, []);
  
  // Cargar las ideas de negocio del usuario
  const loadUserIdeas = async () => {
    try {
      setIsLoading(true);
      const savedIdeas = await AsyncStorage.getItem('businessIdeas');
      if (savedIdeas) {
        const parsedIdeas = JSON.parse(savedIdeas);
        setUserIdeas(parsedIdeas);
      }
    } catch (error) {
      console.error('Error al cargar ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generar estudio de mercado para una idea específica
  const generateMarketStudy = async (idea) => {
    setSelectedIdea(idea);
    setIsGeneratingStudy(true);
    setStudyDialogVisible(true);
    
    try {
      // Simular la generación del estudio (se reemplazaría con una llamada a la API real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Estudio de mercado simulado
      const mockStudy = {
        marketSize: {
          local: Math.floor(Math.random() * 1000000) + 500000,
          national: Math.floor(Math.random() * 10000000) + 5000000,
          growth: (Math.random() * 15 + 2).toFixed(1)
        },
        projectedGrowth: {
          shortTerm: (Math.random() * 20 + 5).toFixed(1),
          mediumTerm: (Math.random() * 30 + 10).toFixed(1),
          longTerm: (Math.random() * 50 + 20).toFixed(1)
        },
        entryBarriers: {
          regulatory: Math.random() > 0.5 ? 'Alta' : 'Media',
          technological: Math.random() > 0.5 ? 'Media' : 'Baja',
          financial: Math.random() > 0.6 ? 'Alta' : 'Media',
          competitive: Math.random() > 0.4 ? 'Alta' : 'Media'
        },
        underservedNiches: [
          {
            name: 'Segmento ' + idea.sector + ' Premium',
            potential: Math.floor(Math.random() * 85) + 15,
            description: 'Clientes de alto valor adquisitivo buscando soluciones exclusivas en ' + idea.sector
          },
          {
            name: 'Segmento ' + idea.sector + ' Sostenible',
            potential: Math.floor(Math.random() * 75) + 25,
            description: 'Consumidores preocupados por el impacto ambiental en el sector ' + idea.sector
          }
        ],
        demandPrediction: {
          year1: Math.floor(Math.random() * 5000) + 500,
          year3: Math.floor(Math.random() * 15000) + 5000,
          year5: Math.floor(Math.random() * 50000) + 15000
        },
        competitiveAnalysis: {
          local: Math.floor(Math.random() * 10) + 1,
          national: Math.floor(Math.random() * 30) + 10,
          global: Math.floor(Math.random() * 100) + 30,
          competitorStrengths: [
            'Posicionamiento de marca reconocido',
            'Economías de escala establecidas',
            'Canales de distribución consolidados'
          ]
        },
        viability: {
          score: Math.floor(Math.random() * 30) + 70,
          marketAcceptance: (Math.random() * 40 + 60).toFixed(1),
          nationalGrowth: (Math.random() * 50 + 50).toFixed(1)
        },
        marketState: {
          stage: Math.random() > 0.5 ? 'Crecimiento' : 'Emergente',
          saturation: (Math.random() * 50).toFixed(1),
          trends: [
            'Digitalización de servicios',
            'Personalización de experiencias',
            'Soluciones sostenibles'
          ]
        },
        optimalLocation: {
          city: 'Madrid',
          region: 'Comunidad de Madrid',
          advantages: [
            'Alto poder adquisitivo',
            'Acceso a talento cualificado',
            'Infraestructura tecnológica avanzada'
          ]
        }
      };
      
      setCurrentStudy(mockStudy);
    } catch (error) {
      console.error('Error al generar estudio de mercado:', error);
    } finally {
      setIsGeneratingStudy(false);
    }
  };
  
  // Renderizar cada idea en la lista
  const renderIdeaItem = ({ item }) => (
    <Card style={styles.ideaCard} onPress={() => generateMarketStudy(item)}>
      <Card.Content>
        <View style={styles.ideaHeader}>
          <View style={styles.ideaHeaderText}>
            <Text style={styles.ideaTitle}>{item.title}</Text>
            <Text style={styles.ideaSector}>{item.sector}</Text>
          </View>
          <IconButton 
            icon="chart-bar" 
            size={24} 
            color="#4CAF50"
            onPress={() => generateMarketStudy(item)} 
          />
        </View>
        <Text style={styles.ideaDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.ideaTags}>
          {item.tags && item.tags.map((tag, index) => (
            <Chip key={index} style={styles.tagChip}>
              {tag}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Estudio de Mercado" />
      </Appbar.Header>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0088ff" />
          <Text style={styles.loadingText}>Cargando ideas de negocio...</Text>
        </View>
      ) : (
        <>
          {userIdeas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>No tienes ideas de negocio</Text>
              <Text style={styles.emptySubtext}>
                Crea una idea de negocio para generar un estudio de mercado
              </Text>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate(ROUTES.CREATE_BUSINESS_IDEA)}
                style={styles.createButton}
              >
                Crear Idea de Negocio
              </Button>
            </View>
          ) : (
            <FlatList
              data={userIdeas}
              renderItem={renderIdeaItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.ideasList}
            />
          )}
        </>
      )}
      
      {/* Diálogo de Estudio de Mercado */}
      <Portal>
        <Dialog
          visible={studyDialogVisible}
          onDismiss={() => setStudyDialogVisible(false)}
          style={styles.studyDialog}
        >
          {selectedIdea && (
            <>
              <Dialog.Title>Estudio de Mercado: {selectedIdea.title}</Dialog.Title>
              <Dialog.ScrollArea style={styles.dialogScrollArea}>
                <ScrollView>
                  {isGeneratingStudy ? (
                    <View style={styles.generatingContainer}>
                      <ActivityIndicator size="large" color="#0088ff" />
                      <Text style={styles.generatingText}>
                        Generando estudio de mercado...
                      </Text>
                      <Text style={styles.generatingSubtext}>
                        Estamos analizando datos de mercado, competencia, 
                        tendencias y oportunidades para tu idea.
                      </Text>
                    </View>
                  ) : currentStudy ? (
                    <View style={styles.studyContent}>
                      {/* Sección de Tamaño de Mercado */}
                      <View style={styles.studySection}>
                        <Text style={styles.studySectionTitle}>Tamaño de Mercado</Text>
                        <View style={styles.studyMetricRow}>
                          <View style={styles.studyMetric}>
                            <Text style={styles.metricValue}>
                              {currentStudy.marketSize.local.toLocaleString('es-ES')}€
                            </Text>
                            <Text style={styles.metricLabel}>Mercado Local</Text>
                          </View>
                          <View style={styles.studyMetric}>
                            <Text style={styles.metricValue}>
                              {currentStudy.marketSize.national.toLocaleString('es-ES')}€
                            </Text>
                            <Text style={styles.metricLabel}>Mercado Nacional</Text>
                          </View>
                          <View style={styles.studyMetric}>
                            <Text style={styles.metricValue}>
                              {currentStudy.marketSize.growth}%
                            </Text>
                            <Text style={styles.metricLabel}>Crecimiento Anual</Text>
                          </View>
                        </View>
                      </View>
                      
                      <Divider style={styles.divider} />
                      
                      {/* Sección de Crecimiento Proyectado */}
                      <View style={styles.studySection}>
                        <Text style={styles.studySectionTitle}>Crecimiento Proyectado</Text>
                        <View style={styles.studyMetricRow}>
                          <View style={styles.studyMetric}>
                            <Text style={styles.metricValue}>
                              {currentStudy.projectedGrowth.shortTerm}%
                            </Text>
                            <Text style={styles.metricLabel}>Corto Plazo (1 año)</Text>
                          </View>
                          <View style={styles.studyMetric}>
                            <Text style={styles.metricValue}>
                              {currentStudy.projectedGrowth.mediumTerm}%
                            </Text>
                            <Text style={styles.metricLabel}>Medio Plazo (3 años)</Text>
                          </View>
                          <View style={styles.studyMetric}>
                            <Text style={styles.metricValue}>
                              {currentStudy.projectedGrowth.longTerm}%
                            </Text>
                            <Text style={styles.metricLabel}>Largo Plazo (5 años)</Text>
                          </View>
                        </View>
                      </View>
                      
                      <Divider style={styles.divider} />
                      
                      {/* Sección de Barreras de Entrada */}
                      <View style={styles.studySection}>
                        <Text style={styles.studySectionTitle}>Barreras de Entrada</Text>
                        <View style={styles.barriersList}>
                          <View style={styles.barrierItem}>
                            <Text style={styles.barrierLabel}>Regulatorias:</Text>
                            <Chip 
                              style={[
                                styles.barrierChip, 
                                currentStudy.entryBarriers.regulatory === 'Alta' ? 
                                  styles.highBarrier : 
                                  styles.mediumBarrier
                              ]}
                            >
                              {currentStudy.entryBarriers.regulatory}
                            </Chip>
                          </View>
                          
                          <View style={styles.barrierItem}>
                            <Text style={styles.barrierLabel}>Tecnológicas:</Text>
                            <Chip 
                              style={[
                                styles.barrierChip, 
                                currentStudy.entryBarriers.technological === 'Alta' ? 
                                  styles.highBarrier : 
                                  styles.lowBarrier
                              ]}
                            >
                              {currentStudy.entryBarriers.technological}
                            </Chip>
                          </View>
                          
                          <View style={styles.barrierItem}>
                            <Text style={styles.barrierLabel}>Financieras:</Text>
                            <Chip 
                              style={[
                                styles.barrierChip, 
                                currentStudy.entryBarriers.financial === 'Alta' ? 
                                  styles.highBarrier : 
                                  styles.mediumBarrier
                              ]}
                            >
                              {currentStudy.entryBarriers.financial}
                            </Chip>
                          </View>
                          
                          <View style={styles.barrierItem}>
                            <Text style={styles.barrierLabel}>Competitivas:</Text>
                            <Chip 
                              style={[
                                styles.barrierChip, 
                                currentStudy.entryBarriers.competitive === 'Alta' ? 
                                  styles.highBarrier : 
                                  styles.mediumBarrier
                              ]}
                            >
                              {currentStudy.entryBarriers.competitive}
                            </Chip>
                          </View>
                        </View>
                      </View>
                      
                      <Divider style={styles.divider} />
                      
                      {/* Nichos Desatendidos */}
                      <View style={styles.studySection}>
                        <Text style={styles.studySectionTitle}>Nichos Desatendidos</Text>
                        {currentStudy.underservedNiches.map((niche, index) => (
                          <View key={index} style={styles.nicheCard}>
                            <View style={styles.nicheHeader}>
                              <Text style={styles.nicheName}>{niche.name}</Text>
                              <Chip style={styles.potentialChip}>
                                {niche.potential}% Potencial
                              </Chip>
                            </View>
                            <Text style={styles.nicheDescription}>
                              {niche.description}
                            </Text>
                          </View>
                        ))}
                      </View>
                      
                      <Divider style={styles.divider} />
                      
                      {/* Previsión de Demanda */}
                      <View style={styles.studySection}>
                        <Text style={styles.studySectionTitle}>Previsión de Demanda</Text>
                        <View style={styles.demandPreview}>
                          <View style={styles.demandYear}>
                            <Text style={styles.demandYearValue}>
                              {currentStudy.demandPrediction.year1.toLocaleString('es-ES')}
                            </Text>
                            <Text style={styles.demandYearLabel}>Año 1</Text>
                          </View>
                          <View style={styles.demandProgressContainer}>
                            <View style={styles.demandProgressBar}>
                              <View 
                                style={[
                                  styles.demandProgress, 
                                  {width: `${(currentStudy.demandPrediction.year1 / currentStudy.demandPrediction.year5) * 100}%`}
                                ]} 
                              />
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.demandPreview}>
                          <View style={styles.demandYear}>
                            <Text style={styles.demandYearValue}>
                              {currentStudy.demandPrediction.year3.toLocaleString('es-ES')}
                            </Text>
                            <Text style={styles.demandYearLabel}>Año 3</Text>
                          </View>
                          <View style={styles.demandProgressContainer}>
                            <View style={styles.demandProgressBar}>
                              <View 
                                style={[
                                  styles.demandProgress, 
                                  {width: `${(currentStudy.demandPrediction.year3 / currentStudy.demandPrediction.year5) * 100}%`}
                                ]} 
                              />
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.demandPreview}>
                          <View style={styles.demandYear}>
                            <Text style={styles.demandYearValue}>
                              {currentStudy.demandPrediction.year5.toLocaleString('es-ES')}
                            </Text>
                            <Text style={styles.demandYearLabel}>Año 5</Text>
                          </View>
                          <View style={styles.demandProgressContainer}>
                            <View style={styles.demandProgressBar}>
                              <View style={[styles.demandProgress, {width: '100%'}]} />
                            </View>
                          </View>
                        </View>
                      </View>
                      
                      <Divider style={styles.divider} />
                      
                      {/* Viabilidad */}
                      <View style={styles.studySection}>
                        <Text style={styles.studySectionTitle}>Viabilidad General</Text>
                        <View style={styles.viabilityContainer}>
                          <View style={styles.viabilityScore}>
                            <Text style={styles.viabilityScoreValue}>
                              {currentStudy.viability.score}%
                            </Text>
                            <Text style={styles.viabilityScoreLabel}>
                              Viabilidad
                            </Text>
                          </View>
                          <View style={styles.viabilityMetrics}>
                            <View style={styles.viabilityMetric}>
                              <Text style={styles.viabilityMetricLabel}>
                                Aceptación de Mercado:
                              </Text>
                              <Text style={styles.viabilityMetricValue}>
                                {currentStudy.viability.marketAcceptance}%
                              </Text>
                            </View>
                            <View style={styles.viabilityMetric}>
                              <Text style={styles.viabilityMetricLabel}>
                                Crecimiento Nacional:
                              </Text>
                              <Text style={styles.viabilityMetricValue}>
                                {currentStudy.viability.nationalGrowth}%
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        Error al generar el estudio de mercado
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={() => setStudyDialogVisible(false)}>Cerrar</Button>
                {currentStudy && (
                  <Button 
                    mode="contained" 
                    onPress={() => {
                      // Aquí se podría implementar la descarga o exportación del estudio
                      setStudyDialogVisible(false);
                    }}
                  >
                    Exportar Estudio
                  </Button>
                )}
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    backgroundColor: '#fff',
    elevation: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 16,
  },
  ideasList: {
    padding: 16,
  },
  ideaCard: {
    marginBottom: 16,
    elevation: 2,
  },
  ideaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ideaHeaderText: {
    flex: 1,
  },
  ideaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ideaSector: {
    fontSize: 14,
    color: '#666',
  },
  ideaDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  ideaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 4,
    height: 24,
  },
  studyDialog: {
    maxHeight: '90%',
  },
  dialogScrollArea: {
    paddingHorizontal: 0,
  },
  generatingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  generatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  generatingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  studyContent: {
    padding: 16,
  },
  studySection: {
    marginBottom: 24,
  },
  studySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  studyMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studyMetric: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0088ff',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  barriersList: {
    marginTop: 8,
  },
  barrierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barrierLabel: {
    fontSize: 14,
    color: '#444',
  },
  barrierChip: {
    width: 100,
    alignItems: 'center',
  },
  highBarrier: {
    backgroundColor: '#ffcdd2',
  },
  mediumBarrier: {
    backgroundColor: '#fff9c4',
  },
  lowBarrier: {
    backgroundColor: '#c8e6c9',
  },
  nicheCard: {
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  nicheHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nicheName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  potentialChip: {
    backgroundColor: '#d1eaff',
  },
  nicheDescription: {
    fontSize: 14,
    color: '#555',
  },
  demandPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  demandYear: {
    width: 100,
  },
  demandYearValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  demandYearLabel: {
    fontSize: 12,
    color: '#666',
  },
  demandProgressContainer: {
    flex: 1,
    marginLeft: 12,
  },
  demandProgressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  demandProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  viabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viabilityScore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  viabilityScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0088ff',
  },
  viabilityScoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  viabilityMetrics: {
    flex: 1,
  },
  viabilityMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  viabilityMetricLabel: {
    fontSize: 14,
    color: '#444',
  },
  viabilityMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
  },
}); 