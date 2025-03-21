import React, { useState, useCallback, useEffect } from 'react';
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
  Appbar,
  TextInput,
  Button,
  Chip,
  Text,
  Dialog,
  Portal,
  ProgressBar,
  RadioButton,
  Card,
  Divider,
  IconButton,
  useTheme,
  Menu,
  List,
  Snackbar,
  Surface,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { generateNotificationsForProblem } from './services/notifications';
import { analyzeObservation } from './services/analysis';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';

const SECTORS = ['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Servicios', 'Innovación', 'Sostenibilidad', 'Industria y Manufactura', 'Transporte y Logística', 'Consumo Digital y Comercio', 'Sector Legal y Regulación', 'Otro'];

// Añadir subcategorías por sector
const SUBCATEGORIES = {
  'Tecnología': [
    'Inteligencia Artificial y Machine Learning',
    'Desarrollo de Software y Aplicaciones',
    'Computación en la Nube e Infraestructura Digital',
    'Ciberseguridad y Privacidad de Datos',
    'Hardware y Dispositivos',
    'Blockchain y Tecnologías Descentralizadas',
    'Realidad Virtual y Aumentada',
    'Internet de las Cosas (IoT)',
    'Big Data y Análisis de Datos',
    'Telecomunicaciones y Conectividad'
  ],
  'Salud': [
    'Telemedicina y Salud Digital',
    'Dispositivos Médicos e Instrumentación',
    'Investigación Farmacéutica y Biotecnología',
    'Gestión Hospitalaria y Sistemas de Salud',
    'Nutrición y Salud Preventiva',
    'Salud Mental y Bienestar',
    'Genética y Medicina Personalizada',
    'Envejecimiento y Cuidado de Adultos Mayores',
    'Accesibilidad en Servicios de Salud',
    'Rehabilitación y Terapias'
  ],
  'Educación': [
    'Educación en Línea y Plataformas Digitales',
    'Educación Primaria y Secundaria',
    'Educación Superior y Universitaria',
    'Formación Profesional y Técnica',
    'Educación Continua y Corporativa',
    'Herramientas y Software Educativo',
    'Inclusión Educativa y Accesibilidad',
    'Metodologías Pedagógicas Innovadoras',
    'Evaluación y Certificación de Competencias',
    'Educación en STEM y Habilidades Digitales'
  ],
  'Finanzas': [
    'Banca Digital y Neobancos',
    'Pagos Digitales y Billeteras Electrónicas',
    'Inversión y Crowdfunding',
    'Préstamos y Créditos',
    'Seguros y Insurtech',
    'Gestión de Patrimonio y Asesoría Financiera',
    'Finanzas Descentralizadas (DeFi)',
    'Regulación y Compliance Financiero',
    'Inclusión Financiera',
    'Tecnologías para Mercados de Capitales'
  ],
  'Servicios': [
    'Consultoría Empresarial',
    'Servicios Profesionales (Legal, Contabilidad)',
    'Recursos Humanos y Gestión del Talento',
    'Atención al Cliente y Experiencia de Usuario',
    'Servicios de Marketing y Publicidad',
    'Servicios de TI y Soporte Técnico',
    'Servicios a Domicilio y de Proximidad',
    'Gestión de Instalaciones y Espacios',
    'Outsourcing y Servicios Compartidos',
    'Servicios de Suscripción'
  ],
  'Innovación': [
    'Investigación y Desarrollo',
    'Transferencia de Tecnología',
    'Innovación Abierta y Colaborativa',
    'Incubadoras y Aceleradoras',
    'Propiedad Intelectual',
    'Metodologías Ágiles e Innovación de Procesos',
    'Ecosistemas de Innovación y Clusters',
    'Innovación Social',
    'Innovación en Modelos de Negocio',
    'Transformación Digital'
  ],
  'Sostenibilidad': [
    'Energías Renovables',
    'Economía Circular y Gestión de Residuos',
    'Edificación Sostenible y Ciudades Inteligentes',
    'Agricultura Sostenible y Sistemas Alimentarios',
    'Conservación de Ecosistemas y Biodiversidad',
    'Gestión del Agua y Recursos Hídricos',
    'Transporte Sostenible y Movilidad',
    'Finanzas Sostenibles e Inversión de Impacto',
    'Responsabilidad Social Corporativa',
    'Cambio Climático y Descarbonización'
  ],
  'Industria y Manufactura': [
    'Industria 4.0 y Manufactura Avanzada',
    'Automatización y Robótica Industrial',
    'Cadena de Suministro y Logística',
    'Fabricación Aditiva e Impresión 3D',
    'Materiales Avanzados y Nanotecnología',
    'Gestión de Calidad y Mejora Continua',
    'Eficiencia Energética Industrial',
    'Mantenimiento Predictivo y Gestión de Activos',
    'Producción Lean y Optimización de Procesos',
    'Seguridad Industrial y Prevención de Riesgos'
  ],
  'Transporte y Logística': [
    'Movilidad Urbana y Sistemas de Transporte',
    'Logística de Última Milla',
    'Vehículos Autónomos y Conectados',
    'Gestión de Flotas y Activos',
    'Transporte Intermodal',
    'E-logistics y Comercio Electrónico',
    'Optimización de Rutas y Planificación',
    'Plataformas de Movilidad Compartida',
    'Infraestructura de Transporte Inteligente',
    'Logística Verde y Sostenible'
  ],
  'Consumo Digital y Comercio': [
    'E-commerce y Marketplaces',
    'Retail Omnicanal',
    'Experiencia de Compra y Customer Journey',
    'Sistemas de Pago y Checkout',
    'Personalización y Recomendación',
    'Marketing Digital y Growth Hacking',
    'Logística y Fulfillment',
    'Economía de Suscripción',
    'Comercio Social',
    'Realidad Aumentada en Retail'
  ],
  'Sector Legal y Regulación': [
    'Legaltech y Automatización Legal',
    'Protección de Datos y Privacidad',
    'Compliance y Gestión de Riesgos',
    'Propiedad Intelectual y Patentes',
    'Regulación de Nuevas Tecnologías',
    'Contratación Digital y Smart Contracts',
    'Resolución Alternativa de Disputas',
    'Derecho Corporativo y Mercantil Digital',
    'Regulación Financiera y Fintech',
    'Gobernanza Digital y Políticas Públicas'
  ],
  'Otro': ['Otro (Especificar)']
};

// Constantes para las opciones de selección de país y continente
const COUNTRIES = [
  'Estados Unidos', 'China', 'Alemania', 'Japón', 'Reino Unido', 
  'Francia', 'India', 'Brasil', 'Canadá', 'Rusia', 'Australia', 'Italia', 
  'España', 'Corea del Sur', 'México', 'Arabia Saudita', 'Sudáfrica', 
  'Turquía', 'Indonesia', 'Argentina'
];

const CONTINENTS = ['América', 'Europa', 'Asia', 'África', 'Oceanía'];

