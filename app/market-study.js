import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput as RNTextInput
} from 'react-native';
import {
  Text,
  Button,
  Appbar,
  Surface,
  Dialog,
  Portal,
  ProgressBar,
  TextInput,
  HelperText,
  Snackbar,
  IconButton,
  Divider,
  Card,
  Title,
  Paragraph,
  Chip,
  List
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

// Configuración de Google AI Studio
const GOOGLE_AI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GOOGLE_AI_MODEL = 'gemini-2.0-flash';
const GOOGLE_AI_API_KEY = 'AIzaSyDl00qiwvrLuRKMNmwuTU6BWuNry5cplwI';

export default function MarketStudy() {
  const navigation = useNavigation();

  // Estados para el formulario
  const [formData, setFormData] = useState({
    concept: '',
    valueProposition: '',
    additionalDetails: '',
    location: '',
    businessType: '',
    resources: '',
    budget: '',
    infrastructure: '',
    team: '',
    technology: ''
  });

  // Estados para validación y UI
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [studyDialogVisible, setStudyDialogVisible] = useState(false);
  const [currentStudy, setCurrentStudy] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.concept) newErrors.concept = 'El concepto es requerido';
    if (!formData.valueProposition) newErrors.valueProposition = 'La propuesta de valor es requerida';
    if (!formData.location) newErrors.location = 'La ubicación es requerida';
    if (!formData.businessType) newErrors.businessType = 'El tipo de negocio es requerido';
    if (!formData.budget) newErrors.budget = 'El presupuesto es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generar el prompt para el análisis
  const generatePrompt = (data) => {
    return `Eres un experto analista de mercado. Genera un análisis detallado para esta idea de negocio y devuelve SOLO un objeto JSON válido sin texto adicional ni explicaciones:

INFORMACIÓN DEL NEGOCIO:
Concepto: ${data.concept}
Propuesta de Valor: ${data.valueProposition}
Detalles Adicionales: ${data.additionalDetails}
Ubicación Preferida: ${data.location}
Tipo de Negocio: ${data.businessType}
Recursos:
- Presupuesto: ${data.budget}
- Infraestructura: ${data.infrastructure}
- Equipo: ${data.team}
- Tecnología: ${data.technology}

IMPORTANTE: Tu respuesta debe ser ÚNICAMENTE un objeto JSON válido con esta estructura exacta. NO incluyas ningún texto adicional, comentarios o explicaciones:

{
  "marketSize": {
    "total": 1000000,
    "historical": {
      "pastGrowth": 5.2,
      "keyTrends": ["tendencia1", "tendencia2"]
    },
    "projections": {
      "oneYear": 7.5,
      "threeYears": 15.8,
      "fiveYears": 25.3
    }
  },
  "segmentation": {
    "demographic": {
      "age": ["18-25", "26-35"],
      "gender": ["Masculino", "Femenino"],
      "socioeconomic": ["Medio", "Medio-Alto"]
    },
    "psychographic": {
      "interests": ["interés1", "interés2"],
      "values": ["valor1", "valor2"],
      "lifestyle": ["estilo1", "estilo2"]
    },
    "behavioral": {
      "purchaseFrequency": ["Mensual", "Trimestral"],
      "loyalty": ["Alta", "Media"],
      "priceRange": ["€10-50", "€51-100"]
    }
  },
  "growth": {
    "shortTerm": 8.5,
    "mediumTerm": 15.2,
    "longTerm": 25.0,
    "factors": ["factor1", "factor2"],
    "barriers": ["barrera1", "barrera2"]
  },
  "entryBarriers": {
    "regulatory": {
      "level": "Medio",
      "details": ["detalle1", "detalle2"],
      "strategies": ["estrategia1", "estrategia2"]
    },
    "technological": {
      "level": "Alto",
      "details": ["detalle1", "detalle2"],
      "strategies": ["estrategia1", "estrategia2"]
    },
    "financial": {
      "level": "Medio",
      "details": ["detalle1", "detalle2"],
      "strategies": ["estrategia1", "estrategia2"]
    },
    "competitive": {
      "level": "Alto",
      "details": ["detalle1", "detalle2"],
      "strategies": ["estrategia1", "estrategia2"]
    }
  },
  "competition": {
    "local": {
      "companies": [
        {"name": "Empresa1", "strengths": ["fortaleza1"], "weaknesses": ["debilidad1"]}
      ],
      "marketShare": 35.5
    },
    "national": {
      "companies": [
        {"name": "Empresa1", "strengths": ["fortaleza1"], "weaknesses": ["debilidad1"]}
      ],
      "marketShare": 45.2
    },
    "global": {
      "companies": [
        {"name": "Empresa1", "strengths": ["fortaleza1"], "weaknesses": ["debilidad1"]}
      ],
      "marketShare": 55.8
    },
    "opportunities": ["oportunidad1", "oportunidad2"]
  },
  "viability": {
    "score": 85,
    "localAcceptance": 75.5,
    "nationalProjection": 82.3,
    "estimatedROI": 25.5,
    "strengths": ["fortaleza1", "fortaleza2"],
    "weaknesses": ["debilidad1", "debilidad2"]
  },
  "marketState": {
    "stage": "Crecimiento",
    "annualGrowth": 12.5,
    "potentialRegions": ["región1", "región2"],
    "emergingTrends": ["tendencia1", "tendencia2"]
  },
  "optimalLocation": {
    "city": "Ciudad",
    "region": "Región",
    "country": "País",
    "advantages": ["ventaja1", "ventaja2"],
    "considerations": ["consideración1", "consideración2"]
  }
}`;
  };

  // Guardar el estudio en AsyncStorage
  const saveStudyToProfile = async (study) => {
    try {
      const existingStudies = await AsyncStorage.getItem('marketStudies');
      const studies = existingStudies ? JSON.parse(existingStudies) : [];
      
      const newStudy = {
        id: Date.now(),
        date: new Date().toISOString(),
        study
      };
      
      studies.push(newStudy);
      await AsyncStorage.setItem('marketStudies', JSON.stringify(studies));
    } catch (error) {
      console.error('Error al guardar el estudio:', error);
    }
  };

  // Limpiar y extraer JSON de la respuesta de Gemini
  const sanitizeJsonResponse = (rawContent) => {
    if (!rawContent) return null;
    
    try {
      // 1. Eliminar texto adicional alrededor del JSON
      let cleanContent = rawContent.trim();
      
      // 2. Si está envuelto en comillas triple (```json), extraer solo el contenido JSON
      if (cleanContent.startsWith('```')) {
        const jsonStart = cleanContent.indexOf('{');
        const jsonEnd = cleanContent.lastIndexOf('}');
        
        if (jsonStart >= 0 && jsonEnd >= 0) {
          cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
        } else {
          // Intentar con la eliminación de ``` al inicio y final
          cleanContent = cleanContent
            .replace(/^```(json)?\s*/i, '')
            .replace(/```\s*$/i, '');
        }
      }

      // 3. Buscar el primer { y el último } si aún no es JSON válido
      if (!isValidJSON(cleanContent)) {
        const jsonStart = cleanContent.indexOf('{');
        const jsonEnd = cleanContent.lastIndexOf('}');
        
        if (jsonStart >= 0 && jsonEnd >= 0 && jsonEnd > jsonStart) {
          cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
        }
      }
      
      // 4. Verificar si es un JSON válido
      if (isValidJSON(cleanContent)) {
        return cleanContent;
      }
      
      return null;
    } catch (error) {
      console.error('Error en la sanitización del JSON:', error);
      return null;
    }
  };

  // Función auxiliar para verificar si una cadena es JSON válido
  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Generar estudio de mercado
  const generateMarketStudy = async () => {
    if (!validateForm()) {
      setError('Por favor, completa todos los campos requeridos');
      setSnackbarVisible(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const prompt = generatePrompt(formData);
      
      console.log('Enviando análisis a Gemini...');
      
      const response = await axios({
        method: 'POST',
        url: `${GOOGLE_AI_API_BASE_URL}/${GOOGLE_AI_MODEL}:generateContent?key=${GOOGLE_AI_API_KEY}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            maxOutputTokens: 2048
          }
        },
        timeout: 60000
      });

      if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
        console.error('Respuesta inválida de Gemini:', response.data);
        throw new Error('Respuesta inválida de la API');
      }

      const rawContent = response.data.candidates[0].content?.parts?.[0]?.text;
      console.log('Contenido raw recibido:', rawContent);

      if (!rawContent) {
        console.error('No se recibió contenido en la respuesta');
        throw new Error('Respuesta vacía de la API');
      }

      // Intentar limpiar el contenido antes de parsearlo
      const cleanContent = sanitizeJsonResponse(rawContent);
      console.log('Contenido limpio:', cleanContent);
      
      if (!cleanContent) {
        console.error('Contenido raw que causó el error:', rawContent);
        throw new Error('No se pudo procesar la respuesta de la API. La respuesta no es un JSON válido.');
      }

      const data = JSON.parse(cleanContent);
      console.log('Datos parseados correctamente:', data);
      setCurrentStudy(data);
      await saveStudyToProfile(data);
      setStudyDialogVisible(true);
    } catch (error) {
      console.error('Error al generar el estudio:', error);
      setError(`Ha ocurrido un error al generar el estudio: ${error.message}`);
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Estudio de Mercado" />
        <IconButton
          icon="information"
          onPress={() => {
            // Mostrar información sobre el estudio de mercado
          }}
        />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <Surface style={styles.infoCard}>
          <Title style={styles.sectionTitle}>Idea de Negocio</Title>
          <Paragraph style={styles.description}>
            Proporciona información detallada sobre tu idea de negocio para generar un análisis exhaustivo del mercado.
          </Paragraph>
        </Surface>

        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>Fundamentos Básicos</Title>
            
            <TextInput
              label="Concepto del Negocio"
              value={formData.concept}
              onChangeText={(text) => setFormData({...formData, concept: text})}
              mode="outlined"
              multiline
              numberOfLines={3}
              error={!!errors.concept}
              style={styles.input}
            />
            {errors.concept && <HelperText type="error">{errors.concept}</HelperText>}

            <TextInput
              label="Propuesta de Valor"
              value={formData.valueProposition}
              onChangeText={(text) => setFormData({...formData, valueProposition: text})}
              mode="outlined"
              multiline
              numberOfLines={3}
              error={!!errors.valueProposition}
              style={styles.input}
            />
            {errors.valueProposition && <HelperText type="error">{errors.valueProposition}</HelperText>}

            <TextInput
              label="Detalles Adicionales"
              value={formData.additionalDetails}
              onChangeText={(text) => setFormData({...formData, additionalDetails: text})}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>Ubicación y Tipo</Title>
            
            <TextInput
              label="Ubicación Preferida"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
              mode="outlined"
              error={!!errors.location}
              style={styles.input}
            />
            {errors.location && <HelperText type="error">{errors.location}</HelperText>}

            <TextInput
              label="Tipo de Negocio"
              value={formData.businessType}
              onChangeText={(text) => setFormData({...formData, businessType: text})}
              mode="outlined"
              error={!!errors.businessType}
              style={styles.input}
            />
            {errors.businessType && <HelperText type="error">{errors.businessType}</HelperText>}
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>Recursos Disponibles</Title>
            
            <TextInput
              label="Presupuesto Estimado"
              value={formData.budget}
              onChangeText={(text) => setFormData({...formData, budget: text})}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Infraestructura"
              value={formData.infrastructure}
              onChangeText={(text) => setFormData({...formData, infrastructure: text})}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Equipo"
              value={formData.team}
              onChangeText={(text) => setFormData({...formData, team: text})}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Tecnología"
              value={formData.technology}
              onChangeText={(text) => setFormData({...formData, technology: text})}
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>

              <Button 
                mode="contained" 
          onPress={generateMarketStudy}
          style={styles.generateButton}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Generando...' : 'Generar Estudio de Mercado'}
              </Button>
      </ScrollView>

      <Portal>
        <Dialog
          visible={studyDialogVisible}
          onDismiss={() => setStudyDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Resultados del Estudio de Mercado</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={styles.dialogContent}>
              {currentStudy && (
                <>
                  <Surface style={styles.resultCard}>
                    <Title style={styles.cardTitle}>Tamaño del Mercado</Title>
                    <Text style={styles.resultText}>Volumen Total: €{currentStudy.marketSize.total.toLocaleString()}</Text>
                    <Text style={styles.resultText}>Crecimiento Histórico: {currentStudy.marketSize.historical.pastGrowth}%</Text>
                    <Text style={styles.subsectionTitle}>Proyecciones:</Text>
                    <Text style={styles.resultText}>1 año: {currentStudy.marketSize.projections.oneYear}%</Text>
                    <Text style={styles.resultText}>3 años: {currentStudy.marketSize.projections.threeYears}%</Text>
                    <Text style={styles.resultText}>5 años: {currentStudy.marketSize.projections.fiveYears}%</Text>
                  </Surface>

                  <Surface style={styles.resultCard}>
                    <Title style={styles.cardTitle}>Segmentación del Mercado</Title>
                    <Text style={styles.subsectionTitle}>Demografía</Text>
                    <View style={styles.chipContainer}>
                      {currentStudy.segmentation.demographic.age.map((age, index) => (
                        <Chip key={`age-${index}`} style={styles.chip}>{age}</Chip>
                      ))}
                    </View>
                    <Text style={styles.subsectionTitle}>Psicografía</Text>
                    <View style={styles.chipContainer}>
                      {currentStudy.segmentation.psychographic.interests.map((interest, index) => (
                        <Chip key={`interest-${index}`} style={styles.chip}>{interest}</Chip>
                        ))}
                      </View>
                  </Surface>

                  <Surface style={styles.resultCard}>
                    <Title style={styles.cardTitle}>Análisis Competitivo</Title>
                    <List.Section>
                      <List.Subheader>Competidores Locales</List.Subheader>
                      {currentStudy.competition.local.companies.map((company, index) => (
                        <List.Item
                          key={`local-${index}`}
                          title={company.name}
                          description={`Fortalezas: ${company.strengths.join(', ')}`}
                          left={props => <List.Icon {...props} icon="office-building" />}
                        />
                      ))}
                    </List.Section>
                  </Surface>

                  <Surface style={styles.resultCard}>
                    <Title style={styles.cardTitle}>Viabilidad del Negocio</Title>
                    <View style={styles.scoreContainer}>
                      <Text style={styles.scoreText}>{currentStudy.viability.score}%</Text>
                      <ProgressBar
                        progress={currentStudy.viability.score / 100}
                        color={currentStudy.viability.score >= 70 ? '#4CAF50' : '#FF9800'}
                        style={styles.progressBar}
                      />
                    </View>
                    <Text style={styles.resultText}>ROI Estimado: {currentStudy.viability.estimatedROI}%</Text>
                    <Text style={styles.subsectionTitle}>Fortalezas:</Text>
                    {currentStudy.viability.strengths.map((strength, index) => (
                      <Text key={index} style={styles.listItem}>• {strength}</Text>
                    ))}
                  </Surface>

                  <Surface style={styles.resultCard}>
                    <Title style={styles.cardTitle}>Localización Óptima</Title>
                    <Text style={styles.resultText}>Ciudad: {currentStudy.optimalLocation.city}</Text>
                    <Text style={styles.resultText}>Región: {currentStudy.optimalLocation.region}</Text>
                    <Text style={styles.subsectionTitle}>Ventajas:</Text>
                    {currentStudy.optimalLocation.advantages.map((advantage, index) => (
                      <Text key={index} style={styles.listItem}>• {advantage}</Text>
                    ))}
                  </Surface>
                </>
                  )}
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={() => setStudyDialogVisible(false)}>Cerrar</Button>
              </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  formCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  generateButton: {
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 8,
    backgroundColor: '#6200ee',
  },
  dialog: {
    maxHeight: '90%',
  },
  dialogContent: {
    padding: 16,
  },
  resultCard: {
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  listItem: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 4,
    color: '#666',
  },
  scoreContainer: {
    marginVertical: 12,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    margin: 4,
  },
}); 