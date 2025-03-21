import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Appbar, 
  Chip, 
  Searchbar, 
  FAB, 
  Surface, 
  Dialog, 
  Portal,
  ProgressBar,
  Divider,
  ActivityIndicator,
  IconButton,
  TextInput,
  Switch
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { hasApiKey, analyzeWithAI, analyzeCommentWithAI } from '../services/ai-service';
import ROUTES from './routes';

// Datos de ejemplo para mostrar ideas de negocio
const MOCK_IDEAS = [
  {
    id: '1',
    title: 'Plataforma de microfinanciamiento para emprendedores rurales',
    description: 'Sistema que conecte pequeños inversores con emprendedores de zonas rurales para facilitar el acceso a capital semilla con intereses justos.',
    sector: 'Finanzas',
    tags: ['Rural', 'Financiamiento', 'Emprendimiento'],
    date: '2023-11-18T14:20:00Z',
    author: 'Marina López',
    likes: 24,
    comments: 7,
    analysis: {
      potentialScore: 82,
      marketSize: 'Mediano',
      competition: 'Media',
      recommendation: 'Potencial de crecimiento significativo'
    }
  },
  {
    id: '2',
    title: 'App para reducir desperdicio alimentario en restaurantes',
    description: 'Aplicación que permite a restaurantes vender a precio reducido los excedentes de comida al final del día, reduciendo desperdicios y generando ingresos adicionales.',
    sector: 'Sostenibilidad',
    tags: ['Alimentación', 'Desperdicio', 'Economía circular'],
    date: '2023-11-15T09:45:00Z',
    author: 'Carlos Jiménez',
    likes: 31,
    comments: 12,
    analysis: {
      potentialScore: 89,
      marketSize: 'Grande',
      competition: 'Media-alta',
      recommendation: 'Oportunidad emergente con alto potencial'
    }
  },
  {
    id: '3',
    title: 'Plataforma educativa con IA para personalizar aprendizaje',
    description: 'Sistema educativo que utiliza inteligencia artificial para adaptar el contenido y ritmo de aprendizaje a las necesidades específicas de cada estudiante.',
    sector: 'Educación',
    tags: ['EdTech', 'IA', 'Personalización'],
    date: '2023-11-12T16:30:00Z',
    author: 'Ana Martín',
    likes: 42,
    comments: 15,
    analysis: {
      potentialScore: 94,
      marketSize: 'Muy grande',
      competition: 'Alta',
      recommendation: 'Inversión prioritaria con enfoque diferenciador'
    }
  },
];

