import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  Text,
  Appbar,
  TextInput,
  Button,
  Chip,
  Menu,
  Divider,
  ProgressBar,
  Surface,
  Snackbar,
  Dialog,
  Portal,
  ActivityIndicator,
  Card,
  IconButton,
  List
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { analyzeBusinessIdea as analyzeIdeaService, saveAnalysisFeedback } from './services/analysis';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';

// Sectores disponibles
const SECTORS = [
  'Finanzas',
  'Sostenibilidad',
  'Educación',
  'Tecnología',
  'Salud',
  'Agricultura',
  'Transporte',
  'Energía',
  'Turismo',
  'Otros'
];

export default function CreateBusinessIdea() {
  const navigation = useNavigation();
  
  // Estados para el formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState([]);
  
  // Estados para el menú
  const [sectorMenuVisible, setSectorMenuVisible] = useState(false);
  
  // Estados para el análisis y guardado
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [analysisDialogVisible, setAnalysisDialogVisible] = useState(false);
  
  // Estado para el usuario actual
  const [userProfile, setUserProfile] = useState(null);
  
  // Reemplazar el estado y función de verificación de IA
  // const [isUsingAI, setIsUsingAI] = useState(false);
  const [isUsingAI] = useState(true); // IA siempre activa
  
  // Nuevo estado para archivos multimedia
  const [attachments, setAttachments] = useState([]);
  
  // Cargar información del usuario al iniciar
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('userProfile');
        if (profileData) {
          setUserProfile(JSON.parse(profileData));
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };
    
    loadUserProfile();
  }, []);
  
  // Solicitar permisos al montar el componente
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Se necesitan permisos', 'La aplicación necesita permisos para acceder a la galería.');
      }
    })();
  }, []);
  
  // Función para agregar etiquetas
  const addTag = () => {
    if (tagsInput.trim()) {
      // Dividir por comas y limpiar
      const newTags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Añadir a las etiquetas existentes
      setTags([...new Set([...tags, ...newTags])]);
      setTagsInput('');
    }
  };
  
  // Función para eliminar una etiqueta
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Validar formulario
  const isFormValid = () => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      sector.trim().length > 0 &&
      tags.length > 0
    );
  };
  
  // Función para analizar la idea de negocio
  const analyzeBusinessIdea = async () => {
    try {
      // Validación básica
      if (!title.trim()) {
        setSnackbarMessage('El título es obligatorio');
        setSnackbarVisible(true);
        return;
      }
      
      if (!description.trim()) {
        setSnackbarMessage('La descripción es obligatoria');
        setSnackbarVisible(true);
        return;
      }
      
      if (!sector || sector === 'Seleccionar sector') {
        setSnackbarMessage('Debes seleccionar un sector para continuar');
        setSnackbarVisible(true);
        return;
      }
      
      if (tags.length === 0) {
        setSnackbarMessage('Agrega al menos una etiqueta');
        setSnackbarVisible(true);
        return;
      }
      
      // Comenzar análisis
      setIsAnalyzing(true);
      
      // Preparar datos
      const ideaData = {
        id: Crypto.randomUUID(),
        title: title,
        description: description,
        sector: sector,
        tags: tags,
        date: new Date().toISOString(),
        author: userProfile ? `${userProfile.name}` : 'Usuario',
      };
      
      // Analizar la idea
      try {
        const analysisResult = await analyzeIdeaService(ideaData);
        
        if (analysisResult.error) {
          // Error específico del análisis de IA
          setSnackbarMessage(analysisResult.message || 'Error al analizar la idea');
          setSnackbarVisible(true);
          setIsAnalyzing(false);
          return;
        }
        
        // Establecer el análisis y mostrar diálogo
        setAnalysis(analysisResult);
        setAnalysisDialogVisible(true);
      } catch (error) {
        console.error('Error en el análisis:', error);
        setSnackbarMessage('Ocurrió un error al analizar la idea');
        setSnackbarVisible(true);
      } finally {
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Error general:', error);
      setSnackbarMessage('Ocurrió un error inesperado');
      setSnackbarVisible(true);
      setIsAnalyzing(false);
    }
  };
  
  // Función para guardar la idea de negocio
  const saveBusinessIdea = async () => {
    if (!analysis) {
      setSnackbarMessage('Primero analiza tu idea de negocio');
      setSnackbarVisible(true);
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Crear el objeto de idea de negocio
      const newBusinessIdea = {
        id: Crypto.randomUUID(),
        title,
        description,
        sector,
        tags,
        date: new Date().toISOString(),
        author: userProfile?.name || 'Usuario',
        likes: 0,
        comments: 0,
        analysis: {
          potentialScore: analysis.potentialScore,
          marketSize: analysis.marketSize,
          competition: analysis.competition,
          recommendation: analysis.recommendation,
          factores: analysis.factores,
          marketAnalysis: analysis.marketAnalysis,
          urgencyAnalysis: analysis.urgencyAnalysis,
          competitorsData: analysis.competitorsData
        },
        attachments: attachments.map(att => ({
          type: att.type,
          uri: att.uri,
          name: att.name,
          size: att.size
        })),
      };
      
      // Obtener ideas existentes
      let businessIdeas = [];
      try {
        const savedIdeasStr = await AsyncStorage.getItem('businessIdeas');
        if (savedIdeasStr) {
          businessIdeas = JSON.parse(savedIdeasStr);
        }
      } catch (error) {
        console.warn('No se encontraron ideas guardadas:', error);
      }
      
      // Guardar la nueva idea
      businessIdeas.unshift(newBusinessIdea);
      await AsyncStorage.setItem('businessIdeas', JSON.stringify(businessIdeas));
      
      // Mostrar confirmación
      setSnackbarMessage('Idea de negocio guardada con éxito');
      setSnackbarVisible(true);
      
      // Limpiar el formulario y navegar de vuelta
      setTimeout(() => {
        navigation.navigate('BusinessIdeas', { newIdea: newBusinessIdea });
      }, 1000);
    } catch (error) {
      console.error('Error al guardar la idea:', error);
      setSnackbarMessage('Error al guardar la idea');
      setSnackbarVisible(true);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Manejar envío de retroalimentación
  const submitAnalysisFeedback = async () => {
    if (feedbackValue === 0) {
      setSnackbarMessage('Por favor selecciona una calificación');
      setSnackbarVisible(true);
      return;
    }
    
    try {
      // Enviar retroalimentación al servicio
      await saveAnalysisFeedback({
        analysisId: analysis.timestamp,
        rating: feedbackValue,
        comment: feedbackComment,
        userId: userProfile?.id || 'guest',
        businessIdeaTitle: title
      });
      
      setFeedbackVisible(false);
      setSnackbarMessage('Gracias por tu retroalimentación');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error al enviar retroalimentación:', error);
      setSnackbarMessage('Error al enviar tu retroalimentación');
      setSnackbarVisible(true);
    }
  };
  
  // Función para seleccionar imágenes
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        const newAttachment = {
          type: 'image',
          uri: result.assets[0].uri,
          name: result.assets[0].uri.split('/').pop(),
        };
        setAttachments([...attachments, newAttachment]);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };
  
  // Función para seleccionar documentos
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        const newAttachment = {
          type: 'document',
          uri: result.uri,
          name: result.name,
          size: result.size,
        };
        setAttachments([...attachments, newAttachment]);
      }
    } catch (error) {
      console.error('Error al seleccionar documento:', error);
      Alert.alert('Error', 'No se pudo seleccionar el documento');
    }
  };
  
  // Función para eliminar un archivo adjunto
  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Crear idea de negocio" />
      </Appbar.Header>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              <TextInput
                label="Título de la idea"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={styles.input}
              />
              
              <TextInput
                label="Descripción detallada"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={5}
                style={styles.textArea}
              />
              
              <Menu
                visible={sectorMenuVisible}
                onDismiss={() => setSectorMenuVisible(false)}
                anchor={(
                  <TouchableOpacity
                    ref={(ref) => {/* Este ref es necesario para que el menú se muestre */}}
                    style={[styles.sectorPicker, !sector && styles.sectorPickerRequired]}
                    onPress={() => setSectorMenuVisible(true)}
                  >
                    <Text style={[styles.sectorPickerText, !sector && styles.sectorPickerTextEmpty]}>
                      {sector || 'Seleccionar sector *'}
                    </Text>
                  </TouchableOpacity>
                )}
              >
                {SECTORS.map((item) => (
                  <Menu.Item
                    key={item}
                    onPress={() => {
                      setSector(item);
                      setSectorMenuVisible(false);
                    }}
                    title={item}
                  />
                ))}
              </Menu>
              
              <View style={styles.tagsContainer}>
                <View style={styles.tagsInputContainer}>
                  <TextInput
                    label="Etiquetas (separadas por comas)"
                    value={tagsInput}
                    onChangeText={setTagsInput}
                    mode="outlined"
                    style={styles.tagsInput}
                    onSubmitEditing={addTag}
                  />
                  <Button 
                    mode="contained" 
                    onPress={addTag}
                    style={styles.tagButton}
                  >
                    Añadir
                  </Button>
                </View>
                
                <View style={styles.tagsList}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeTag(tag)}
                      style={styles.chip}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
              
              {isUsingAI && (
                <Chip 
                  icon="brain" 
                  mode="outlined" 
                  style={styles.aiChip}
                >
                  Análisis con IA
                </Chip>
              )}
              
              <Button 
                mode="contained" 
                onPress={analyzeBusinessIdea}
                style={styles.analyzeButton}
                loading={isAnalyzing}
                disabled={isAnalyzing || !isFormValid()}
              >
                Analizar idea
              </Button>
              
              {analysis && (
                <View style={styles.analysisResult}>
                  <Surface style={styles.analysisSurface}>
                    <Text style={styles.potentialScore}>
                      Puntuación: <Text style={styles.scoreValue}>{analysis.potentialScore}/100</Text>
                    </Text>
                    
                    <ProgressBar 
                      progress={analysis.potentialScore / 100} 
                      color={
                        analysis.potentialScore > 85 ? '#4CAF50' :
                        analysis.potentialScore > 75 ? '#2196F3' :
                        analysis.potentialScore > 65 ? '#FF9800' : '#F44336'
                      }
                      style={styles.progressBar}
                    />
                    
                    <View style={styles.analysisSummary}>
                      <View style={styles.analysisItem}>
                        <Text style={styles.analysisLabel}>Tamaño de mercado:</Text>
                        <Text style={styles.analysisValue}>{analysis.marketSize}</Text>
                      </View>
                      
                      <View style={styles.analysisItem}>
                        <Text style={styles.analysisLabel}>Competencia:</Text>
                        <Text style={styles.analysisValue}>{analysis.competition}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.recommendationContainer}>
                      <Text style={styles.recommendationLabel}>Recomendación:</Text>
                      <Text style={styles.recommendation}>
                        {analysis.recommendation}
                      </Text>
                    </View>
                    
                    <Button 
                      mode="outlined" 
                      onPress={() => setFeedbackVisible(true)}
                      style={styles.feedbackButton}
                    >
                      ¿Qué te pareció este análisis?
                    </Button>
                    
                    <Button 
                      mode="contained" 
                      onPress={saveBusinessIdea}
                      style={styles.saveButton}
                      loading={isSaving}
                      disabled={isSaving}
                    >
                      Guardar idea
                    </Button>
                  </Surface>
                </View>
              )}
              
              <View style={styles.attachmentsSection}>
                <Text style={styles.sectionTitle}>Archivos adjuntos</Text>
                <View style={styles.attachmentButtons}>
                  <Button
                    mode="outlined"
                    icon="image"
                    onPress={pickImage}
                    style={styles.attachButton}
                  >
                    Imagen
                  </Button>
                  <Button
                    mode="outlined"
                    icon="file"
                    onPress={pickDocument}
                    style={styles.attachButton}
                  >
                    Documento
                  </Button>
                </View>
                
                {attachments.length > 0 && (
                  <View style={styles.attachmentsList}>
                    {attachments.map((file, index) => (
                      <Surface key={index} style={styles.attachmentItem}>
                        <View style={styles.attachmentInfo}>
                          {file.type === 'image' ? (
                            <Image
                              source={{ uri: file.uri }}
                              style={styles.attachmentThumbnail}
                            />
                          ) : (
                            <List.Icon icon="file-document" />
                          )}
                          <Text numberOfLines={1} style={styles.attachmentName}>
                            {file.name}
                          </Text>
                        </View>
                        <IconButton
                          icon="close"
                          size={20}
                          onPress={() => removeAttachment(index)}
                        />
                      </Surface>
                    ))}
                  </View>
                )}
              </View>
              
              <View style={{height: 80}} />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      {/* Diálogo de análisis detallado */}
      <Portal>
        <Dialog
          visible={analysisDialogVisible}
          onDismiss={() => setAnalysisDialogVisible(false)}
          style={styles.detailedAnalysisDialog}
        >
          <Dialog.Title>Análisis detallado</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <ScrollView>
              {analysis ? (
                <View style={styles.detailedAnalysisContent}>
                  {/* Puntuación y resumen */}
                  <Surface style={styles.analysisSectionSurface}>
                    <Text style={styles.analysisSectionTitle}>Puntuación y evaluación general</Text>
                    <View style={styles.scoreContainer}>
                      <View style={styles.scoreCircle}>
                        <Text style={styles.detailedScoreValue}>{analysis.potentialScore}</Text>
                        <Text style={styles.scoreLabel}>Potencial</Text>
                      </View>
                    </View>
                    
                    <ProgressBar 
                      progress={analysis.potentialScore / 100} 
                      color={
                        analysis.potentialScore > 85 ? '#4CAF50' :
                        analysis.potentialScore > 75 ? '#2196F3' :
                        analysis.potentialScore > 65 ? '#FF9800' : '#F44336'
                      }
                      style={styles.detailedProgressBar}
                    />
                    
                    <Text style={styles.analysisSummaryText}>
                      {analysis.recommendation}
                    </Text>
                  </Surface>
                  
                  {/* Factores destacados */}
                  <Surface style={styles.analysisSectionSurface}>
                    <Text style={styles.analysisSectionTitle}>Factores destacados</Text>
                    {analysis.factores.map((factor, index) => (
                      <View key={index} style={styles.factorItem}>
                        <Text style={styles.factorBullet}>•</Text>
                        <Text style={styles.factorText}>{factor}</Text>
                      </View>
                    ))}
                  </Surface>
                  
                  {/* Análisis de mercado */}
                  <Surface style={styles.analysisSectionSurface}>
                    <Text style={styles.analysisSectionTitle}>Análisis de mercado</Text>
                    <View style={styles.marketDataContainer}>
                      {analysis.marketAnalysis && analysis.marketAnalysis.marketData ? (
                        <>
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Empresas activas:</Text>
                            <Text style={styles.marketDataValue}>
                              {analysis.marketAnalysis.marketData.companiesCount?.toLocaleString() || 'N/A'}
                            </Text>
                          </View>
                          
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Crecimiento anual:</Text>
                            <Text style={styles.marketDataValue}>
                              {analysis.marketAnalysis.marketData.marketGrowth || 0}%
                            </Text>
                          </View>
                          
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Inversión total:</Text>
                            <Text style={styles.marketDataValue}>
                              {analysis.marketAnalysis.marketData.investmentVolume || 'N/A'}
                            </Text>
                          </View>
                          
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Valor promedio:</Text>
                            <Text style={styles.marketDataValue}>
                              {analysis.marketAnalysis.marketData.avgCompanyValue || 'N/A'}
                            </Text>
                          </View>
                          
                          <View style={styles.marketDataItem}>
                            <Text style={styles.marketDataLabel}>Índice saturación:</Text>
                            <Text style={styles.marketDataValue}>
                              {analysis.marketAnalysis.marketData.saturationIndex ? 
                                `${Math.round(analysis.marketAnalysis.marketData.saturationIndex * 100)}%` : 
                                'N/A'}
                            </Text>
                          </View>
                        </>
                      ) : (
                        <Text style={styles.noDataText}>Datos de mercado no disponibles</Text>
                      )}
                    </View>
                  </Surface>
                  
                  {/* Análisis de urgencia */}
                  <Surface style={styles.analysisSectionSurface}>
                    <Text style={styles.analysisSectionTitle}>Tendencias y urgencia</Text>
                    {analysis.urgencyAnalysis ? (
                      <>
                        <View style={styles.urgencyDataContainer}>
                          <View style={styles.urgencyDataRow}>
                            <View style={styles.urgencyDataItem}>
                              <Text style={styles.urgencyDataLabel}>Tendencia:</Text>
                              <Text style={styles.urgencyDataValue}>
                                {analysis.urgencyAnalysis.trend || 'N/A'}
                              </Text>
                            </View>
                            
                            <View style={styles.urgencyDataItem}>
                              <Text style={styles.urgencyDataLabel}>Tasa de crecimiento:</Text>
                              <Text style={styles.urgencyDataValue}>
                                {analysis.urgencyAnalysis.growthRate || 'N/A'}
                              </Text>
                            </View>
                          </View>
                          
                          <View style={styles.urgencyDataRow}>
                            <View style={styles.urgencyDataItem}>
                              <Text style={styles.urgencyDataLabel}>Riesgo de disrupción:</Text>
                              <Text style={styles.urgencyDataValue}>
                                {analysis.urgencyAnalysis.disruptionRisk || 'N/A'}
                              </Text>
                            </View>
                            
                            <View style={styles.urgencyDataItem}>
                              <Text style={styles.urgencyDataLabel}>Tiempo al mercado:</Text>
                              <Text style={styles.urgencyDataValue}>
                                {analysis.urgencyAnalysis.timeToMarket || 'N/A'}
                              </Text>
                            </View>
                          </View>
                        </View>
                        
                        <Text style={styles.urgencyExplanation}>
                          {analysis.urgencyAnalysis.trend ? (
                            analysis.urgencyAnalysis.trend === 'Acelerada' ? 
                              `Con una tendencia ${analysis.urgencyAnalysis.trend.toLowerCase()} y un riesgo de disrupción ${analysis.urgencyAnalysis.disruptionRisk?.toLowerCase() || 'no determinado'}, este mercado se está moviendo rápidamente. Es recomendable actuar con prontitud en un plazo de ${analysis.urgencyAnalysis.timeToMarket || 'por determinar'}.` :
                              analysis.urgencyAnalysis.trend === 'Creciente' ? 
                              `La tendencia ${analysis.urgencyAnalysis.trend.toLowerCase()} y un crecimiento de ${analysis.urgencyAnalysis.growthRate || 'no determinado'} indican una ventana de oportunidad favorable, con un tiempo estimado al mercado de ${analysis.urgencyAnalysis.timeToMarket || 'por determinar'}.` :
                              `Con una tendencia ${analysis.urgencyAnalysis.trend.toLowerCase()} y un riesgo de disrupción ${analysis.urgencyAnalysis.disruptionRisk?.toLowerCase() || 'no determinado'}, hay tiempo suficiente para desarrollar una estrategia óptima en un plazo de ${analysis.urgencyAnalysis.timeToMarket || 'por determinar'}.`
                          ) : 'Análisis de urgencia no disponible'}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.noDataText}>Datos de urgencia no disponibles</Text>
                    )}
                  </Surface>
                  
                  {/* Competidores destacados */}
                  <Surface style={styles.analysisSectionSurface}>
                    <Text style={styles.analysisSectionTitle}>Competidores destacados</Text>
                    {analysis.competitorsData && analysis.competitorsData.length > 0 ? (
                      analysis.competitorsData.map((company, index) => (
                        <Card key={index} style={styles.companyCard}>
                          <Card.Content>
                            <View style={styles.companyHeader}>
                              <Text style={styles.companyName}>{company.name || 'Empresa sin nombre'}</Text>
                              <View style={styles.companyBadge}>
                                <Text style={styles.companyInnovation}>
                                  Innovación: {company.innovationIndex || 0}/100
                                </Text>
                              </View>
                            </View>
                            
                            <Text style={styles.companyDescription}>
                              {company.description || 'Sin descripción disponible'}
                            </Text>
                            
                            <Divider style={styles.companyDivider} />
                            
                            <View style={styles.companyDetailsContainer}>
                              <View style={styles.companyDetailItem}>
                                <Text style={styles.companyDetailLabel}>Fundación:</Text>
                                <Text style={styles.companyDetailValue}>{company.founded || 'N/A'}</Text>
                              </View>
                              
                              <View style={styles.companyDetailItem}>
                                <Text style={styles.companyDetailLabel}>Sede:</Text>
                                <Text style={styles.companyDetailValue}>{company.hq || 'N/A'}</Text>
                              </View>
                              
                              <View style={styles.companyDetailItem}>
                                <Text style={styles.companyDetailLabel}>Cap. Mercado:</Text>
                                <Text style={styles.companyDetailValue}>{company.marketCap || 'N/A'}</Text>
                              </View>
                              
                              <View style={styles.companyDetailItem}>
                                <Text style={styles.companyDetailLabel}>Empleados:</Text>
                                <Text style={styles.companyDetailValue}>{company.employees || 'N/A'}</Text>
                              </View>
                              
                              <View style={styles.companyDetailItem}>
                                <Text style={styles.companyDetailLabel}>Ingresos:</Text>
                                <Text style={styles.companyDetailValue}>{company.revenue || 'N/A'}</Text>
                              </View>
                            </View>
                            
                            <Text style={styles.companyProductsLabel}>
                              Productos clave:
                            </Text>
                            <Text style={styles.companyProducts}>
                              {company.keyProducts || 'No hay información de productos disponible'}
                            </Text>
                          </Card.Content>
                        </Card>
                      ))
                    ) : (
                      <Text style={styles.noDataText}>No hay información de competidores disponible</Text>
                    )}
                  </Surface>
                </View>
              ) : (
                <ActivityIndicator animating={true} size="large" />
              )}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setAnalysisDialogVisible(false)}>Cerrar</Button>
            <Button mode="contained" onPress={saveBusinessIdea} loading={isSaving}>
              Guardar idea
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
      
      {/* Diálogo de retroalimentación */}
      <Portal>
        <Dialog
          visible={feedbackVisible}
          onDismiss={() => setFeedbackVisible(false)}
          style={styles.feedbackDialog}
        >
          <Dialog.Title>¿Qué tan preciso fue el análisis?</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.feedbackText}>
              Tu opinión nos ayuda a mejorar la precisión de nuestros análisis.
            </Text>
            
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    feedbackValue === rating && styles.ratingButtonSelected
                  ]}
                  onPress={() => setFeedbackValue(rating)}
                >
                  <Text style={[
                    styles.ratingButtonText,
                    feedbackValue === rating && styles.ratingButtonTextSelected
                  ]}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.ratingLabels}>
              <Text style={styles.ratingLabelLeft}>Poco preciso</Text>
              <Text style={{flex: 1}}></Text>
              <Text style={styles.ratingLabelRight}>Muy preciso</Text>
            </Text>
            
            <TextInput
              label="Comentarios (opcional)"
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.feedbackComment}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setFeedbackVisible(false)}>Cancelar</Button>
            <Button mode="contained" onPress={submitAnalysisFeedback}>Enviar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  formContainer: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  form: {
    padding: 16
  },
  input: {
    marginBottom: 16
  },
  textArea: {
    marginBottom: 16,
    height: 120
  },
  sectorPicker: {
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16
  },
  sectorPickerRequired: {
    borderColor: '#f44336',
  },
  sectorPickerText: {
    color: '#6200ee'
  },
  sectorPickerTextEmpty: {
    color: '#757575',
  },
  tagsContainer: {
    marginBottom: 16
  },
  tagsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  tagsInput: {
    flex: 1,
    marginRight: 8
  },
  tagButton: {
    marginLeft: 8
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  chip: {
    margin: 4
  },
  analyzeButton: {
    marginTop: 8,
    marginBottom: 16
  },
  analysisResult: {
    marginTop: 16
  },
  analysisSurface: {
    padding: 16,
    borderRadius: 8,
    elevation: 4
  },
  potentialScore: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  scoreValue: {
    color: '#6200ee'
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16
  },
  analysisSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  analysisLabel: {
    marginRight: 4,
    fontWeight: 'bold'
  },
  analysisValue: {
    color: '#6200ee'
  },
  recommendationContainer: {
    marginBottom: 16
  },
  recommendationLabel: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  recommendation: {
    lineHeight: 20
  },
  feedbackButton: {
    marginBottom: 8
  },
  saveButton: {
    marginTop: 8
  },
  feedbackDialog: {
    borderRadius: 8
  },
  feedbackText: {
    marginBottom: 16
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ratingButtonSelected: {
    backgroundColor: '#6200ee'
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  ratingButtonTextSelected: {
    color: 'white'
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  ratingLabelLeft: {
    color: '#757575',
    fontSize: 12
  },
  ratingLabelRight: {
    color: '#757575',
    fontSize: 12
  },
  feedbackComment: {
    marginTop: 8
  },
  detailedAnalysisDialog: {
    maxHeight: '90%',
    borderRadius: 8
  },
  dialogScrollArea: {
    maxHeight: 500
  },
  detailedAnalysisContent: {
    padding: 8
  },
  analysisSectionSurface: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16
  },
  analysisSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#6200ee'
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 8
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  detailedScoreValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold'
  },
  scoreLabel: {
    color: 'white',
    fontSize: 12
  },
  detailedProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16
  },
  analysisSummaryText: {
    lineHeight: 20,
    fontSize: 15,
    color: '#424242'
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start'
  },
  factorBullet: {
    fontSize: 18,
    marginRight: 8,
    color: '#6200ee'
  },
  factorText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#424242'
  },
  marketDataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  marketDataItem: {
    width: '48%',
    marginBottom: 12
  },
  marketDataLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2
  },
  marketDataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242'
  },
  urgencyDataContainer: {
    marginBottom: 16
  },
  urgencyDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  urgencyDataItem: {
    width: '48%'
  },
  urgencyDataLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2
  },
  urgencyDataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242'
  },
  urgencyExplanation: {
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
    marginTop: 8
  },
  companyCard: {
    marginBottom: 12,
    elevation: 2
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242'
  },
  companyBadge: {
    backgroundColor: '#e8eaf6',
    borderRadius: 4,
    padding: 4
  },
  companyInnovation: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3f51b5'
  },
  companyDescription: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 12,
    lineHeight: 20
  },
  companyDivider: {
    marginVertical: 8
  },
  companyDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  companyDetailItem: {
    width: '48%',
    marginBottom: 8
  },
  companyDetailLabel: {
    fontSize: 12,
    color: '#757575'
  },
  companyDetailValue: {
    fontSize: 14,
    color: '#424242'
  },
  companyProductsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4
  },
  companyProducts: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20
  },
  aiChip: {
    backgroundColor: '#E1F5FE',
    marginVertical: 8,
  },
  attachmentsSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  attachmentButtons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  attachButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  attachmentsList: {
    marginTop: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachmentThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  attachmentName: {
    flex: 1,
    marginRight: 8,
  },
  noDataText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 16
  },
}); 