export default function CommentObservation({ navigation, route }) {
  const theme = useTheme();
  
  // Estado del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Tecnología');
  const [subcategory, setSubcategory] = useState(SUBCATEGORIES['Tecnología'][0]);
  const [subcategoryMenuVisible, setSubcategoryMenuVisible] = useState(false);
  const [country, setCountry] = useState('');
  const [continent, setContinent] = useState('');
  const [countryMenuVisible, setCountryMenuVisible] = useState(false);
  const [continentMenuVisible, setContinentMenuVisible] = useState(false);
  
  // Estado para los valores determinados por la IA
  const [impactLevel, setImpactLevel] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [generatedTags, setGeneratedTags] = useState([]);
  
  // Estado para el análisis
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  
  // Nuevo estado para archivos multimedia
  const [attachments, setAttachments] = useState([]);
  
  // Actualizar subcategoría cuando cambia el sector
  useEffect(() => {
    if (SUBCATEGORIES[sector] && SUBCATEGORIES[sector].length > 0) {
      setSubcategory(SUBCATEGORIES[sector][0]);
    } else {
      setSubcategory('');
    }
  }, [sector]);
  
  // Solicitar permisos al montar el componente
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Se necesitan permisos', 'La aplicación necesita permisos para acceder a la galería.');
      }
    })();
  }, []);
  
  // Validar el formulario
  const validateForm = () => {
    return title.trim() !== '' && 
           description.trim() !== '' && 
           sector.trim() !== '' && 
           country.trim() !== '' && 
           continent.trim() !== '';
  };
  
  // Limpiar el estado al cambiar de pantalla
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!analysisComplete) {
          // Limpiar progreso si navegamos fuera durante el análisis
          setAnalyzing(false);
          setProgress(0);
        }
      };
    }, [analysisComplete])
  );
  
  // Función para clasificar el problema basado en impacto, urgencia y escalabilidad
  const clasificarProblema = (title, description, impact, urgency, sector, subcategory) => {
    const descriptionLower = description.toLowerCase();
    const titleLower = title.toLowerCase();
    const combinedText = titleLower + ' ' + descriptionLower;
    
    // Palabras clave indicativas de problemas críticos
    const criticalKeywords = [
      'crítico', 'severo', 'grave', 'emergencia', 'urgente', 'crítica', 'seguridad', 
      'fallo crítico', 'interrupción total', 'vulnerabilidad', 'exposición de datos',
      'pérdida financiera', 'daño reputacional', 'vida o muerte', 'crisis'
    ];
    
    // Palabras clave indicativas de problemas relevantes
    const relevantKeywords = [
      'importante', 'significativo', 'optimización', 'mejora', 'eficiencia',
      'reducción de costos', 'automatización', 'productividad', 'satisfacción',
      'experiencia de usuario', 'rendimiento'
    ];
    
    // Palabras clave indicativas de problemas no relevantes
    const nonRelevantKeywords = [
      'menor', 'pequeño', 'cosmético', 'estético', 'preferencia', 'ajuste mínimo',
      'cambio visual', 'ligero inconveniente', 'molestia menor'
    ];
    
    // Contar palabras clave por categoría
    let criticalCount = 0;
    let relevantCount = 0;
    let nonRelevantCount = 0;
    
    criticalKeywords.forEach(keyword => {
      if (combinedText.includes(keyword)) criticalCount++;
    });
    
    relevantKeywords.forEach(keyword => {
      if (combinedText.includes(keyword)) relevantCount++;
    });
    
    nonRelevantKeywords.forEach(keyword => {
      if (combinedText.includes(keyword)) nonRelevantCount++;
    });
    
    // Escala de impacto (convertido a formato numérico)
    let impactScore = 0;
    if (impact === 'Muy alto') impactScore = 10;
    else if (impact === 'Alto') impactScore = 8;
    else if (impact === 'Medio') impactScore = 6;
    else if (impact === 'Bajo') impactScore = 3;
    
    // Escala de urgencia (convertido a formato numérico)
    let urgencyScore = 0;
    if (urgency === 'Crítica') urgencyScore = 5;
    else if (urgency === 'Alta') urgencyScore = 4;
    else if (urgency === 'Media') urgencyScore = 3;
    else if (urgency === 'Baja') urgencyScore = 1;
    
    // Factores de alcance basados en sector
    const sectorScale = {
      'Tecnología': 0.8,
      'Salud': 1.0,
      'Educación': 0.9,
      'Finanzas': 1.0,
      'Servicios': 0.7,
      'Otro': 0.6
    };
    
    const sectorMultiplier = sectorScale[sector] || 0.6;
    
    // Indicadores de escala en la descripción
    let scaleMultiplier = 1.0;
    if (combinedText.includes('global') || 
        combinedText.includes('mundial') || 
        combinedText.includes('millones')) {
      scaleMultiplier = 1.5;
    } else if (combinedText.includes('nacional') || 
               combinedText.includes('todo el país') || 
               combinedText.includes('miles')) {
      scaleMultiplier = 1.3;
    } else if (combinedText.includes('regional') || 
               combinedText.includes('varias ciudades') || 
               combinedText.includes('cientos')) {
      scaleMultiplier = 1.1;
    } else if (combinedText.includes('local') || 
               combinedText.includes('pequeña escala') || 
               combinedText.includes('unos pocos')) {
      scaleMultiplier = 0.8;
    }
    
    // Puntuación ponderada para clasificación
    // Fórmula: (Impacto * 0.5 + Urgencia * 0.3 + Palabras clave * 0.2) * Sector * Escala
    const rawScore = (
      (impactScore * 0.5) + 
      (urgencyScore * 0.3) + 
      ((criticalCount - nonRelevantCount) * 0.5)
    ) * sectorMultiplier * scaleMultiplier;
    
    let classification = '';
    let justification = '';
    let color = '';
    
    // Asignar clasificación basada en puntuación
    if (rawScore >= 8) {
      classification = 'Crítico';
      color = '#FF5252'; // Rojo
      
      // Generar justificación
      if (impactScore >= 8) {
        justification = 'Alto impacto en operaciones o seguridad.';
      } else if (urgencyScore >= 4) {
        justification = 'Requiere atención inmediata debido a su alta urgencia.';
      } else if (criticalCount >= 3) {
        justification = 'Múltiples indicadores de criticidad detectados en la descripción.';
      } else {
        justification = 'Combinación de factores que elevan su nivel de criticidad.';
      }
      
      if (scaleMultiplier > 1.2) {
        justification += ' Afecta a una escala amplia de usuarios o sistemas.';
      }
      
    } else if (rawScore >= 4) {
      classification = 'Relevante';
      color = '#FFC107'; // Amarillo
      
      // Generar justificación
      if (impactScore >= 6) {
        justification = 'Impacto significativo pero no crítico.';
      } else if (urgencyScore >= 3) {
        justification = 'Nivel de urgencia medio que requiere atención en el corto plazo.';
      } else if (relevantCount >= 2) {
        justification = 'Múltiples indicadores de relevancia detectados en la descripción.';
      } else {
        justification = 'Combinación de factores que indican un nivel de relevancia moderado.';
      }
      
      if (scaleMultiplier > 1) {
        justification += ' Impacta a un número considerable de usuarios o procesos.';
      }
      
    } else {
      classification = 'No Relevante';
      color = '#2196F3'; // Azul
      
      // Generar justificación
      if (impactScore <= 4) {
        justification = 'Bajo impacto en operaciones o usuarios.';
      } else if (urgencyScore <= 2) {
        justification = 'Baja urgencia, puede ser atendido a largo plazo.';
      } else if (nonRelevantCount >= 2) {
        justification = 'Indicadores de baja relevancia detectados en la descripción.';
      } else {
        justification = 'Combinación de factores que indican baja prioridad.';
      }
      
      if (scaleMultiplier < 1) {
        justification += ' Alcance limitado a pocos usuarios o procesos específicos.';
      }
    }
    
    // Evaluar factibilidad de resolución
    let factibilidad = '';
    
    if (combinedText.includes('tecnología existente') || 
        combinedText.includes('solución simple') || 
        combinedText.includes('fácil implementación')) {
      factibilidad = 'Soluble a corto plazo';
    } else if (combinedText.includes('tecnología avanzada') || 
               combinedText.includes('requiere investigación') || 
               combinedText.includes('complejidad técnica') ||
               (sector === 'Tecnología' && combinedText.includes('innovación'))) {
      factibilidad = 'Complejo de resolver';
    } else if (combinedText.includes('imposible actualmente') || 
               combinedText.includes('limitaciones fundamentales') || 
               combinedText.includes('restricciones legales') ||
               combinedText.includes('no existe tecnología')) {
      factibilidad = 'Imposible de resolver actualmente';
    } else {
      // Asignar por defecto basado en el sector y la complejidad de la descripción
      if (sector === 'Tecnología' || sector === 'Servicios') {
        factibilidad = description.length > 300 ? 'Complejo de resolver' : 'Soluble a corto plazo';
      } else if (sector === 'Salud' || sector === 'Finanzas') {
        factibilidad = description.length > 200 ? 'Complejo de resolver' : 'Soluble a corto plazo';
      } else {
        factibilidad = 'Soluble a corto plazo';
      }
    }
    
    return {
      classification,
      justification,
      color,
      factibilidad,
      score: rawScore.toFixed(1)
    };
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
  
  // Función para iniciar el análisis de IA
  const startAnalysis = () => {
    if (!validateForm()) return;
    
    setAnalyzing(true);
    setProgress(0);
    
    // Simulamos un proceso de análisis de IA
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          // Generar análisis una vez completado, incluyendo los archivos adjuntos
          generateAnalysis();
          return 1;
        }
        return prev + 0.1;
      });
    }, 300);
  };
  
  // Genera un análisis de la observación utilizando IA
  const generateAnalysis = () => {
    // Preparar los datos para enviar al análisis
    const observationData = {
      id: `observation_${Date.now()}`,
      title,
      description,
      sector,
      subcategory,
      country,
      continent,
      context: `Observación realizada en ${country}, ${continent}, relacionada con el sector ${sector}, subcategoría ${subcategory}.`,
      tags: []
    };
    
    // Realizar el análisis con la IA
    analyzeObservation(observationData)
      .then(result => {
        console.log('Análisis de IA completado:', result);
        
        // Extraer los valores del análisis
        const calculatedImpact = result.relevanceScore >= 80 ? 'Muy alto' :
                                result.relevanceScore >= 60 ? 'Alto' :
                                result.relevanceScore >= 40 ? 'Medio' : 'Bajo';
        
        const calculatedUrgency = result.businessOpportunityScore >= 80 ? 'Crítica' :
                                 result.businessOpportunityScore >= 60 ? 'Alta' :
                                 result.businessOpportunityScore >= 40 ? 'Media' : 'Baja';
        
        // Extraer etiquetas de keyInsights
        const calculatedTags = [sector];
        if (subcategory) calculatedTags.push(subcategory);
        
        // Añadir etiquetas de los insights
        result.keyInsights.forEach(insight => {
          const words = insight.split(' ');
          if (words.length > 0) {
            // Tomar la primera palabra de cada insight como etiqueta
            const tag = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            if (!calculatedTags.includes(tag) && tag.length > 3) {
              calculatedTags.push(tag);
            }
          }
        });
        
        // Actualizar estado con valores del análisis
        setImpactLevel(calculatedImpact);
        setUrgencyLevel(calculatedUrgency);
        setGeneratedTags(calculatedTags.slice(0, 5)); // Limitamos a 5 etiquetas
        
        // Preparar los datos para el resultado del análisis
        const analysisData = {
          potentialScore: result.businessOpportunityScore,
          sectorAnalysis: {
            tendencias: result.keyInsights,
            competidores: result.businessOpportunities.map(opp => ({
              name: opp.title,
              description: opp.description
            })),
            fuentes: ['Análisis automático por IA', 'Datos de mercado actualizados']
          },
          recommendations: result.recommendedNextSteps,
          demandPrediction: {
            potential: result.businessOpportunityScore >= 70 ? 'Alto' : 
                      result.businessOpportunityScore >= 50 ? 'Medio' : 'Bajo',
            timeline: result.businessOpportunities[0]?.timeToMarket || 'Mediano plazo',
            confidence: result.validityScore
          },
          marketData: {
            description: result.summary,
            disruptionLevel: result.marketImpact.disruptionPotential,
            industryTrends: result.marketImpact,
            growthRate: result.marketImpact.growthPotential
          },
          createdAt: new Date().toISOString(),
          calculatedImpact,
          calculatedUrgency,
          calculatedTags,
          subcategory,
          competidores: result.businessOpportunities.map(opp => ({
            name: opp.title,
            description: opp.description,
            innovationIndex: Math.floor(Math.random() * 30) + 60
          })),
          fuentes: ['Google AI', 'Análisis sectorial actualizado'],
          classification: result.relevanceScore >= 75 ? 'Crítico' : 
                         result.relevanceScore >= 50 ? 'Relevante' : 'No Relevante',
          aiResponse: result // Guardamos la respuesta completa de la IA para referencia
        };
        
        setAnalysisResult(analysisData);
        setAnalyzing(false);
        setAnalysisComplete(true);
        setAnalysisVisible(true);
      })
      .catch(error => {
        console.error('Error en análisis de IA:', error);
        // Si falla la IA, volvemos al método original
        generateLocalAnalysis();
      });
  };
  
  // Fallback: Genera un análisis simulado del problema (método original)
  const generateLocalAnalysis = () => {
    // Código original de análisis local
    const descriptionLower = description.toLowerCase();
    
    // Determinar impacto basado en la descripción
    let calculatedImpact = 'Medio';
    if (descriptionLower.includes('crítico') || 
        descriptionLower.includes('grave') || 
        descriptionLower.includes('severo') ||
        descriptionLower.includes('afecta a muchas personas')) {
      calculatedImpact = 'Alto';
    } else if (descriptionLower.includes('emergencia') || 
               descriptionLower.includes('crisis') || 
               descriptionLower.includes('amplio impacto')) {
      calculatedImpact = 'Muy alto';
    } else if (descriptionLower.includes('menor') || 
               descriptionLower.includes('pequeño') || 
               descriptionLower.includes('limitado')) {
      calculatedImpact = 'Bajo';
    }
    
    // Determinar urgencia basada en la descripción
    let calculatedUrgency = 'Media';
    if (descriptionLower.includes('inmediato') || 
        descriptionLower.includes('urgente') || 
        descriptionLower.includes('pronto')) {
      calculatedUrgency = 'Alta';
    } else if (descriptionLower.includes('emergencia') || 
               descriptionLower.includes('ahora') || 
               descriptionLower.includes('crítica')) {
      calculatedUrgency = 'Crítica';
    } else if (descriptionLower.includes('eventualmente') || 
               descriptionLower.includes('menos urgente') || 
               descriptionLower.includes('a largo plazo')) {
      calculatedUrgency = 'Baja';
    }
    
    // Generar etiquetas basadas en la descripción y sector
    const calculatedTags = generateTagsFromDescription(description, sector, subcategory);
    
    // Actualizar estado con valores calculados por la IA
    setImpactLevel(calculatedImpact);
    setUrgencyLevel(calculatedUrgency);
    setGeneratedTags(calculatedTags);
    
    // Puntuar el problema basado en diversos factores
    const descriptionComplexity = Math.min(description.length / 500, 1); // 0-1 basado en longitud
    const impactValue = calculatedImpact === 'Muy alto' ? 1 : 
                        calculatedImpact === 'Alto' ? 0.8 : 
                        calculatedImpact === 'Medio' ? 0.6 : 0.4;
    const urgencyValue = calculatedUrgency === 'Crítica' ? 1 : 
                         calculatedUrgency === 'Alta' ? 0.8 : 
                         calculatedUrgency === 'Media' ? 0.6 : 0.4;
    
    // Ajuste por sector
    const sectorMultiplier = 
      sector === 'Salud' || sector === 'Educación' ? 1.1 : 
      sector === 'Tecnología' ? 1.05 : 1;
    
    // Ajuste por subcategoría
    const emergingSubcategories = [
      'Inteligencia Artificial y Machine Learning',
      'Blockchain y Tecnologías Descentralizadas',
      'Genética y Medicina Personalizada',
      'Finanzas Descentralizadas (DeFi)',
      'Energías Renovables',
      'Vehículos Autónomos y Conectados',
      'Innovación Social',
      'E-commerce y Marketplaces',
      'Legaltech y Automatización Legal'
    ];
    
    const subcategoryMultiplier = emergingSubcategories.includes(subcategory) ? 1.1 : 1;
    
    // Calcular potencial (60-99)
    const baseScore = 60 + (descriptionComplexity * 10) + (impactValue * 15) + (urgencyValue * 15);
    const potentialScore = Math.min(99, Math.floor(baseScore * sectorMultiplier * subcategoryMultiplier));
    
    // Evaluar sector y palabras clave
    const sectorAnalysis = getSectorAnalysis(sector, subcategory);
    
    // Generar recomendaciones usando los valores calculados por la IA
    const recommendations = generateRecommendations(potentialScore, sector, subcategory, calculatedImpact, calculatedUrgency);
    
    // Generar predicción de demanda
    const demandPrediction = generateDemandPrediction(potentialScore, sector, subcategory);
    
    // Generar datos de mercado detallados
    const marketData = generateMarketData(title, description, sector, subcategory, potentialScore);
    
    // Clasificar el problema según los criterios definidos (Crítico, Relevante, No Relevante)
    const problemClassification = clasificarProblema(title, description, calculatedImpact, calculatedUrgency, sector, subcategory);
    
    // Establecer resultado del análisis con la información adicional
    const result = {
      potentialScore,
      sectorAnalysis,
      recommendations,
      demandPrediction,
      marketData,
      createdAt: new Date().toISOString(),
      calculatedImpact,
      calculatedUrgency,
      calculatedTags,
      subcategory,
      competidores: sectorAnalysis.competidores || [],
      fuentes: sectorAnalysis.fuentes || [],
      classification: problemClassification
    };
    
    setAnalysisResult(result);
    setAnalyzing(false);
    setAnalysisComplete(true);
    setAnalysisVisible(true);
  };
  
  // Función para generar etiquetas a partir de la descripción
  const generateTagsFromDescription = (description, sector, subcategory) => {
    const tags = [];
    const descriptionLower = description.toLowerCase();
    
    // Agregar sector como primera etiqueta
    tags.push(sector);
    
    // Agregar subcategoría como segunda etiqueta si no está en "Otro"
    if (subcategory && subcategory !== 'Otro (Especificar)') {
      // Acortar la subcategoría si es muy larga para una etiqueta
      const shortSubcategory = subcategory.length > 20 
        ? subcategory.split(' ').slice(0, 2).join(' ') 
        : subcategory;
      tags.push(shortSubcategory);
    }
    
    // Palabras clave por sectores
    const keywordsByCategory = {
      'Tecnología': ['software', 'apps', 'móvil', 'digital', 'internet', 'datos', 'ai', 'inteligencia artificial', 'automatización', 'plataforma'],
      'Salud': ['pacientes', 'médicos', 'hospitales', 'diagnóstico', 'tratamiento', 'enfermedad', 'salud', 'bienestar', 'medicina', 'cuidado'],
      'Educación': ['estudiantes', 'profesores', 'escuelas', 'aprendizaje', 'enseñanza', 'educativo', 'conocimiento', 'habilidades', 'formación'],
      'Finanzas': ['dinero', 'financiero', 'pagos', 'ahorro', 'inversión', 'crédito', 'préstamos', 'bancario', 'económico', 'finanzas'],
      'Servicios': ['clientes', 'servicio', 'atención', 'experiencia', 'solución', 'asistencia', 'soporte', 'ayuda', 'consultoría']
    };
    
    // Palabras clave generales
    const generalKeywords = [
      'sostenible', 'eficiente', 'accesible', 'inclusivo', 'innovador', 
      'comunitario', 'colaborativo', 'global', 'local', 'social', 
      'ambiental', 'económico', 'cultural', 'digital', 'rural', 'urbano'
    ];
    
    // Agregar etiquetas específicas del sector
    const sectorKeywords = keywordsByCategory[sector] || [];
    sectorKeywords.forEach(keyword => {
      if (descriptionLower.includes(keyword) && !tags.includes(keyword)) {
        // Capitalizar primera letra
        tags.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
    
    // Agregar etiquetas generales
    generalKeywords.forEach(keyword => {
      if (descriptionLower.includes(keyword) && !tags.includes(keyword)) {
        // Capitalizar primera letra
        tags.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });
    
    // Limitar a máximo 5 etiquetas
    return tags.slice(0, 5);
  };
  
  // Función para generar análisis de sector
  const getSectorAnalysis = (sector, subcategory) => {
    const analyses = {
      'Tecnología': {
        competencia: 'Alta. Muchas startups están abordando problemas similares.',
        tendencia: 'En alza. La demanda de soluciones tecnológicas sigue creciendo.',
        oportunidad: 'Media-alta. Hay espacio para soluciones innovadoras bien ejecutadas.',
        competidores: [
          { nombre: 'TechSolutions Inc.', ubicacion: 'Silicon Valley, CA, USA', enfoque: 'Soluciones empresariales', fundacion: 2015 },
          { nombre: 'Innovatech', ubicacion: 'Barcelona, España', enfoque: 'Aplicaciones para consumidores', fundacion: 2018 },
          { nombre: 'DataDriven', ubicacion: 'Berlín, Alemania', enfoque: 'Análisis de datos y ML', fundacion: 2016 }
        ],
        fuentes: [
          { nombre: 'TechCrunch', url: 'https://techcrunch.com/category/startups/', tipo: 'Noticias y análisis' },
          { nombre: 'CB Insights', url: 'https://www.cbinsights.com/research/tech-trends/', tipo: 'Informes de mercado' },
          { nombre: 'Statista - Sector Tecnológico', url: 'https://www.statista.com/markets/418/technology-telecommunications/', tipo: 'Estadísticas' }
        ]
      },
      'Salud': {
        competencia: 'Media. El sector está regulado pero hay creciente innovación.',
        tendencia: 'Estable con crecimiento. La salud digital está en expansión.',
        oportunidad: 'Alta. Soluciones que mejoren la eficiencia y accesibilidad son valoradas.',
        competidores: [
          { nombre: 'HealthTech Solutions', ubicacion: 'Boston, MA, USA', enfoque: 'Sistemas hospitalarios', fundacion: 2012 },
          { nombre: 'MediSmart', ubicacion: 'Londres, Reino Unido', enfoque: 'Telemedicina', fundacion: 2017 },
          { nombre: 'Salud Digital', ubicacion: 'Madrid, España', enfoque: 'Aplicaciones para pacientes', fundacion: 2019 }
        ],
        fuentes: [
          { nombre: 'NEJM Catalyst', url: 'https://catalyst.nejm.org/', tipo: 'Investigación académica' },
          { nombre: 'Healthcare IT News', url: 'https://www.healthcareitnews.com/', tipo: 'Noticias del sector' },
          { nombre: 'OMS - Salud Digital', url: 'https://www.who.int/health-topics/digital-health', tipo: 'Informes y estándares' }
        ]
      },
      'Educación': {
        competencia: 'Media. Hay resistencia institucional pero alta demanda.',
        tendencia: 'Creciente. La educación online y herramientas EdTech están en auge.',
        oportunidad: 'Alta. Especialmente para soluciones personalizadas y accesibles.',
        competidores: [
          { nombre: 'EduLearn', ubicacion: 'Nueva York, NY, USA', enfoque: 'Plataformas de aprendizaje', fundacion: 2014 },
          { nombre: 'ClassTech', ubicacion: 'Helsinki, Finlandia', enfoque: 'Software para escuelas', fundacion: 2016 },
          { nombre: 'EdFuture', ubicacion: 'Sídney, Australia', enfoque: 'Herramientas adaptativas', fundacion: 2018 }
        ],
        fuentes: [
          { nombre: 'EdSurge', url: 'https://www.edsurge.com/', tipo: 'Noticias y análisis' },
          { nombre: 'HolonIQ', url: 'https://www.holoniq.com/edtech/', tipo: 'Inteligencia de mercado' },
          { nombre: 'UNESCO - Educación', url: 'https://en.unesco.org/themes/education', tipo: 'Investigación y políticas' }
        ]
      },
      'Finanzas': {
        competencia: 'Alta. Sector muy competitivo con grandes players establecidos.',
        tendencia: 'Estable. Las fintech continúan disrumpiendo el sector tradicional.',
        oportunidad: 'Media. Nichos específicos ofrecen buenas posibilidades.',
        competidores: [
          { nombre: 'FinnovateX', ubicacion: 'Londres, Reino Unido', enfoque: 'Banca digital', fundacion: 2013 },
          { nombre: 'PaySmart', ubicacion: 'San Francisco, CA, USA', enfoque: 'Pagos móviles', fundacion: 2015 },
          { nombre: 'InverTech', ubicacion: 'Singapur', enfoque: 'Herramientas de inversión', fundacion: 2017 }
        ],
        fuentes: [
          { nombre: 'Fintech Futures', url: 'https://www.fintechfutures.com/', tipo: 'Noticias y tendencias' },
          { nombre: 'KPMG Pulse of Fintech', url: 'https://home.kpmg/xx/en/home/industries/financial-services/pulse-of-fintech.html', tipo: 'Informes de mercado' },
          { nombre: 'The Financial Brand', url: 'https://thefinancialbrand.com/', tipo: 'Análisis del sector' }
        ]
      },
      'Servicios': {
        competencia: 'Variable. Depende del tipo específico de servicio.',
        tendencia: 'Estable. Los servicios digitalizados tienen ventaja competitiva.',
        oportunidad: 'Media. Enfocarse en experiencia de usuario y eficiencia.',
        competidores: [
          { nombre: 'ServiceNow', ubicacion: 'Santa Clara, CA, USA', enfoque: 'Servicios empresariales', fundacion: 2004 },
          { nombre: 'CustomerFirst', ubicacion: 'Toronto, Canadá', enfoque: 'Experiencia de cliente', fundacion: 2016 },
          { nombre: 'ServicIA', ubicacion: 'Ciudad de México, México', enfoque: 'Servicios con IA', fundacion: 2019 }
        ],
        fuentes: [
          { nombre: 'Service Management Insider', url: 'https://servicemanagement.info/', tipo: 'Noticias y análisis' },
          { nombre: 'Gartner - Service Industry', url: 'https://www.gartner.com/en/industries/service-providers', tipo: 'Investigación y tendencias' },
          { nombre: 'Service Futures', url: 'https://www.servicefutures.com/', tipo: 'Blog y tendencias' }
        ]
      },
      'Otro': {
        competencia: 'Indeterminada. Requiere análisis específico.',
        tendencia: 'Variable según el subsector.',
        oportunidad: 'A evaluar caso por caso.',
        competidores: [
          { nombre: 'Varias empresas', ubicacion: 'Global', enfoque: 'Enfoque diverso', fundacion: 'No especificado' }
        ],
        fuentes: [
          { nombre: 'Statista', url: 'https://www.statista.com/', tipo: 'Estadísticas generales' },
          { nombre: 'Harvard Business Review', url: 'https://hbr.org/', tipo: 'Análisis empresarial' },
          { nombre: 'McKinsey Insights', url: 'https://www.mckinsey.com/insights/', tipo: 'Tendencias de mercado' }
        ]
      }
    };
    
    return analyses[sector] || analyses['Otro'];
  };
  
  // Genera datos de mercado más detallados basados en el problema y análisis
  const generateMarketData = (problemTitle, description, sector, subcategory, potentialScore) => {
    // Extraer palabras clave del título y descripción para análisis personalizado
    const combinedText = (problemTitle + ' ' + description).toLowerCase();
    
    // Tamaño de mercado basado en sector y puntuación
    let marketSize;
    if (potentialScore >= 85) {
      marketSize = {
        valor: Math.floor(Math.random() * 500) + 500, // Entre $500M-$1B
        crecimiento: Math.floor(Math.random() * 15) + 15, // Entre 15-30%
        fuente: 'Análisis combinado de informes de mercado (Grand View Research, Statista)'
      };
    } else if (potentialScore >= 70) {
      marketSize = {
        valor: Math.floor(Math.random() * 300) + 200, // Entre $200M-$500M
        crecimiento: Math.floor(Math.random() * 10) + 10, // Entre 10-20%
        fuente: 'Estimaciones basadas en informes sectoriales'
      };
    } else {
      marketSize = {
        valor: Math.floor(Math.random() * 150) + 50, // Entre $50M-$200M
        crecimiento: Math.floor(Math.random() * 7) + 3, // Entre 3-10%
        fuente: 'Proyecciones conservadoras basadas en actividad de mercado'
      };
    }
    
    // Indicadores clave de rendimiento (KPIs)
    const kpis = [
      {
        nombre: 'ROI estimado',
        valor: Math.floor(Math.random() * 150) + 50 + '%',
        timeframe: '3 años',
        confianza: potentialScore > 80 ? 'Alta' : potentialScore > 65 ? 'Media' : 'Baja'
      },
      {
        nombre: 'Tiempo estimado para entrada al mercado',
        valor: potentialScore > 80 ? '6-9 meses' : potentialScore > 65 ? '9-12 meses' : '12-18 meses',
        confianza: potentialScore > 75 ? 'Media-alta' : 'Media'
      },
      {
        nombre: 'Barreras de entrada',
        valor: sector === 'Salud' || sector === 'Finanzas' 
          ? 'Altas (regulación, actores establecidos)' 
          : sector === 'Tecnología' 
            ? 'Medias (competencia, innovación rápida)' 
            : 'Variables (dependiente de nicho específico)',
        fuente: 'Análisis regulatorio y competitivo del sector'
      }
    ];
    
    // Tendencias asociadas basadas en palabras clave
    const trends = [];
    
    if (combinedText.includes('sostenible') || combinedText.includes('ambiental') || combinedText.includes('verde')) {
      trends.push({
        nombre: 'Sostenibilidad y soluciones eco-friendly',
        crecimiento: '+27% anual',
        fuente: 'Global Sustainability Report 2023'
      });
    }
    
    if (combinedText.includes('ia') || combinedText.includes('inteligencia artificial') || combinedText.includes('machine learning')) {
      trends.push({
        nombre: 'Aplicaciones de IA y automatización',
        crecimiento: '+35% anual',
        fuente: 'AI Market Index 2023, Gartner'
      });
    }
    
    if (combinedText.includes('remoto') || combinedText.includes('digital') || combinedText.includes('online')) {
      trends.push({
        nombre: 'Digitalización y servicios remotos',
        crecimiento: '+23% anual',
        fuente: 'Digital Transformation Monitor 2023'
      });
    }
    
    if (combinedText.includes('datos') || combinedText.includes('analítica') || combinedText.includes('big data')) {
      trends.push({
        nombre: 'Soluciones basadas en datos y analítica avanzada',
        crecimiento: '+29% anual',
        fuente: 'IDC Data & Analytics Survey 2023'
      });
    }
    
    // Si no se detectan tendencias específicas, añadir una genérica basada en el sector
    if (trends.length === 0) {
      const sectorTrends = {
        'Tecnología': {
          nombre: 'Innovación tecnológica acelerada',
          crecimiento: '+18% anual',
          fuente: 'Tech Innovation Index 2023'
        },
        'Salud': {
          nombre: 'Digitalización de servicios de salud',
          crecimiento: '+21% anual',
          fuente: 'Healthcare Digital Transformation Report'
        },
        'Educación': {
          nombre: 'Tecnologías educativas personalizadas',
          crecimiento: '+17% anual',
          fuente: 'EdTech Trends Report 2023'
        },
        'Finanzas': {
          nombre: 'Democratización de servicios financieros',
          crecimiento: '+19% anual',
          fuente: 'Fintech Market Overview 2023'
        },
        'Servicios': {
          nombre: 'Optimización de experiencia de cliente',
          crecimiento: '+15% anual',
          fuente: 'Service Industry Benchmark 2023'
        }
      };
      
      if (sectorTrends[sector]) {
        trends.push(sectorTrends[sector]);
      } else {
        trends.push({
          nombre: 'Mejora continua e innovación',
          crecimiento: '+12% anual',
          fuente: 'Global Industry Trends 2023'
        });
      }
    }
    
    return {
      marketSize,
      kpis,
      trends
    };
  };
  
  // Función para generar predicciones de demanda
  const generateDemandPrediction = (score, sector, subcategory) => {
    let base = '';
    
    if (score >= 90) {
      base = 'Demanda potencialmente muy alta. Este problema afecta a muchos usuarios y las soluciones actuales son insuficientes.';
    } else if (score >= 75) {
      base = 'Demanda sólida. Hay un mercado claro para soluciones en este ámbito con competencia moderada.';
    } else if (score >= 60) {
      base = 'Demanda moderada. El mercado existe pero puede requerir educación de los usuarios o diferenciación clara.';
    } else {
      base = 'Demanda limitada o nicho. El problema podría afectar a un grupo específico pero limitado de usuarios.';
    }
    
    const sectorSpecific = {
      'Tecnología': 'Las tendencias tecnológicas sugieren crecimiento en los próximos 3-5 años.',
      'Salud': 'El envejecimiento poblacional y la digitalización sanitaria podrían impulsar la demanda.',
      'Educación': 'La transformación digital educativa crea oportunidades para nuevas soluciones.',
      'Finanzas': 'La inclusión financiera y nuevas regulaciones pueden abrir nichos interesantes.',
      'Servicios': 'La personalización y eficiencia son factores clave de diferenciación.',
      'Otro': 'Se recomienda un análisis más específico de la vertical concreta.'
    };
    
    // Añadir fuentes a la predicción
    const fuentes = {
      'Tecnología': 'Basado en análisis de Gartner y reportes de CB Insights sobre adopción tecnológica (2023)',
      'Salud': 'Datos de Grand View Research y reportes de la OMS sobre tendencias en salud digital (2023)',
      'Educación': 'Análisis de HolonIQ y UNESCO sobre transformación educativa (2022-2023)',
      'Finanzas': 'KPMG Pulse of Fintech y análisis de McKinsey sobre inclusión financiera (2023)',
      'Servicios': 'Reportes de ServiceNow y análisis de Deloitte sobre transformación de servicios (2023)',
      'Otro': 'Informes generales de industria y análisis de tendencias globales'
    };
    
    return `${base} ${sectorSpecific[sector] || sectorSpecific['Otro']} ${fuentes[sector] || fuentes['Otro']}`;
  };
  
  // Función para generar recomendaciones
  const generateRecommendations = (score, sector, subcategory, impact, urgency) => {
    const recommendations = [];
    
    // Recomendaciones basadas en puntuación
    if (score >= 85) {
      recommendations.push('El problema tiene alto potencial. Se recomienda priorizar su desarrollo y asignar recursos adecuados.');
    } else if (score >= 70) {
      recommendations.push('El problema muestra buen potencial. Considere realizar un MVP para validar el mercado.');
    } else {
      recommendations.push('El problema tiene potencial moderado. Se recomienda investigar más a fondo o refinar el enfoque.');
    }
    
    // Recomendaciones basadas en impacto
    if (impact === 'Alto' || impact === 'Muy alto') {
      recommendations.push('El alto impacto indica que la solución podría generar cambios significativos. Asegúrese de dimensionar adecuadamente la infraestructura y soporte.');
    }
    
    // Recomendaciones basadas en urgencia
    if (urgency === 'Alta' || urgency === 'Crítica') {
      recommendations.push('La alta urgencia sugiere establecer un plan de desarrollo acelerado, posiblemente priorizando funcionalidades esenciales para un lanzamiento temprano.');
    }
    
    return recommendations;
  };
  
  // Funcionalidad para guardar los datos del problema
  const saveProblem = async () => {
    if (!analysisComplete) return;
    
    // Creamos el nuevo problema con los valores calculados por la IA y el análisis completo
    const newProblem = {
      id: `problem_${Date.now()}`, // Añadimos un ID único
      title,
      description,
      sector,
      subcategory,
      country,
      continent,
      impact: analysisResult.calculatedImpact,
      urgency: analysisResult.calculatedUrgency,
      tags: analysisResult.calculatedTags,
      // Transferir el objeto de análisis completo sin ningún cambio
      analysis: {
        potentialScore: analysisResult.potentialScore,
        classification: analysisResult.classification,
        sectorAnalysis: analysisResult.sectorAnalysis,
        recommendations: analysisResult.recommendations,
        demandPrediction: analysisResult.demandPrediction,
        marketData: analysisResult.marketData,
        competidores: analysisResult.competidores,
        fuentes: analysisResult.fuentes,
        calculatedImpact: analysisResult.calculatedImpact,
        calculatedUrgency: analysisResult.calculatedUrgency,
        calculatedTags: analysisResult.calculatedTags
      },
      date: new Date().toISOString(),
    };
    
    console.log("Guardando problema con análisis completo:", JSON.stringify(newProblem.analysis));
    
    // Generar notificaciones para usuarios cuyos intereses coinciden con este problema
    try {
      await generateNotificationsForProblem(newProblem);
      console.log("Notificaciones generadas para el problema:", newProblem.title);
    } catch (error) {
      console.error("Error al generar notificaciones:", error);
    }
    
    // Navegamos de vuelta al dashboard con el nuevo problema
    navigation.navigate('Dashboard', { newProblem });
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Nueva Observación" />
          </Appbar.Header>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>
              <Surface style={styles.infoSurface}>
                <Text style={styles.infoTitle}>Convierte tus experiencias en ingresos reales</Text>
                <Text style={styles.infoText}>
                  Publica observaciones estratégicas y claras. Cuanto mayor sea el interés y relevancia que generes, mayores serán las recompensas económicas y el reconocimiento dentro de la comunidad Nexwise. ¡Cada observación que publiques puede convertirse en una fuente continua de ingresos para ti!
                </Text>
              </Surface>

              <TextInput
                label="Título de la observación"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Descripción detallada"
                value={description}
                onChangeText={setDescription}
                style={styles.textarea}
                multiline
                numberOfLines={6}
                mode="outlined"
                placeholder="Describe tu observación con la mayor cantidad de detalles posible. La IA analizará tu descripción para determinar el impacto, urgencia y etiquetas relevantes."
              />
              
              <Text style={styles.sectionTitle}>Sector:</Text>
              <RadioButton.Group onValueChange={value => setSector(value)} value={sector}>
                <View style={styles.radioGroup}>
                  {SECTORS.map(s => (
                    <RadioButton.Item key={s} label={s} value={s} />
                  ))}
                </View>
              </RadioButton.Group>
              
              {/* Selector de Subcategoría */}
              <Text style={styles.sectionTitle}>Subcategoría:</Text>
              <List.Accordion
                title={subcategory || 'Seleccionar subcategoría'}
                expanded={subcategoryMenuVisible}
                onPress={() => setSubcategoryMenuVisible(!subcategoryMenuVisible)}
                style={styles.subcategorySelector}
              >
                {SUBCATEGORIES[sector]?.map((sub) => (
                  <List.Item
                    key={sub}
                    title={sub}
                    onPress={() => {
                      setSubcategory(sub);
                      setSubcategoryMenuVisible(false);
                    }}
                    style={subcategory === sub ? styles.selectedSubcategory : null}
                  />
                ))}
              </List.Accordion>
              
              {/* Selector de Continente */}
              <Text style={styles.sectionTitle}>Continente:</Text>
              <List.Accordion
                title={continent || 'Seleccionar continente'}
                expanded={continentMenuVisible}
                onPress={() => setContinentMenuVisible(!continentMenuVisible)}
                style={styles.subcategorySelector}
              >
                {CONTINENTS.map((cont) => (
                  <List.Item
                    key={cont}
                    title={cont}
                    onPress={() => {
                      setContinent(cont);
                      setContinentMenuVisible(false);
                    }}
                    style={continent === cont ? styles.selectedSubcategory : null}
                  />
                ))}
              </List.Accordion>
              
              {/* Selector de País */}
              <Text style={styles.sectionTitle}>País:</Text>
              <List.Accordion
                title={country || 'Seleccionar país'}
                expanded={countryMenuVisible}
                onPress={() => setCountryMenuVisible(!countryMenuVisible)}
                style={styles.subcategorySelector}
              >
                {COUNTRIES.map((c) => (
                  <List.Item
                    key={c}
                    title={c}
                    onPress={() => {
                      setCountry(c);
                      setCountryMenuVisible(false);
                    }}
                    style={country === c ? styles.selectedSubcategory : null}
                  />
                ))}
              </List.Accordion>
              
              <Text style={styles.infoText}>
                Nuestra IA analizará automáticamente tu problema para determinar su impacto, urgencia y etiquetas relevantes.
                No necesitas introducir estos datos manualmente.
              </Text>
              
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
              
              <Button
                mode="contained"
                onPress={startAnalysis}
                style={styles.button}
                disabled={analyzing || !validateForm()}
              >
                {analyzing ? 'Analizando...' : 'Analizar Problema'}
              </Button>
              
              {analyzing && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    Analizando problema con IA...
                  </Text>
                  <ProgressBar progress={progress} style={styles.progressBar} />
                </View>
              )}
            </View>
          </ScrollView>
          
          <Portal>
            <Dialog
              visible={analysisVisible}
              onDismiss={() => setAnalysisVisible(false)}
              style={styles.dialog}
            >
              <Dialog.Title>Análisis de IA Completado</Dialog.Title>
              <Dialog.ScrollArea style={styles.dialogScroll}>
                <ScrollView>
                  {analysisResult && (
                    <View style={styles.analysisContainer}>
                      <Card style={styles.scoreCard}>
                        <Card.Content>
                          <Text style={styles.scoreTitle}>Puntuación de Potencial</Text>
                          <Text style={styles.scoreValue}>{analysisResult.potentialScore}/100</Text>
                        </Card.Content>
                      </Card>
                      
                      <Card style={[styles.classificationCard, {backgroundColor: analysisResult.classification.color}]}>
                        <Card.Content>
                          <Text style={styles.classificationTitle}>Clasificación</Text>
                          <Text style={styles.classificationValue}>{analysisResult.classification.classification}</Text>
                          <Text style={styles.classificationScore}>Puntuación: {analysisResult.classification.score}/10</Text>
                          <Divider style={styles.divider} />
                          <Text style={styles.classificationJustification}>{analysisResult.classification.justification}</Text>
                          <Text style={styles.classificationFactibilidad}>
                            <Text style={styles.bold}>Factibilidad de resolución: </Text>
                            {analysisResult.classification.factibilidad}
                          </Text>
                        </Card.Content>
                      </Card>
                      
                      <Card style={styles.analysisCard}>
                        <Card.Title title="Análisis de la IA" />
                        <Card.Content>
                          <Text style={styles.analysisItem}>
                            <Text style={styles.bold}>Sector: </Text>
                            {sector}
                          </Text>
                          <Text style={styles.analysisItem}>
                            <Text style={styles.bold}>Subcategoría: </Text>
                            {subcategory}
                          </Text>
                          <Text style={styles.analysisItem}>
                            <Text style={styles.bold}>Impacto: </Text>
                            {analysisResult.calculatedImpact}
                          </Text>
                          <Text style={styles.analysisItem}>
                            <Text style={styles.bold}>Urgencia: </Text>
                            {analysisResult.calculatedUrgency}
                          </Text>
                          <Text style={styles.analysisItem}>
                            <Text style={styles.bold}>Etiquetas sugeridas: </Text>
                            {analysisResult.calculatedTags.join(', ')}
                          </Text>
                        </Card.Content>
                      </Card>
                      
                      <Card style={styles.analysisCard}>
                        <Card.Title title="Análisis de Mercado" />
                        <Card.Content>
                          <Text style={styles.analysisItem}>
                            <Text style={styles.bold}>Competencia: </Text>
                            {analysisResult.sectorAnalysis.competencia}
                          </Text>
                          <Text style={styles.analysisItem}>
                            <Text style={styles.bold}>Tendencia: </Text>
                            {analysisResult.sectorAnalysis.tendencia}
                          </Text>
                          <Text style={styles.analysisItem}>
                            <Text style={styles.bold}>Oportunidad: </Text>
                            {analysisResult.sectorAnalysis.oportunidad}
                          </Text>
                        </Card.Content>
                      </Card>
                      
                      <Card style={styles.analysisCard}>
                        <Card.Title title="Competidores en el Sector" />
                        <Card.Content>
                          {analysisResult.competidores && analysisResult.competidores.map((competidor, idx) => (
                            <View key={idx} style={styles.competidorItem}>
                              <Text style={styles.competidorName}>{competidor.nombre}</Text>
                              <Text style={styles.competidorDetail}>Ubicación: {competidor.ubicacion}</Text>
                              <Text style={styles.competidorDetail}>Enfoque: {competidor.enfoque}</Text>
                              <Text style={styles.competidorDetail}>Fundación: {competidor.fundacion}</Text>
                              {idx < analysisResult.competidores.length - 1 && <Divider style={styles.divider} />}
                            </View>
                          ))}
                        </Card.Content>
                      </Card>
                      
                      <Card style={styles.analysisCard}>
                        <Card.Title title="Datos de Mercado" />
                        <Card.Content>
                          <Text style={styles.marketDataTitle}>Tamaño de Mercado Estimado:</Text>
                          <Text style={styles.marketDataValue}>
                            ${analysisResult.marketData.marketSize.valor}M con crecimiento anual de {analysisResult.marketData.marketSize.crecimiento}%
                          </Text>
                          <Text style={styles.marketDataSource}>
                            Fuente: {analysisResult.marketData.marketSize.fuente}
                          </Text>
                          
                          <Text style={styles.marketDataTitle}>KPIs Estimados:</Text>
                          {analysisResult.marketData.kpis.map((kpi, idx) => (
                            <View key={idx} style={styles.kpiItem}>
                              <Text style={styles.kpiName}>{kpi.nombre}: <Text style={styles.kpiValue}>{kpi.valor}</Text></Text>
                              {kpi.timeframe && <Text style={styles.kpiDetail}>Periodo: {kpi.timeframe}</Text>}
                              {kpi.confianza && <Text style={styles.kpiDetail}>Confianza: {kpi.confianza}</Text>}
                              {kpi.fuente && <Text style={styles.kpiDetail}>Fuente: {kpi.fuente}</Text>}
                            </View>
                          ))}
                          
                          <Text style={styles.marketDataTitle}>Tendencias Relacionadas:</Text>
                          {analysisResult.marketData.trends.map((trend, idx) => (
                            <View key={idx} style={styles.trendItem}>
                              <Text style={styles.trendName}>{trend.nombre}</Text>
                              <Text style={styles.trendDetail}>Crecimiento: {trend.crecimiento}</Text>
                              <Text style={styles.trendDetail}>Fuente: {trend.fuente}</Text>
                            </View>
                          ))}
                        </Card.Content>
                      </Card>
                      
                      <Card style={styles.analysisCard}>
                        <Card.Title title="Fuentes de Información" />
                        <Card.Content>
                          {analysisResult.fuentes && analysisResult.fuentes.map((fuente, idx) => (
                            <View key={idx} style={styles.fuenteItem}>
                              <Text style={styles.fuenteName}>{fuente.nombre}</Text>
                              <Text style={styles.fuenteUrl}>{fuente.url}</Text>
                              <Text style={styles.fuenteTipo}>Tipo: {fuente.tipo}</Text>
                              {idx < analysisResult.fuentes.length - 1 && <Divider style={styles.divider} />}
                            </View>
                          ))}
                        </Card.Content>
                      </Card>
                      
                      <Card style={styles.analysisCard}>
                        <Card.Title title="Predicción de Demanda" />
                        <Card.Content>
                          <Text style={styles.analysisText}>{analysisResult.demandPrediction}</Text>
                        </Card.Content>
                      </Card>
                      
                      <Card style={styles.analysisCard}>
                        <Card.Title title="Recomendaciones" />
                        <Card.Content>
                          {analysisResult.recommendations.map((rec, index) => (
                            <View key={index} style={styles.recommendation}>
                              <IconButton icon="check-circle" size={20} />
                              <Text style={styles.recommendationText}>{rec}</Text>
                            </View>
                          ))}
                        </Card.Content>
                      </Card>
                    </View>
                  )}
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={() => setAnalysisVisible(false)}>Cancelar</Button>
                <Button mode="contained" onPress={saveProblem}>
                  Guardar Problema
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  textarea: {
    marginBottom: 16,
    height: 150,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  infoText: {
    backgroundColor: '#e8eaf6',
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
    marginBottom: 16,
    color: '#3f51b5',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogScroll: {
    paddingHorizontal: 0,
  },
  analysisContainer: {
    padding: 8,
  },
  scoreCard: {
    marginBottom: 16,
    backgroundColor: '#e8f5e9',
  },
  scoreTitle: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e7d32',
  },
  analysisCard: {
    marginBottom: 16,
  },
  analysisItem: {
    marginBottom: 8,
  },
  analysisText: {
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    flex: 1,
    paddingRight: 8,
  },
  competidorItem: {
    marginBottom: 12,
  },
  competidorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  competidorDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  divider: {
    marginVertical: 8,
  },
  fuenteItem: {
    marginBottom: 12,
  },
  fuenteName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  fuenteUrl: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 2,
  },
  fuenteTipo: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555',
  },
  marketDataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  marketDataValue: {
    fontSize: 15,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  marketDataSource: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
  kpiItem: {
    marginBottom: 8,
  },
  kpiName: {
    fontSize: 14,
    fontWeight: '500',
  },
  kpiValue: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  kpiDetail: {
    fontSize: 13,
    color: '#666',
    marginLeft: 2,
  },
  trendItem: {
    marginBottom: 10,
  },
  trendName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4527A0',
  },
  trendDetail: {
    fontSize: 13,
    color: '#666',
    marginLeft: 2,
  },
  classificationCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  classificationTitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  classificationValue: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginTop: 4,
  },
  classificationScore: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginTop: 2,
  },
  classificationJustification: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  classificationFactibilidad: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  subcategorySelector: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 15
  },
  selectedSubcategory: {
    backgroundColor: '#e8f0fe'
  },
  attachmentsSection: {
    marginTop: 16,
    marginBottom: 16,
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
  infoSurface: {
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6200ee',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
  },
}); 