export default function BusinessIdeas() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [analysisDialogVisible, setAnalysisDialogVisible] = useState(false);
  const [commentsDialogVisible, setCommentsDialogVisible] = useState(false);
  const [activeSector, setActiveSector] = useState('Todos');
  const [activePotentialRange, setActivePotentialRange] = useState('Todos');
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentAnalysisDialogVisible, setCommentAnalysisDialogVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [hasGoogleAiEnabled, setHasGoogleAiEnabled] = useState(true);
  const [commentAnalysisLoading, setCommentAnalysisLoading] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  
  // Sectores para filtrado
  const sectors = ['Todos', 'Finanzas', 'Sostenibilidad', 'Educación', 'Tecnología', 'Salud', 'Otros'];
  
  // Rangos de potencial para filtrado
  const potentialRanges = [
    { label: 'Todos', min: 0, max: 100 },
    { label: '0-25', min: 0, max: 25 },
    { label: '26-49', min: 26, max: 49 },
    { label: '50-74', min: 50, max: 74 },
    { label: '75-100', min: 75, max: 100 }
  ];
  
  // Cargar ideas al inicio
  useEffect(() => {
    loadBusinessIdeas();
    setHasGoogleAiEnabled(true);
  }, [route.params]);
  
  useEffect(() => {
    return () => {
      setFabVisible(false);
    };
  }, []);
  
  // Función para cargar las ideas guardadas
  const loadBusinessIdeas = async () => {
    try {
      const savedIdeas = await AsyncStorage.getItem('businessIdeas');
      
      if (savedIdeas) {
        const parsedIdeas = JSON.parse(savedIdeas);
        // Combinar ideas guardadas con las de ejemplo
        const allIdeas = [...parsedIdeas, ...MOCK_IDEAS];
        
        // Ordenar por fecha (más recientes primero)
        allIdeas.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setIdeas(allIdeas);
        setFilteredIdeas(allIdeas);
      } else {
        setIdeas(MOCK_IDEAS);
        setFilteredIdeas(MOCK_IDEAS);
      }
    } catch (error) {
      console.error('Error al cargar ideas:', error);
      setIdeas(MOCK_IDEAS);
      setFilteredIdeas(MOCK_IDEAS);
    }
  };
  
  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Buscar ideas
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    const searchLower = query.toLowerCase();
    
    let filtered = ideas;
    
    if (query) {
      filtered = ideas.filter(idea => 
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Aplicar filtro de sector
    if (activeSector !== 'Todos') {
      filtered = filtered.filter(idea => idea.sector === activeSector);
    }
    
    // Aplicar filtro de rango de potencial
    if (activePotentialRange !== 'Todos') {
      const range = potentialRanges.find(r => r.label === activePotentialRange);
      if (range) {
        filtered = filtered.filter(
          idea => idea.analysis.potentialScore >= range.min && 
                 idea.analysis.potentialScore <= range.max
        );
      }
    }
    
    setFilteredIdeas(filtered);
  };
  
  // Filtrar por sector
  const filterBySector = (sector) => {
    setActiveSector(sector);
    
    let filtered = ideas;
    
    // Aplicar búsqueda si existe
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(idea => 
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Aplicar filtro de sector
    if (sector !== 'Todos') {
      filtered = filtered.filter(idea => idea.sector === sector);
    }
    
    // Aplicar filtro de rango de potencial
    if (activePotentialRange !== 'Todos') {
      const range = potentialRanges.find(r => r.label === activePotentialRange);
      if (range) {
        filtered = filtered.filter(
          idea => idea.analysis.potentialScore >= range.min && 
                 idea.analysis.potentialScore <= range.max
        );
      }
    }
    
    setFilteredIdeas(filtered);
  };
  
  // Filtrar por rango de potencial
  const filterByPotential = (rangeLabel) => {
    setActivePotentialRange(rangeLabel);
    
    let filtered = ideas;
    
    // Aplicar búsqueda si existe
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(idea => 
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Aplicar filtro de sector
    if (activeSector !== 'Todos') {
      filtered = filtered.filter(idea => idea.sector === activeSector);
    }
    
    // Aplicar filtro de rango de potencial
    if (rangeLabel !== 'Todos') {
      const range = potentialRanges.find(r => r.label === rangeLabel);
      if (range) {
        filtered = filtered.filter(
          idea => idea.analysis.potentialScore >= range.min && 
                 idea.analysis.potentialScore <= range.max
        );
      }
    }
    
    setFilteredIdeas(filtered);
  };
  
  // Mostrar detalles de una idea
  const showIdeaDetails = (idea) => {
    setSelectedIdea(idea);
    setDetailDialogVisible(true);
  };
  
  // Mostrar análisis de una idea
  const showIdeaAnalysis = (idea) => {
    setSelectedIdea(idea);
    setAnalysisDialogVisible(true);
  };
  
  // Mostrar comentarios de una idea
  const showComments = (idea) => {
    setSelectedIdea(idea);
    // Cargar o generar comentarios para esta idea
    loadComments(idea);
    setCommentsDialogVisible(true);
  };
  
  // Cargar comentarios para una idea
  const loadComments = async (idea) => {
    try {
      // Intentar cargar comentarios guardados
      const savedComments = await AsyncStorage.getItem('userComments');
      const userComments = savedComments ? JSON.parse(savedComments) : [];
      
      // Si hay comentarios guardados, usarlos
      if (userComments.length > 0) {
        // Filtramos los comentarios para esta idea (en una app real tendría IDs relacionados)
        // Simulamos este comportamiento por ahora
        setCommentList(userComments.slice(0, 3));
        return;
      }
      
      // En caso de no tener comentarios guardados, usamos los de ejemplo
      const mockComments = [
        {
          id: '1',
          author: 'Ana Martínez',
          text: 'Gran idea con potencial real en el mercado actual. He visto proyectos similares que han tenido éxito.',
          date: '2023-12-01T10:15:00Z',
          analysis: {
            relevance: 'Alta',
            sentiment: 'Positivo',
            insightScore: 85,
            // Análisis detallado IA
            detailedAnalysis: {
              key_insights: [
                'Validación de mercado basada en experiencia previa',
                'Referencia indirecta a modelos de negocio similares exitosos',
                'Confirmación de existencia de demanda potencial'
              ],
              market_signals: {
                validation_level: 'Medio-alto',
                confidence: 87,
                supporting_evidence: 'Referencia a proyectos similares existentes'
              },
              intent_analysis: {
                primary_intent: 'Validación positiva',
                secondary_intent: 'Compartir experiencia relacionada',
                hidden_concerns: 'Ninguna detectada'
              },
              actionable_feedback: {
                priority: 'Media',
                suggested_actions: [
                  'Investigar proyectos similares mencionados implícitamente',
                  'Solicitar más detalles sobre casos de éxito observados'
                ],
                potential_pivot_points: []
              },
              semantic_categories: ['Validación', 'Experiencia de mercado', 'Optimismo'],
              competitive_intelligence: {
                indicator_type: 'Indirecto',
                market_readiness: 'Validada',
                saturation_risk: 'Bajo a medio'
              }
            }
          }
        },
        {
          id: '2',
          author: 'Miguel Torres',
          text: 'Me parece interesante pero habría que evaluar mejor la competencia existente.',
          date: '2023-12-02T14:30:00Z',
          analysis: {
            relevance: 'Media',
            sentiment: 'Neutro',
            insightScore: 65,
            // Análisis detallado IA
            detailedAnalysis: {
              key_insights: [
                'Preocupación por análisis insuficiente de competidores',
                'Reconocimiento de valor pero con reservas estratégicas',
                'Sugerencia implícita de fase adicional de investigación'
              ],
              market_signals: {
                validation_level: 'Medio',
                confidence: 62,
                supporting_evidence: 'Preocupación por análisis de competencia incompleto'
              },
              intent_analysis: {
                primary_intent: 'Señalar posible riesgo estratégico',
                secondary_intent: 'Sugerir mejora metodológica',
                hidden_concerns: 'Posible saturación de mercado no evaluada'
              },
              actionable_feedback: {
                priority: 'Alta',
                suggested_actions: [
                  'Realizar análisis DAFO de competidores principales',
                  'Identificar ventajas diferenciales respecto a soluciones actuales',
                  'Evaluar barreras de entrada al mercado objetivo'
                ],
                potential_pivot_points: ['Reenfoque en nicho desatendido', 'Diferenciación tecnológica']
              },
              semantic_categories: ['Cautela estratégica', 'Análisis competitivo', 'Validación parcial'],
              competitive_intelligence: {
                indicator_type: 'Directo',
                market_readiness: 'Cuestionada',
                saturation_risk: 'Medio a alto'
              }
            }
          }
        },
        {
          id: '3',
          author: 'Laura Sánchez',
          text: '¿Has considerado expandir esto a otros sectores? Podría funcionar bien en ámbitos educativos también.',
          date: '2023-12-03T09:45:00Z',
          analysis: {
            relevance: 'Alta',
            sentiment: 'Positivo',
            insightScore: 78,
            // Análisis detallado IA
            detailedAnalysis: {
              key_insights: [
                'Identificación de oportunidad de expansión intersectorial',
                'Validación implícita del modelo de negocio principal',
                'Sugerencia de pivote horizontal hacia sector educativo'
              ],
              market_signals: {
                validation_level: 'Alto',
                confidence: 81,
                supporting_evidence: 'Sugerencia específica de sector adicional viable'
              },
              intent_analysis: {
                primary_intent: 'Sugerir oportunidad de crecimiento',
                secondary_intent: 'Ampliar visión estratégica del proyecto',
                hidden_concerns: 'Posible percepción de limitación en enfoque actual'
              },
              actionable_feedback: {
                priority: 'Media-alta',
                suggested_actions: [
                  'Realizar estudio de viabilidad en sector educativo',
                  'Identificar adaptaciones necesarias para nuevo mercado',
                  'Evaluar recursos adicionales requeridos para expansión'
                ],
                potential_pivot_points: ['Expansión a sector educativo', 'Modelo multi-vertical']
              },
              semantic_categories: ['Expansión estratégica', 'Diversificación', 'Oportunidad de mercado'],
              competitive_intelligence: {
                indicator_type: 'Estratégico',
                market_readiness: 'Favorable para expansión',
                saturation_risk: 'Bajo en sectores sugeridos'
              }
            }
          }
        }
      ];
      
      // Guardamos en AsyncStorage para próximas visitas
      await AsyncStorage.setItem('userComments', JSON.stringify(mockComments));
      setCommentList(mockComments);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setCommentList([]);
    }
  };
  
  // Función para eliminar un comentario
  const deleteComment = async (commentId) => {
    Alert.alert(
      'Eliminar comentario',
      '¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Eliminar del estado local
              const updatedComments = commentList.filter(comment => comment.id !== commentId);
              setCommentList(updatedComments);
              
              // Actualizar en AsyncStorage
              const savedComments = await AsyncStorage.getItem('userComments');
              if (savedComments) {
                const allComments = JSON.parse(savedComments);
                const updatedAllComments = allComments.filter(comment => comment.id !== commentId);
                await AsyncStorage.setItem('userComments', JSON.stringify(updatedAllComments));
              }
              
              // Mostrar confirmación
              Alert.alert('Éxito', 'Comentario eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar comentario:', error);
              Alert.alert('Error', 'No se pudo eliminar el comentario. Inténtalo de nuevo.');
            }
          }
        }
      ]
    );
  };
  
  // Ir a crear nueva idea
  const navigateToCreateIdea = () => {
    navigation.navigate('CreateBusinessIdea');
  };
  
  // Mostrar análisis de un comentario
  const showCommentAnalysis = (comment) => {
    setSelectedComment(comment);
    setCommentAnalysisDialogVisible(true);
    
    // Eliminar el estado de carga, ya que no estamos usando la API directamente
    setCommentAnalysisLoading(false);
  };
  
  // Renderizar cada idea
  const renderIdeaItem = ({ item }) => (
    <Card style={styles.card} onPress={() => showIdeaDetails(item)}>
      <Card.Content>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.cardTags}>
          <Chip style={styles.sectorChip}>{item.sector}</Chip>
          {item.tags.slice(0, 2).map((tag, index) => (
            <Chip key={index} style={styles.tagChip}>{tag}</Chip>
          ))}
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.cardDate}>
            {formatDate(item.date)} • Por {item.author}
          </Text>
          <View style={styles.cardStats}>
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="heart-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => showComments(item)}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.analysisButton} 
              onPress={() => showIdeaAnalysis(item)}
            >
              <Text style={styles.analysisButtonText}>Ver análisis</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
  
  // Renderizar cada comentario
  const renderCommentItem = ({ item }) => (
    <Surface style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.commentAuthorContainer}>
          <Text style={styles.commentAuthor}>{item.author}</Text>
          <Text style={styles.commentDate}>{formatDate(item.date)}</Text>
        </View>
        <IconButton
          icon="trash-outline"
          iconColor="#FF5252"
          size={20}
          onPress={() => deleteComment(item.id)}
          style={styles.deleteCommentButton}
        />
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity 
          style={styles.commentActionButton}
          onPress={() => showCommentAnalysis(item)}
        >
          <Text style={styles.commentActionText}>Ver análisis de IA</Text>
        </TouchableOpacity>
      </View>
    </Surface>
  );
  
  // Modificar la función para limpiar los filtros
  const clearFilters = () => {
    setActiveSector('Todos');
    setActivePotentialRange('Todos');
    // Re-aplicar la búsqueda sin filtros
    onChangeSearch(searchQuery);
  };
  
  // Reemplazar la función mostrarConfigDialog
  const mostrarInfoGoogleAI = () => {
    // Mostrar información sobre Google AI
    Alert.alert(
      "Análisis con Google AI",
      "Esta aplicación utiliza Google AI para analizar ideas de negocio de forma automática, proporcionando información valiosa sobre el potencial de tu proyecto.",
      [{ text: "Entendido" }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ideas de Negocio" />
        <Appbar.Action icon="eye" onPress={() => navigation.navigate('Dashboard')} />
        <Appbar.Action icon="bell" onPress={navigateToNotifications} />
        <Appbar.Action icon="lightbulb" onPress={() => navigation.navigate('BusinessIdeas')} />
        <Appbar.Action icon="crown" color="#FFD700" onPress={navigateToSubscriptions} />
        <Appbar.Action icon="account" onPress={handleProfileNavigation} />
      </Appbar.Header>
      
      <Searchbar
        placeholder="Buscar ideas de negocio..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      {filtersVisible && (
        <Surface style={styles.filtersPanel}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterSectionTitle}>Sector:</Text>
            <Button 
              icon="filter-remove-outline" 
              mode="text" 
              compact={true}
              onPress={clearFilters}
            >
              Limpiar
            </Button>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {sectors.map((sector) => (
              <Chip
                key={sector}
                selected={activeSector === sector}
                onPress={() => filterBySector(sector)}
                style={styles.filterChip}
                textStyle={styles.filterChipText}
                selectedColor="#0088ff"
              >
                {sector}
              </Chip>
            ))}
          </ScrollView>
          
          <Text style={styles.filterSectionTitle}>Potencial:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {potentialRanges.map((range) => (
              <Chip
                key={range.label}
                selected={activePotentialRange === range.label}
                onPress={() => filterByPotential(range.label)}
                style={styles.filterChip}
                textStyle={styles.filterChipText}
                selectedColor={
                  range.label === '0-25' ? '#FF5252' :
                  range.label === '26-49' ? '#FF9800' :
                  range.label === '50-74' ? '#2196F3' :
                  range.label === '75-100' ? '#4CAF50' : '#0088ff'
                }
              >
                {range.label}
              </Chip>
            ))}
          </ScrollView>
        </Surface>
      )}
      
      {filtersVisible && (activeSector !== 'Todos' || activePotentialRange !== 'Todos') && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Filtros activos: 
            {activeSector !== 'Todos' ? ` Sector: ${activeSector}` : ''}
            {activePotentialRange !== 'Todos' ? ` Potencial: ${activePotentialRange}` : ''}
          </Text>
        </View>
      )}
      
      <FlatList
        data={filteredIdeas}
        renderItem={renderIdeaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <Portal>
        <FAB
          style={styles.fab}
          icon="plus"
          label="Nueva Idea de Negocio"
          onPress={() => navigation.navigate('CreateBusinessIdea')}
          visible={fabVisible}
        />
      </Portal>
      
      {/* Diálogo de detalles de la idea */}
      <Portal>
        <Dialog
          visible={detailDialogVisible}
          onDismiss={() => setDetailDialogVisible(false)}
          style={styles.dialog}
        >
          {selectedIdea && (
            <>
              <Dialog.Title>{selectedIdea.title}</Dialog.Title>
              <Dialog.Content>
                <Text style={styles.dialogDescription}>
                  {selectedIdea.description}
                </Text>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailSectionTitle}>Sector:</Text>
                  <Text>{selectedIdea.sector}</Text>
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailSectionTitle}>Etiquetas:</Text>
                  <View style={styles.tagsList}>
                    {selectedIdea.tags.map((tag, index) => (
                      <Chip key={index} style={styles.dialogTag}>{tag}</Chip>
                    ))}
                  </View>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDetailDialogVisible(false)}>Cerrar</Button>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    setDetailDialogVisible(false);
                    showIdeaAnalysis(selectedIdea);
                  }}
                >
                  Ver análisis
                </Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
      
      {/* Diálogo de análisis detallado de la idea */}
      <Portal>
        <Dialog
          visible={analysisDialogVisible}
          onDismiss={() => setAnalysisDialogVisible(false)}
          style={styles.analysisDialog}
        >
          {selectedIdea && (
            <>
              <Dialog.Title>Análisis detallado</Dialog.Title>
              <Dialog.ScrollArea style={styles.dialogScrollArea}>
                <ScrollView>
                  <View style={styles.detailedAnalysisContent}>
                    {/* Agregar aquí */}
                    {selectedIdea && selectedIdea.analysis.analyzedBy && (
                      <View style={styles.analysisSourceContainer}>
                        <Text style={styles.analysisSourceText}>
                          {selectedIdea.analysis.analyzedBy === 'Google AI' ? (
                            <View style={styles.aiTag}>
                              <Ionicons name="flash" size={16} color="#4CAF50" />
                              {' '}Analizado por Google AI
                            </View>
                          ) : null}
                        </Text>
                      </View>
                    )}
                    
                    {/* Puntuación y resumen */}
                    <Surface style={styles.analysisSectionSurface}>
                      <Text style={styles.analysisSectionTitle}>Puntuación y evaluación general</Text>
                      <View style={styles.scoreContainer}>
                        <View style={styles.scoreCircle}>
                          <Text style={styles.detailedScoreValue}>{selectedIdea.analysis.potentialScore}</Text>
                          <Text style={styles.scoreLabel}>Potencial</Text>
                        </View>
                      </View>
                      
                      <ProgressBar 
                        progress={selectedIdea.analysis.potentialScore / 100} 
                        color={
                          selectedIdea.analysis.potentialScore > 85 ? '#4CAF50' :
                          selectedIdea.analysis.potentialScore > 75 ? '#2196F3' :
                          selectedIdea.analysis.potentialScore > 65 ? '#FF9800' : '#F44336'
                        }
                        style={styles.detailedProgressBar}
                      />
                      
                      <Text style={styles.analysisSummaryText}>
                        {selectedIdea.analysis.recommendation}
                      </Text>
                    </Surface>
                    
                    {/* Factores destacados (solo si existen) */}
                    {selectedIdea.analysis.factores && (
                      <Surface style={styles.analysisSectionSurface}>
                        <Text style={styles.analysisSectionTitle}>Factores destacados</Text>
                        {selectedIdea.analysis.factores.map((factor, index) => (
                          <View key={index} style={styles.factorItem}>
                            <Text style={styles.factorBullet}>•</Text>
                            <Text style={styles.factorText}>{factor}</Text>
                          </View>
                        ))}
                      </Surface>
                    )}
                    
                    {/* Análisis de mercado (solo si existe esta información) */}
                    {selectedIdea.analysis.marketAnalysis && (
                      <Surface style={styles.analysisSectionSurface}>
                        <Text style={styles.analysisSectionTitle}>Análisis de mercado</Text>
                        <View style={styles.marketDataContainer}>
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Empresas activas:</Text>
                            <Text style={styles.marketDataValue}>
                              {selectedIdea.analysis.marketAnalysis.marketData.companiesCount.toLocaleString()}
                            </Text>
                          </View>
                          
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Crecimiento anual:</Text>
                            <Text style={styles.marketDataValue}>
                              {selectedIdea.analysis.marketAnalysis.marketData.marketGrowth}%
                            </Text>
                          </View>
                          
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Inversión total:</Text>
                            <Text style={styles.marketDataValue}>
                              {selectedIdea.analysis.marketAnalysis.marketData.investmentVolume}
                            </Text>
                          </View>
                          
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Valor promedio:</Text>
                            <Text style={styles.marketDataValue}>
                              {selectedIdea.analysis.marketAnalysis.marketData.avgCompanyValue}
                            </Text>
                          </View>
                          
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Índice saturación:</Text>
                            <Text style={styles.marketDataValue}>
                              {Math.round(selectedIdea.analysis.marketAnalysis.marketData.saturationIndex * 100)}%
                            </Text>
                          </View>
                        </View>
                      </Surface>
                    )}
                    
                    {/* Análisis de urgencia (solo si existe esta información) */}
                    {selectedIdea.analysis.urgencyAnalysis && (
                      <Surface style={styles.analysisSectionSurface}>
                        <Text style={styles.analysisSectionTitle}>Tendencias y urgencia</Text>
                        <View style={styles.urgencyDataContainer}>
                          <View style={styles.urgencyDataRow}>
                            <View style={styles.urgencyDataItem}>
                              <Text style={styles.urgencyDataLabel}>Tendencia:</Text>
                              <Text style={styles.urgencyDataValue}>
                                {selectedIdea.analysis.urgencyAnalysis.trend}
                              </Text>
                            </View>
                            
                            <View style={styles.urgencyDataItem}>
                              <Text style={styles.urgencyDataLabel}>Tasa de crecimiento:</Text>
                              <Text style={styles.urgencyDataValue}>
                                {selectedIdea.analysis.urgencyAnalysis.growthRate}
                              </Text>
                            </View>
                          </View>
                          
                          <View style={styles.urgencyDataRow}>
                            <View style={styles.urgencyDataItem}>
                              <Text style={styles.urgencyDataLabel}>Riesgo de disrupción:</Text>
                              <Text style={styles.urgencyDataValue}>
                                {selectedIdea.analysis.urgencyAnalysis.disruptionRisk}
                              </Text>
                            </View>
                            
                            <View style={styles.urgencyDataItem}>
                              <Text style={styles.urgencyDataLabel}>Tiempo al mercado:</Text>
                              <Text style={styles.urgencyDataValue}>
                                {selectedIdea.analysis.urgencyAnalysis.timeToMarket}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </Surface>
                    )}
                    
                    {/* Competidores destacados (solo si existe esta información) */}
                    {selectedIdea.analysis.competitorsData && (
                      <Surface style={styles.analysisSectionSurface}>
                        <Text style={styles.analysisSectionTitle}>Competidores destacados</Text>
                        {selectedIdea.analysis.competitorsData.map((company, index) => (
                          <Card key={index} style={styles.companyCard}>
                            <Card.Content>
                              <View style={styles.companyHeader}>
                                <Text style={styles.companyName}>{company.name}</Text>
                                <View style={styles.companyBadge}>
                                  <Text style={styles.companyInnovation}>
                                    Innovación: {company.innovationIndex}/100
                                  </Text>
                                </View>
                              </View>
                              
                              <Text style={styles.companyDescription}>
                                {company.description}
                              </Text>
                              
                              <Divider style={styles.companyDivider} />
                              
                              <View style={styles.companyDetailsContainer}>
                                <View style={styles.companyDetailItem}>
                                  <Text style={styles.companyDetailLabel}>Fundación:</Text>
                                  <Text style={styles.companyDetailValue}>{company.founded}</Text>
                                </View>
                                
                                <View style={styles.companyDetailItem}>
                                  <Text style={styles.companyDetailLabel}>Sede:</Text>
                                  <Text style={styles.companyDetailValue}>{company.hq}</Text>
                                </View>
                                
                                <View style={styles.companyDetailItem}>
                                  <Text style={styles.companyDetailLabel}>Cap. Mercado:</Text>
                                  <Text style={styles.companyDetailValue}>{company.marketCap}</Text>
                                </View>
                              </View>
                            </Card.Content>
                          </Card>
                        ))}
                      </Surface>
                    )}
                    
                    {/* Si no hay análisis avanzado, mostrar el análisis básico */}
                    {!selectedIdea.analysis.marketAnalysis && (
                      <Surface style={styles.analysisSectionSurface}>
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>Tamaño de mercado:</Text>
                          <Text>{selectedIdea.analysis.marketSize}</Text>
                        </View>
                        
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>Nivel de competencia:</Text>
                          <Text>{selectedIdea.analysis.competition}</Text>
                        </View>
                      </Surface>
                    )}
                  </View>
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={() => setAnalysisDialogVisible(false)}>Cerrar</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
      
      {/* Diálogo de comentarios */}
      <Portal>
        <Dialog
          visible={commentsDialogVisible}
          onDismiss={() => setCommentsDialogVisible(false)}
          style={styles.commentsDialog}
        >
          {selectedIdea && (
            <>
              <Dialog.Title>Comentarios</Dialog.Title>
              <Dialog.ScrollArea style={styles.commentsScrollArea}>
                <FlatList
                  data={commentList}
                  renderItem={renderCommentItem}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={
                    <Text style={styles.noCommentsText}>No hay comentarios todavía</Text>
                  }
                  contentContainerStyle={styles.commentsList}
                />
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={() => setCommentsDialogVisible(false)}>Cerrar</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
      
      {/* Diálogo de análisis detallado de comentario */}
      <Portal>
        <Dialog
          visible={commentAnalysisDialogVisible}
          onDismiss={() => setCommentAnalysisDialogVisible(false)}
          style={styles.commentAnalysisDialog}
        >
          {selectedComment && (
            <>
              <Dialog.Title>Análisis IA del comentario</Dialog.Title>
              {commentAnalysisLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0088ff" />
                  <Text style={styles.loadingText}>Analizando con Google AI...</Text>
                </View>
              ) : (
                <View style={styles.analysisSourceContainer}>
                  <Text style={styles.analysisSourceText}>
                    <Ionicons name="flash" size={16} color="#4CAF50" />
                    {' '}Analizado por Google AI
                  </Text>
                </View>
              )}
              <Dialog.ScrollArea style={styles.commentAnalysisScrollArea}>
                <ScrollView>
                  <View style={styles.commentAnalysisContent}>
                    {/* Cabecera del comentario */}
                    <Surface style={styles.commentAnalysisSurface}>
                      <View style={styles.commentSourceContainer}>
                        <Text style={styles.commentSourceLabel}>Comentario original:</Text>
                        <Text style={styles.commentSourceText}>"{selectedComment.text}"</Text>
                        <View style={styles.commentMetaRow}>
                          <Text style={styles.commentMetaText}>Por {selectedComment.author}</Text>
                          <Text style={styles.commentMetaText}>{formatDate(selectedComment.date)}</Text>
                        </View>
                      </View>
                    </Surface>

                    {/* Resumen de puntuación */}
                    <Surface style={styles.commentAnalysisSurface}>
                      <Text style={styles.commentAnalysisSectionTitle}>Evaluación general</Text>
                      <View style={styles.commentScoreContainer}>
                        <View style={styles.commentScoreRow}>
                          <View style={styles.commentScoreItem}>
                            <Text style={styles.commentScoreLabel}>Relevancia</Text>
                            <View style={[
                              styles.commentScoreBadge,
                              {backgroundColor: 
                                selectedComment.analysis.relevance === 'Alta' ? '#4CAF50' :
                                selectedComment.analysis.relevance === 'Media' ? '#FFC107' : '#9E9E9E'
                              }
                            ]}>
                              <Text style={styles.commentScoreBadgeText}>{selectedComment.analysis.relevance}</Text>
                            </View>
                          </View>
                          
                          <View style={styles.commentScoreItem}>
                            <Text style={styles.commentScoreLabel}>Sentimiento</Text>
                            <View style={[
                              styles.commentScoreBadge,
                              {backgroundColor: 
                                selectedComment.analysis.sentiment === 'Positivo' ? '#4CAF50' :
                                selectedComment.analysis.sentiment === 'Neutro' ? '#2196F3' : '#F44336'
                              }
                            ]}>
                              <Text style={styles.commentScoreBadgeText}>{selectedComment.analysis.sentiment}</Text>
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.commentValueScoreContainer}>
                          <Text style={styles.commentValueScoreLabel}>Valor aportado</Text>
                          <View style={styles.commentValueScoreCircle}>
                            <Text style={styles.commentValueScoreText}>{selectedComment.analysis.insightScore}</Text>
                          </View>
                          <ProgressBar 
                            progress={selectedComment.analysis.insightScore / 100}
                            color={
                              selectedComment.analysis.insightScore > 85 ? '#4CAF50' :
                              selectedComment.analysis.insightScore > 75 ? '#2196F3' :
                              selectedComment.analysis.insightScore > 65 ? '#FF9800' : '#F44336'
                            }
                            style={styles.commentScoreProgressBar}
                          />
                        </View>
                      </View>
                    </Surface>
                    
                    {/* Ideas clave extraídas */}
                    <Surface style={styles.commentAnalysisSurface}>
                      <Text style={styles.commentAnalysisSectionTitle}>Ideas clave extraídas</Text>
                      <View style={styles.commentKeyInsightsContainer}>
                        {selectedComment.analysis.detailedAnalysis.key_insights.map((insight, index) => (
                          <View key={index} style={styles.commentKeyInsightItem}>
                            <Text style={styles.commentKeyInsightBullet}>•</Text>
                            <Text style={styles.commentKeyInsightText}>{insight}</Text>
                          </View>
                        ))}
                      </View>
                    </Surface>
                    
                    {/* Análisis de intención */}
                    <Surface style={styles.commentAnalysisSurface}>
                      <Text style={styles.commentAnalysisSectionTitle}>Análisis de intención</Text>
                      <View style={styles.commentIntentContainer}>
                        <View style={styles.commentIntentItem}>
                          <Text style={styles.commentIntentLabel}>Intención principal:</Text>
                          <Text style={styles.commentIntentValue}>
                            {selectedComment.analysis.detailedAnalysis.intent_analysis.primary_intent}
                          </Text>
                        </View>
                        
                        <View style={styles.commentIntentItem}>
                          <Text style={styles.commentIntentLabel}>Intención secundaria:</Text>
                          <Text style={styles.commentIntentValue}>
                            {selectedComment.analysis.detailedAnalysis.intent_analysis.secondary_intent}
                          </Text>
                        </View>
                        
                        <View style={styles.commentIntentItem}>
                          <Text style={styles.commentIntentLabel}>Preocupaciones implícitas:</Text>
                          <Text style={styles.commentIntentValue}>
                            {selectedComment.analysis.detailedAnalysis.intent_analysis.hidden_concerns}
                          </Text>
                        </View>
                      </View>
                    </Surface>
                    
                    {/* Señales de mercado */}
                    <Surface style={styles.commentAnalysisSurface}>
                      <Text style={styles.commentAnalysisSectionTitle}>Señales de mercado</Text>
                      <View style={styles.commentMarketSignalsContainer}>
                        <View style={styles.commentMarketSignalRow}>
                          <View style={styles.commentMarketSignalItem}>
                            <Text style={styles.commentMarketSignalLabel}>Nivel de validación:</Text>
                            <Text style={styles.commentMarketSignalValue}>
                              {selectedComment.analysis.detailedAnalysis.market_signals.validation_level}
                            </Text>
                          </View>
                          
                          <View style={styles.commentMarketSignalItem}>
                            <Text style={styles.commentMarketSignalLabel}>Confianza:</Text>
                            <View style={styles.commentMarketSignalValueContainer}>
                              <Text style={styles.commentMarketSignalNumericValue}>
                                {selectedComment.analysis.detailedAnalysis.market_signals.confidence}%
                              </Text>
                              <View style={[
                                styles.commentMarketSignalIndicator,
                                {backgroundColor:
                                  selectedComment.analysis.detailedAnalysis.market_signals.confidence > 80 ? '#4CAF50' :
                                  selectedComment.analysis.detailedAnalysis.market_signals.confidence > 70 ? '#2196F3' :
                                  selectedComment.analysis.detailedAnalysis.market_signals.confidence > 60 ? '#FF9800' : '#F44336'
                                }
                              ]} />
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.commentMarketEvidenceContainer}>
                          <Text style={styles.commentMarketEvidenceLabel}>Evidencia de soporte:</Text>
                          <Text style={styles.commentMarketEvidenceValue}>
                            {selectedComment.analysis.detailedAnalysis.market_signals.supporting_evidence}
                          </Text>
                        </View>
                      </View>
                    </Surface>

                    {/* Acciones recomendadas */}
                    <Surface style={styles.commentAnalysisSurface}>
                      <Text style={styles.commentAnalysisSectionTitle}>Acciones recomendadas</Text>
                      <View style={styles.commentActionsContainer}>
                        <View style={styles.commentActionsPriorityRow}>
                          <Text style={styles.commentActionsPriorityLabel}>Prioridad:</Text>
                          <View style={[
                            styles.commentActionsPriorityBadge,
                            {backgroundColor: 
                              selectedComment.analysis.detailedAnalysis.actionable_feedback.priority === 'Alta' ? '#F44336' :
                              selectedComment.analysis.detailedAnalysis.actionable_feedback.priority === 'Media-alta' ? '#FF9800' :
                              selectedComment.analysis.detailedAnalysis.actionable_feedback.priority === 'Media' ? '#2196F3' : '#4CAF50'
                            }
                          ]}>
                            <Text style={styles.commentActionsPriorityText}>
                              {selectedComment.analysis.detailedAnalysis.actionable_feedback.priority}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.commentActionsSubtitle}>Acciones sugeridas:</Text>
                        {selectedComment.analysis.detailedAnalysis.actionable_feedback.suggested_actions.map((action, index) => (
                          <View key={index} style={styles.commentActionItem}>
                            <Text style={styles.commentActionItemNumber}>{index + 1}.</Text>
                            <Text style={styles.commentActionItemText}>{action}</Text>
                          </View>
                        ))}
                        
                        {selectedComment.analysis.detailedAnalysis.actionable_feedback.potential_pivot_points.length > 0 && (
                          <>
                            <Text style={styles.commentActionsSubtitle}>Posibles pivotes:</Text>
                            {selectedComment.analysis.detailedAnalysis.actionable_feedback.potential_pivot_points.map((pivot, index) => (
                              <View key={index} style={styles.commentPivotItem}>
                                <Text style={styles.commentPivotItemBullet}>•</Text>
                                <Text style={styles.commentPivotItemText}>{pivot}</Text>
                              </View>
                            ))}
                          </>
                        )}
                      </View>
                    </Surface>

                    {/* Categorías semánticas */}
                    <Surface style={styles.commentAnalysisSurface}>
                      <Text style={styles.commentAnalysisSectionTitle}>Categorías semánticas</Text>
                      <View style={styles.commentCategoriesContainer}>
                        {selectedComment.analysis.detailedAnalysis.semantic_categories.map((category, index) => (
                          <Chip
                            key={index}
                            style={styles.commentCategoryChip}
                            textStyle={styles.commentCategoryChipText}
                          >
                            {category}
                          </Chip>
                        ))}
                      </View>
                    </Surface>

                    {/* Inteligencia competitiva */}
                    <Surface style={styles.commentAnalysisSurface}>
                      <Text style={styles.commentAnalysisSectionTitle}>Inteligencia competitiva</Text>
                      <View style={styles.commentCompetitiveContainer}>
                        <View style={styles.commentCompetitiveItem}>
                          <Text style={styles.commentCompetitiveLabel}>Tipo de indicador:</Text>
                          <Text style={styles.commentCompetitiveValue}>
                            {selectedComment.analysis.detailedAnalysis.competitive_intelligence.indicator_type}
                          </Text>
                        </View>
                        
                        <View style={styles.commentCompetitiveItem}>
                          <Text style={styles.commentCompetitiveLabel}>Preparación del mercado:</Text>
                          <Text style={styles.commentCompetitiveValue}>
                            {selectedComment.analysis.detailedAnalysis.competitive_intelligence.market_readiness}
                          </Text>
                        </View>
                        
                        <View style={styles.commentCompetitiveItem}>
                          <Text style={styles.commentCompetitiveLabel}>Riesgo de saturación:</Text>
                          <Text style={styles.commentCompetitiveValue}>
                            {selectedComment.analysis.detailedAnalysis.competitive_intelligence.saturation_risk}
                          </Text>
                        </View>
                      </View>
                    </Surface>
                  </View>
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={() => setCommentAnalysisDialogVisible(false)}>Cerrar</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>

      <Portal>
        <FAB
          style={styles.fab}
          icon="information"
          label="Información"
          onPress={() => setInfoDialogVisible(true)}
        />
      </Portal>

      <Portal>
        <Dialog visible={infoDialogVisible} onDismiss={() => setInfoDialogVisible(false)}>
          <Dialog.Title>Acerca de las Ideas de Negocio</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.infoText}>
              ¿Tienes una idea de negocio increíble que nunca has podido desarrollar? En NexWise puedes compartir tu visión y ganar dinero, conectando con personas dispuestas a hacerla realidad. ¡Convierte tu creatividad en éxito y forma parte de un ecosistema emprendedor vibrante!
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setInfoDialogVisible(false)}>Entendido</Button>
          </Dialog.Actions>
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
  searchbar: {
    margin: 10,
    elevation: 1,
    backgroundColor: '#fff',
  },
  filtersContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  filterChip: {
    marginHorizontal: 4,
    height: 36,
  },
  filterChipText: {
    fontSize: 13,
    lineHeight: 16, // Asegurar que el texto no se corte
  },
  listContainer: {
    padding: 10,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  sectorChip: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#e7f3ff',
    height: 28, // Altura fija para evitar problemas de recorte
  },
  tagChip: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
    height: 28, // Altura fija para evitar problemas de recorte
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  statText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#666',
  },
  analysisButton: {
    marginLeft: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  analysisButtonText: {
    fontSize: 12,
    color: '#0066cc',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 16,
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogDescription: {
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dialogTag: {
    marginRight: 6,
    marginBottom: 6,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  scoreTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0088ff',
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#0088ff',
    borderRadius: 4,
    marginTop: 8,
  },
  analysisSection: {
    marginBottom: 12,
  },
  analysisSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#0066cc',
  },
  recommendation: {
    fontStyle: 'italic',
    color: '#0066cc',
  },
  analysisDialog: {
    maxHeight: '90%',
    borderRadius: 8,
  },
  dialogScrollArea: {
    maxHeight: 500,
  },
  detailedAnalysisContent: {
    padding: 8,
  },
  analysisSectionSurface: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0088ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  detailedScoreValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: 'white',
    fontSize: 12,
  },
  detailedProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  analysisSummaryText: {
    lineHeight: 20,
    fontSize: 15,
    color: '#424242',
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  factorBullet: {
    fontSize: 18,
    marginRight: 8,
    color: '#0088ff',
  },
  factorText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
  },
  marketDataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  marketDataItem: {
    width: '48%',
    marginBottom: 12,
  },
  marketDataLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  marketDataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  urgencyDataContainer: {
    marginBottom: 16,
  },
  urgencyDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  urgencyDataItem: {
    width: '48%',
  },
  urgencyDataLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  urgencyDataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  companyCard: {
    marginBottom: 12,
    elevation: 2,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  companyBadge: {
    backgroundColor: '#e8eaf6',
    borderRadius: 4,
    padding: 4,
  },
  companyInnovation: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  companyDescription: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 12,
    lineHeight: 20,
  },
  companyDivider: {
    marginVertical: 8,
  },
  companyDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  companyDetailItem: {
    width: '48%',
    marginBottom: 8,
  },
  companyDetailLabel: {
    fontSize: 12,
    color: '#757575',
  },
  companyDetailValue: {
    fontSize: 14,
    color: '#424242',
  },
  commentsDialog: {
    maxHeight: '80%',
  },
  commentsScrollArea: {
    maxHeight: 400,
  },
  commentsList: {
    padding: 8,
  },
  commentCard: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentAuthorContainer: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#424242',
  },
  commentDate: {
    fontSize: 12,
    color: '#757575',
  },
  commentText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  commentActionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: '#0066cc',
  },
  noCommentsText: {
    textAlign: 'center',
    margin: 20,
    color: '#757575',
  },
  commentAnalysisDialog: {
    maxHeight: '90%',
    borderRadius: 8,
  },
  commentAnalysisScrollArea: {
    maxHeight: 550,
  },
  commentAnalysisContent: {
    padding: 8,
  },
  commentAnalysisSurface: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  commentAnalysisSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0066cc',
  },
  commentSourceContainer: {
    marginBottom: 8,
  },
  commentSourceLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  commentSourceText: {
    fontSize: 15,
    color: '#424242',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  commentMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentMetaText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  commentScoreContainer: {
    marginVertical: 8,
  },
  commentScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  commentScoreItem: {
    alignItems: 'center',
    width: '48%',
  },
  commentScoreLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  commentScoreBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  commentScoreBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentValueScoreContainer: {
    alignItems: 'center',
  },
  commentValueScoreLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  commentValueScoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0088ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentValueScoreText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  commentScoreProgressBar: {
    height: 8,
    borderRadius: 4,
    width: 200,
  },
  commentKeyInsightsContainer: {
    marginVertical: 4,
  },
  commentKeyInsightItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  commentKeyInsightBullet: {
    fontSize: 18,
    marginRight: 8,
    color: '#0088ff',
  },
  commentKeyInsightText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
  },
  commentIntentContainer: {
    marginVertical: 4,
  },
  commentIntentItem: {
    marginBottom: 12,
  },
  commentIntentLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  commentIntentValue: {
    fontSize: 15,
    color: '#424242',
    fontWeight: '500',
  },
  commentMarketSignalsContainer: {
    marginVertical: 4,
  },
  commentMarketSignalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  commentMarketSignalItem: {
    width: '48%',
  },
  commentMarketSignalLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  commentMarketSignalValue: {
    fontSize: 15,
    color: '#424242',
    fontWeight: '500',
  },
  commentMarketSignalValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentMarketSignalNumericValue: {
    fontSize: 15,
    color: '#424242',
    fontWeight: '500',
    marginRight: 8,
  },
  commentMarketSignalIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  commentMarketEvidenceContainer: {
    marginTop: 4,
  },
  commentMarketEvidenceLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  commentMarketEvidenceValue: {
    fontSize: 15,
    color: '#424242',
    fontStyle: 'italic',
  },
  commentActionsContainer: {
    marginVertical: 4,
  },
  commentActionsPriorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentActionsPriorityLabel: {
    fontSize: 14,
    color: '#757575',
    marginRight: 8,
  },
  commentActionsPriorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  commentActionsPriorityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentActionsSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
    marginTop: 4,
  },
  commentActionItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  commentActionItemNumber: {
    fontSize: 15,
    color: '#0088ff',
    marginRight: 8,
    fontWeight: 'bold',
  },
  commentActionItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
  },
  commentPivotItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  commentPivotItemBullet: {
    fontSize: 18,
    marginRight: 8,
    color: '#FF9800',
  },
  commentPivotItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
  },
  commentCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  commentCategoryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e8f5e9',
  },
  commentCategoryChipText: {
    color: '#2e7d32',
  },
  commentCompetitiveContainer: {
    marginVertical: 4,
  },
  commentCompetitiveItem: {
    marginBottom: 12,
  },
  commentCompetitiveLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  commentCompetitiveValue: {
    fontSize: 15,
    color: '#424242',
    fontWeight: '500',
  },
  deleteCommentButton: {
    margin: 0,
    padding: 0,
  },
  filterSectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  filtersPanel: {
    padding: 10,
    elevation: 4,
    borderRadius: 0,
    backgroundColor: '#fff',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeFiltersContainer: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeFiltersText: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  appBar: {
    backgroundColor: '#0088ff',
  },
  analysisSourceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  analysisSourceText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  factCheckingContainer: {
    padding: 8,
  },
  factCheckingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  factCheckingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  factCheckingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  factCheckingBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  verifiedClaimsContainer: {
    marginTop: 8,
  },
  verifiedClaimsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
  },
  verifiedClaimItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  verifiedClaimText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  verificationResultText: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    paddingLeft: 16,
  },
  marketContextSection: {
    marginBottom: 12,
  },
  marketContextSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
  },
  marketContextItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 8,
  },
  marketContextBullet: {
    fontSize: 16,
    marginRight: 6,
    color: '#666',
  },
  marketContextText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
  competitorsList: {
    marginTop: 8,
  },
  competitorItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 4,
    borderRadius: 4,
  },
  infoText: {
    marginBottom: 16,
    textAlign: 'justify',
  },
}); 