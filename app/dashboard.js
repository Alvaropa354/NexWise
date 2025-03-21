import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions, Alert, Modal, ActivityIndicator } from 'react-native';
import { Text, Button, Card, Appbar, Chip, Searchbar, Surface, Dialog, Portal, Snackbar, Divider, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnreadCount } from './services/notifications';
import ROUTES from './routes';

// Datos de ejemplo para mostrar problemas
const MOCK_PROBLEMS = [
  {
    id: '1',
    title: 'Escasez de agua potable en zonas rurales',
    description: 'Muchas comunidades rurales tienen acceso limitado a agua potable, lo que afecta la salud y calidad de vida.',
    sector: 'Salud',
    subcategory: 'Nutrición y Salud Preventiva',
    impact: 'Alto',
    urgency: 'Alta',
    tags: ['Agua', 'Rural', 'Salud'],
    date: '2023-11-15T09:00:00Z',
    country: 'México',
    continent: 'América',
    analysis: {
      potentialScore: 85,
      marketSize: 'Grande',
      competition: 'Baja',
      recommendation: 'Invertir con alta prioridad'
    }
  },
  {
    id: '2',
    title: 'Acceso a internet en áreas remotas',
    description: 'La brecha digital afecta a comunidades alejadas que no pueden acceder a servicios educativos y oportunidades laborales en línea.',
    sector: 'Tecnología',
    subcategory: 'Computación en la Nube e Infraestructura Digital',
    impact: 'Alto',
    urgency: 'Media',
    tags: ['Internet', 'Educación', 'Brecha digital'],
    date: '2023-11-12T14:30:00Z',
    country: 'Brasil',
    continent: 'América',
    analysis: {
      potentialScore: 78,
      marketSize: 'Mediano',
      competition: 'Media',
      recommendation: 'Explorar con inversión moderada'
    }
  },
  {
    id: '3',
    title: 'Deserción escolar en secundaria',
    description: 'Altos índices de abandono escolar en nivel secundario, especialmente en zonas de bajos recursos.',
    sector: 'Educación',
    subcategory: 'Inclusión Educativa y Accesibilidad',
    impact: 'Muy alto',
    urgency: 'Alta',
    tags: ['Educación', 'Jóvenes', 'Pobreza'],
    date: '2023-11-10T11:15:00Z',
    country: 'España',
    continent: 'Europa',
    analysis: {
      potentialScore: 92,
      marketSize: 'Grande',
      competition: 'Alta',
      recommendation: 'Invertir con estrategia diferenciada'
    }
  },
  {
    id: '4',
    title: 'Dificultad de acceso a financiamiento para emprendedores',
    description: 'Pequeños emprendedores enfrentan barreras para obtener créditos y capital inicial para sus negocios.',
    sector: 'Finanzas',
    subcategory: 'Inversión y Crowdfunding',
    impact: 'Medio',
    urgency: 'Media',
    tags: ['Emprendimiento', 'Financiamiento', 'Inclusión financiera'],
    date: '2023-11-08T16:45:00Z',
    country: 'Argentina',
    continent: 'América',
    analysis: {
      potentialScore: 65,
      marketSize: 'Mediano',
      competition: 'Alta',
      recommendation: 'Explorar nichos específicos'
    }
  },
  {
    id: '5',
    title: 'Gestión ineficiente de residuos urbanos',
    description: 'Deficiencias en la recogida, clasificación y procesamiento de residuos en grandes ciudades generan problemas ambientales.',
    sector: 'Sostenibilidad',
    subcategory: 'Economía Circular y Gestión de Residuos',
    impact: 'Alto',
    urgency: 'Alta',
    tags: ['Residuos', 'Contaminación', 'Ciudad'],
    date: '2023-11-05T10:30:00Z',
    country: 'Alemania',
    continent: 'Europa',
    analysis: {
      potentialScore: 81,
      marketSize: 'Grande',
      competition: 'Media',
      recommendation: 'Invertir en soluciones innovadoras'
    }
  },
  {
    id: '6',
    title: 'Escasez de vivienda asequible',
    description: 'Precios elevados de la vivienda en zonas urbanas dificultan el acceso a hogares dignos para familias de ingresos medios y bajos.',
    sector: 'Servicios',
    subcategory: 'Gestión de Instalaciones y Espacios',
    impact: 'Alto',
    urgency: 'Media',
    tags: ['Vivienda', 'Urbanismo', 'Inclusión'],
    date: '2023-11-03T09:45:00Z',
    country: 'Estados Unidos',
    continent: 'América',
    analysis: {
      potentialScore: 76,
      marketSize: 'Grande',
      competition: 'Alta',
      recommendation: 'Innovar en modelos alternativos'
    }
  },
  {
    id: '7',
    title: 'Baja adopción de energías renovables en industria',
    description: 'El sector industrial mantiene alta dependencia de combustibles fósiles a pesar de alternativas más sostenibles disponibles.',
    sector: 'Sostenibilidad',
    subcategory: 'Energías Renovables',
    impact: 'Muy alto',
    urgency: 'Alta',
    tags: ['Energía', 'Industria', 'Sostenibilidad'],
    date: '2023-10-30T14:20:00Z',
    country: 'China',
    continent: 'Asia',
    analysis: {
      potentialScore: 88,
      marketSize: 'Muy grande',
      competition: 'Media',
      recommendation: 'Priorizar inversión estratégica'
    }
  },
  {
    id: '8',
    title: 'Congestión de tráfico en grandes ciudades',
    description: 'Horas perdidas, contaminación y estrés debido a sistemas de transporte urbano ineficientes y exceso de vehículos privados.',
    sector: 'Transporte y Logística',
    subcategory: 'Movilidad Urbana y Sistemas de Transporte',
    impact: 'Alto',
    urgency: 'Media',
    tags: ['Transporte', 'Ciudad', 'Movilidad'],
    date: '2023-10-28T11:10:00Z',
    country: 'India',
    continent: 'Asia',
    analysis: {
      potentialScore: 79,
      marketSize: 'Grande',
      competition: 'Alta',
      recommendation: 'Desarrollar soluciones integradas'
    }
  },
  {
    id: '9',
    title: 'Dificultad para encontrar talento tecnológico cualificado',
    description: 'Empresas enfrentan escasez de profesionales con habilidades avanzadas en IA, ciberseguridad y desarrollo de software.',
    sector: 'Tecnología',
    subcategory: 'Inteligencia Artificial y Machine Learning',
    impact: 'Medio',
    urgency: 'Alta',
    tags: ['Talento', 'Formación', 'Tecnología'],
    date: '2023-10-25T15:30:00Z',
    country: 'Japón',
    continent: 'Asia',
    analysis: {
      potentialScore: 72,
      marketSize: 'Mediano',
      competition: 'Media',
      recommendation: 'Invertir en programas de formación'
    }
  },
  {
    id: '10',
    title: 'Acceso limitado a servicios de salud mental',
    description: 'Insuficientes recursos y estigmatización dificultan el tratamiento adecuado de problemas de salud mental en la población.',
    sector: 'Salud',
    subcategory: 'Salud Mental y Bienestar',
    impact: 'Alto',
    urgency: 'Alta',
    tags: ['Salud mental', 'Bienestar', 'Acceso'],
    date: '2023-10-22T09:15:00Z',
    country: 'Australia',
    continent: 'Oceanía',
    analysis: {
      potentialScore: 83,
      marketSize: 'Grande',
      competition: 'Baja',
      recommendation: 'Priorizar inversión con enfoque innovador'
    }
  },
  {
    id: '11',
    title: 'Inclusión financiera en zonas rurales',
    description: 'Poblaciones alejadas de centros urbanos carecen de acceso a servicios financieros básicos necesarios para el desarrollo económico.',
    sector: 'Finanzas',
    subcategory: 'Inclusión Financiera',
    impact: 'Medio',
    urgency: 'Media',
    tags: ['Inclusión', 'Rural', 'Finanzas'],
    date: '2023-10-20T10:40:00Z',
    country: 'Sudáfrica',
    continent: 'África',
    analysis: {
      potentialScore: 68,
      marketSize: 'Mediano',
      competition: 'Baja',
      recommendation: 'Explorar soluciones adaptadas al contexto local'
    }
  },
  {
    id: '12',
    title: 'Baja digitalización de pequeñas empresas',
    description: 'PyMEs enfrentan dificultades para adoptar tecnologías digitales que mejorarían su competitividad y eficiencia.',
    sector: 'Tecnología',
    subcategory: 'Transformación Digital',
    impact: 'Medio',
    urgency: 'Media',
    tags: ['PyMEs', 'Digitalización', 'Competitividad'],
    date: '2023-10-18T14:50:00Z',
    country: 'Italia',
    continent: 'Europa',
    analysis: {
      potentialScore: 71,
      marketSize: 'Grande',
      competition: 'Media',
      recommendation: 'Desarrollar soluciones escalables y asequibles'
    }
  }
];

// Definición de subcategorías por sector
const sectorSubcategories = {
  'Tecnología': [
    'Inteligencia Artificial y Machine Learning',
    'Computación en la Nube e Infraestructura Digital',
    'Transformación Digital',
    'Ciberseguridad',
    'Internet de las Cosas (IoT)',
    'Blockchain y Tecnologías Distribuidas',
    'Realidad Virtual y Aumentada'
  ],
  'Salud': [
    'Medicina Preventiva',
    'Telemedicina',
    'Salud Mental y Bienestar',
    'Nutrición y Salud Preventiva',
    'Tecnologías Médicas',
    'Sistemas de Gestión Hospitalaria',
    'Biotecnología y Genómica'
  ],
  'Educación': [
    'Aprendizaje Digital',
    'Formación Continua',
    'Educación Temprana',
    'Inclusión Educativa y Accesibilidad',
    'Innovación Pedagógica',
    'Educación Superior',
    'Habilidades Profesionales'
  ],
  'Finanzas': [
    'Fintech',
    'Inclusión Financiera',
    'Inversión y Crowdfunding',
    'Servicios Bancarios Digitales',
    'Seguros y Gestión de Riesgos',
    'Educación Financiera',
    'Pagos Digitales'
  ],
  'Innovación': [
    'Gestión de la Innovación',
    'Emprendimiento',
    'Innovación Abierta',
    'Innovación Social',
    'Diseño y Creatividad',
    'Modelos de Negocio Innovadores',
    'Propiedad Intelectual'
  ],
  'Sostenibilidad': [
    'Energías Renovables',
    'Economía Circular y Gestión de Residuos',
    'Agricultura Sostenible',
    'Conservación de Recursos Naturales',
    'Edificación Sostenible',
    'Movilidad Sostenible',
    'Consumo Responsable'
  ],
  'Transporte y Logística': [
    'Movilidad Urbana y Sistemas de Transporte',
    'Logística de Última Milla',
    'Cadena de Suministro',
    'Transporte Autónomo',
    'Logística Verde',
    'Infraestructuras de Transporte',
    'Gestión de Flotas'
  ],
  'Servicios': [
    'Comercio Electrónico',
    'Servicios Profesionales',
    'Gestión de Instalaciones y Espacios',
    'Turismo y Hospitalidad',
    'Servicios Personalizados',
    'Economía Colaborativa',
    'Atención al Cliente'
  ]
};

// Definir sectores disponibles
const sectors = [
  'Todos', 
  'Tecnología', 
  'Salud', 
  'Educación', 
  'Finanzas', 
  'Sostenibilidad', 
  'Agricultura', 
  'Energía', 
  'Transporte', 
  'Turismo', 
  'Otros'
];

const getImpactColor = (impact) => {
  switch (impact.toLowerCase()) {
    case 'muy alto':
      return '#FF4444';
    case 'alto':
      return '#FF8C00';
    case 'medio':
      return '#FFD700';
    case 'bajo':
      return '#90EE90';
    case 'muy bajo':
      return '#98FB98';
    default:
      return '#E0E0E0';
  }
};

const getUrgencyColor = (urgency) => {
  switch (urgency.toLowerCase()) {
    case 'alta':
      return '#FF4444';
    case 'media':
      return '#FFA500';
    case 'baja':
      return '#4CAF50';
    default:
      return '#E0E0E0';
  }
};

export default function DashboardScreen({ navigation }) {
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [problems, setProblems] = useState(MOCK_PROBLEMS);
  const [filteredProblems, setFilteredProblems] = useState(MOCK_PROBLEMS);
  const [activeSector, setActiveSector] = useState('Todos');
  const [activeSubcategory, setActiveSubcategory] = useState('Todas');
  const [subcategoriesVisible, setSubcategoriesVisible] = useState(false);
  
  // Nuevos estados para filtros avanzados
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [activeImpact, setActiveImpact] = useState('Todos');
  const [activeUrgency, setActiveUrgency] = useState('Todos');
  const [activePotentialRange, setActivePotentialRange] = useState('Todos');
  const [activeCountry, setActiveCountry] = useState('Todos');
  const [activeContinent, setActiveContinent] = useState('Todos');
  
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [analysisDialogVisible, setAnalysisDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [problemMarketData, setProblemMarketData] = useState(null);
  const [problemUrgencyData, setProblemUrgencyData] = useState(null);
  const [problemCompanies, setProblemCompanies] = useState([]);
  
  // Estado para las notificaciones
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [sectorMenuVisible, setSectorMenuVisible] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  
  // Cargar el número de notificaciones no leídas
  useEffect(() => {
    const loadUnreadNotifications = async () => {
      const count = await getUnreadCount();
      setUnreadNotifications(count);
    };
    
    loadUnreadNotifications();
    
    // Actualizar cada vez que el dashboard vuelve a tener el foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadUnreadNotifications();
    });
    
    return unsubscribe;
  }, [navigation]);

  // Comprobar si viene de creación de perfil
  useEffect(() => {
    if (route.params?.profileCreated) {
      setSnackbarMessage('¡Perfil creado con éxito! Ahora puedes aprovechar todas las funcionalidades de Nexwise.');
      setSnackbarVisible(true);
      // Limpiamos los parámetros para que no se muestre el mensaje en futuras navegaciones
      navigation.setParams({ profileCreated: undefined, profileData: undefined });
    }
    
    // Agregar problema recién creado a la lista
    if (route.params?.newProblem) {
      const newProblem = route.params.newProblem;
      console.log("Añadiendo nuevo problema:", newProblem.title);
      
      // Actualizamos la lista de problemas
      setProblems(prevProblems => [newProblem, ...prevProblems]);
      setFilteredProblems(prevProblems => [newProblem, ...prevProblems]);
      
      // Mostramos confirmación
      setSnackbarMessage('Observación comentada exitosamente');
      setSnackbarVisible(true);
      
      // Limpiamos los parámetros
      navigation.setParams({ newProblem: undefined });
    }
  }, [route.params]);
  
  // Función para filtrar problemas por búsqueda
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    // Mantener solo filtros de sector y subcategoría, desactivar filtros adicionales
    if (filtersApplied) {
      setFiltersApplied(false);
      // Restablecer filtros adicionales
      setActiveImpact('Todos');
      setActiveUrgency('Todos');
      setActivePotentialRange('Todos');
      setActiveCountry('Todos');
      setActiveContinent('Todos');
    }
    setFilteredProblems(filterBySector(problems, activeSector, activeSubcategory, query));
  };

  // Función para filtrar problemas según el sector y subcategoría seleccionados
  const filterBySector = (problemList, sector, subcategory, query = '') => {
    // Filtrar por búsqueda de texto
    let filtered = problemList;
    
    console.log("Filtrando problemas:", {
      total: problemList.length,
      sector: sector,
      subcategory: subcategory,
      query: query
    });
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(problem => 
        problem.title.toLowerCase().includes(lowerQuery) || 
        problem.description.toLowerCase().includes(lowerQuery) ||
        problem.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Filtrar por sector si no es "Todos"
    if (sector !== 'Todos') {
      filtered = filtered.filter(problem => {
        const match = problem.sector === sector;
        if (!match) {
          console.log(`No coincide sector: problema.sector=${problem.sector}, sector seleccionado=${sector}`);
        }
        return match;
      });
      console.log(`Después de filtrar por sector: ${filtered.length} problemas`);
    }
    
    // Filtrar por subcategoría si no es "Todas" y hay un sector seleccionado
    if (subcategory !== 'Todas' && sector !== 'Todos') {
      filtered = filtered.filter(problem => {
        const match = problem.subcategory === subcategory;
        if (!match) {
          console.log(`No coincide subcategoría: problema.subcategory=${problem.subcategory}, subcategoría seleccionada=${subcategory}`);
        }
        return match;
      });
      console.log(`Después de filtrar por subcategoría: ${filtered.length} problemas`);
    }
    
    // Aplicar filtros adicionales solo si están activos
    // y no estamos en el modo básico de navegación por sector/subcategoría
    if (filtersApplied) {
      // Filtrar por impacto
      if (activeImpact !== 'Todos') {
        filtered = filtered.filter(problem => problem.impact === activeImpact);
      }
      
      // Filtrar por urgencia
      if (activeUrgency !== 'Todos') {
        filtered = filtered.filter(problem => problem.urgency === activeUrgency);
      }
      
      // Filtrar por rango de potencial
      if (activePotentialRange !== 'Todos') {
        filtered = filtered.filter(problem => {
          const score = problem.analysis.potentialScore;
          switch (activePotentialRange) {
            case '0-25%':
              return score >= 0 && score <= 25;
            case '26-49%':
              return score >= 26 && score <= 49;
            case '50-75%':
              return score >= 50 && score <= 75;
            case '76-84%':
              return score >= 76 && score <= 84;
            case '85-100%':
              return score >= 85 && score <= 100;
            default:
              return true;
          }
        });
      }
      
      // Filtrar por país
      if (activeCountry !== 'Todos') {
        filtered = filtered.filter(problem => problem.country === activeCountry);
      }
      
      // Filtrar por continente
      if (activeContinent !== 'Todos') {
        filtered = filtered.filter(problem => problem.continent === activeContinent);
      }
    }
    
    console.log(`Resultados finales después de filtrar: ${filtered.length} problemas`);
    return filtered;
  };

  // Función para mostrar detalles de un problema
  const showProblemDetails = (problem) => {
    setSelectedProblem(problem);
    setDetailDialogVisible(true);
  };

  // Función para calcular el potencial real basado en datos de mercado
  const calculateMarketPotential = (sector, score) => {
    // Datos de mercado actualizados por sector
    const marketData = {
      'Tecnología': {
        companiesCount: 12500,
        marketGrowth: 14.5,
        investmentVolume: '980B',
        avgCompanyValue: '2.8B',
        saturationIndex: 0.68
      },
      'Salud': {
        companiesCount: 8700,
        marketGrowth: 9.2,
        investmentVolume: '720B',
        avgCompanyValue: '3.4B',
        saturationIndex: 0.55
      },
      'Educación': {
        companiesCount: 5200,
        marketGrowth: 7.8,
        investmentVolume: '340B',
        avgCompanyValue: '920M',
        saturationIndex: 0.48
      },
      'Finanzas': {
        companiesCount: 9800,
        marketGrowth: 10.5,
        investmentVolume: '1.2T',
        avgCompanyValue: '5.6B',
        saturationIndex: 0.72
      },
      'Servicios': {
        companiesCount: 16300,
        marketGrowth: 6.5,
        investmentVolume: '580B',
        avgCompanyValue: '1.1B',
        saturationIndex: 0.59
      },
      'Innovación': {
        companiesCount: 8900,
        marketGrowth: 15.2,
        investmentVolume: '750B',
        avgCompanyValue: '2.1B',
        saturationIndex: 0.62
      },
      'Sostenibilidad': {
        companiesCount: 7200,
        marketGrowth: 12.8,
        investmentVolume: '520B',
        avgCompanyValue: '1.8B',
        saturationIndex: 0.45
      },
      'Educación y Formación': {
        companiesCount: 6100,
        marketGrowth: 8.5,
        investmentVolume: '410B',
        avgCompanyValue: '1.0B',
        saturationIndex: 0.50
      },
      'Industria y Manufactura': {
        companiesCount: 14200,
        marketGrowth: 5.6,
        investmentVolume: '890B',
        avgCompanyValue: '3.2B',
        saturationIndex: 0.75
      },
      'Transporte y Logística': {
        companiesCount: 9500,
        marketGrowth: 7.2,
        investmentVolume: '680B',
        avgCompanyValue: '2.4B',
        saturationIndex: 0.65
      },
      'Consumo y Comercio Digital': {
        companiesCount: 11300,
        marketGrowth: 13.4,
        investmentVolume: '810B',
        avgCompanyValue: '1.7B',
        saturationIndex: 0.70
      },
      'Seguridad y Privacidad': {
        companiesCount: 5800,
        marketGrowth: 16.8,
        investmentVolume: '480B',
        avgCompanyValue: '1.5B',
        saturationIndex: 0.58
      },
      'Turismo y Experiencias Digitales': {
        companiesCount: 4200,
        marketGrowth: 9.5,
        investmentVolume: '320B',
        avgCompanyValue: '0.9B',
        saturationIndex: 0.52
      },
      'Alimentación': {
        companiesCount: 10200,
        marketGrowth: 6.8,
        investmentVolume: '720B',
        avgCompanyValue: '2.6B',
        saturationIndex: 0.68
      },
      'Sector Legal y Regulación': {
        companiesCount: 3800,
        marketGrowth: 5.4,
        investmentVolume: '290B',
        avgCompanyValue: '1.2B',
        saturationIndex: 0.60
      }
    };
    
    // Datos predeterminados si el sector no está en la lista
    const defaultData = {
      companiesCount: 7500,
      marketGrowth: 8.0,
      investmentVolume: '450B',
      avgCompanyValue: '1.5B',
      saturationIndex: 0.60
    };
    
    const data = marketData[sector] || defaultData;
    
    // Calcular potencial ajustado basado en datos de mercado
    // Fórmula: score base * (crecimiento de mercado/10) * (1 - índice de saturación)
    const adjustedScore = Math.min(98, Math.max(35, 
      score * (data.marketGrowth/10) * (1 - data.saturationIndex) * 1.4
    ));
    
    return {
      adjustedScore: Math.round(adjustedScore),
      marketData: data
    };
  };
  
  // Función para evaluar urgencia basada en tendencias actuales
  const evaluateUrgency = (sector, impact, currentUrgency) => {
    // Tendencias de urgencia por sector (datos simulados actualizados)
    const urgencyTrends = {
      'Tecnología': {
        trend: 'Acelerada',
        growthRate: '+15% anual',
        disruptionRisk: 'Alto',
        timeToMarket: '6-12 meses'
      },
      'Salud': {
        trend: 'Estable-Alta',
        growthRate: '+8% anual',
        disruptionRisk: 'Medio-Alto',
        timeToMarket: '12-18 meses'
      },
      'Educación': {
        trend: 'Creciente',
        growthRate: '+12% anual',
        disruptionRisk: 'Medio',
        timeToMarket: '8-14 meses'
      },
      'Finanzas': {
        trend: 'Fluctuante',
        growthRate: '+9% anual',
        disruptionRisk: 'Alto',
        timeToMarket: '4-10 meses'
      },
      'Servicios': {
        trend: 'Moderada',
        growthRate: '+6% anual',
        disruptionRisk: 'Bajo-Medio',
        timeToMarket: '10-16 meses'
      }
    };
    
    // Datos predeterminados
    const defaultTrend = {
      trend: 'Variable',
      growthRate: '+7% anual',
      disruptionRisk: 'Medio',
      timeToMarket: '9-15 meses'
    };
    
    return urgencyTrends[sector] || defaultTrend;
  };
  
  // Función con datos empresariales detallados por sector
  const getDetailedCompanies = (sector) => {
    // Base de datos de empresas por sector con información financiera
    const companiesDatabase = {
      'Tecnología': [
        {
          name: 'Microsoft',
          description: 'Líder global en software, servicios cloud y soluciones empresariales',
          founded: 1975,
          hq: 'Redmond, Washington, EE.UU.',
          marketCap: '$2.8T',
          employees: '221,000+',
          revenue: '$198.3B (2022)',
          keyProducts: 'Windows, Office 365, Azure, LinkedIn',
          innovationIndex: 87
        },
        {
          name: 'Google (Alphabet)',
          description: 'Pionera en búsqueda web, publicidad digital e inteligencia artificial',
          founded: 1998,
          hq: 'Mountain View, California, EE.UU.',
          marketCap: '$1.9T',
          employees: '156,000+',
          revenue: '$282.8B (2022)',
          keyProducts: 'Google Search, Android, YouTube, Google Cloud',
          innovationIndex: 92
        },
        {
          name: 'Amazon Web Services',
          description: 'Líder en infraestructura cloud y plataformas de desarrollo',
          founded: 2006,
          hq: 'Seattle, Washington, EE.UU.',
          marketCap: 'División de Amazon ($1.7T)',
          employees: '75,000+ (división)',
          revenue: '$80.1B (2022)',
          keyProducts: 'EC2, S3, Lambda, DynamoDB',
          innovationIndex: 89
        }
      ],
      'Salud': [
        {
          name: 'Johnson & Johnson',
          description: 'Conglomerado multinacional de dispositivos médicos, farmacéuticos y bienes de consumo',
          founded: 1886,
          hq: 'New Brunswick, New Jersey, EE.UU.',
          marketCap: '$380B',
          employees: '142,000+',
          revenue: '$94.9B (2022)',
          keyProducts: 'Medicamentos, vacunas, dispositivos médicos',
          innovationIndex: 76
        },
        {
          name: 'Pfizer',
          description: 'Empresa farmacéutica global especializada en medicamentos y vacunas',
          founded: 1849,
          hq: 'Nueva York, EE.UU.',
          marketCap: '$240B',
          employees: '96,000+',
          revenue: '$100.3B (2022)',
          keyProducts: 'Vacunas, tratamientos oncológicos, medicamentos para enfermedades crónicas',
          innovationIndex: 82
        },
        {
          name: 'Siemens Healthineers',
          description: 'Proveedor de tecnología médica e innovaciones para diagnóstico y terapia',
          founded: 2018,
          hq: 'Erlangen, Alemania',
          marketCap: '$65B',
          employees: '69,500+',
          revenue: '$21.7B (2022)',
          keyProducts: 'Equipos de imagen médica, diagnóstico in vitro, sistemas de información clínica',
          innovationIndex: 85
        }
      ],
      'Educación': [
        {
          name: 'Pearson',
          description: 'Compañía multinacional de servicios educativos y publicaciones',
          founded: 1844,
          hq: 'Londres, Reino Unido',
          marketCap: '$7.2B',
          employees: '21,000+',
          revenue: '$4.2B (2022)',
          keyProducts: 'Materiales educativos, evaluaciones estandarizadas, plataformas de aprendizaje',
          innovationIndex: 68
        },
        {
          name: 'Coursera',
          description: 'Plataforma de aprendizaje en línea que ofrece cursos, especializaciones y títulos',
          founded: 2012,
          hq: 'Mountain View, California, EE.UU.',
          marketCap: '$1.9B',
          employees: '1,400+',
          revenue: '$523M (2022)',
          keyProducts: 'Cursos online, certificaciones profesionales, títulos universitarios en línea',
          innovationIndex: 88
        },
        {
          name: 'Blackboard',
          description: 'Empresa de tecnología educativa conocida por su sistema de gestión de aprendizaje',
          founded: 1997,
          hq: 'Washington D.C., EE.UU.',
          marketCap: 'Privada (adquirida por $2.3B)',
          employees: '3,000+',
          revenue: '$750M (est. 2022)',
          keyProducts: 'Blackboard Learn, Blackboard Collaborate, Blackboard Mobile',
          innovationIndex: 72
        }
      ],
      'Finanzas': [
        {
          name: 'JP Morgan Chase',
          description: 'Banco multinacional de inversión y servicios financieros',
          founded: 1799,
          hq: 'Nueva York, EE.UU.',
          marketCap: '$420B',
          employees: '288,000+',
          revenue: '$134.6B (2022)',
          keyProducts: 'Banca comercial, gestión de activos, servicios financieros corporativos',
          innovationIndex: 74
        },
        {
          name: 'Stripe',
          description: 'Empresa de tecnología financiera que procesa pagos para empresas en internet',
          founded: 2010,
          hq: 'San Francisco, California, EE.UU.',
          marketCap: 'Privada (valorada en $50B)',
          employees: '7,000+',
          revenue: '$12B (est. 2022)',
          keyProducts: 'Procesamiento de pagos, facturación, prevención de fraudes',
          innovationIndex: 93
        },
        {
          name: 'Revolut',
          description: 'Banco digital que ofrece cuentas bancarias y servicios financieros',
          founded: 2015,
          hq: 'Londres, Reino Unido',
          marketCap: 'Privada (valorada en $33B)',
          employees: '5,000+',
          revenue: '$1.1B (est. 2022)',
          keyProducts: 'Cuentas bancarias, cambio de divisas, criptomonedas, seguros',
          innovationIndex: 90
        }
      ],
      'Servicios': [
        {
          name: 'Accenture',
          description: 'Empresa multinacional de consultoría estratégica, soluciones tecnológicas y operaciones',
          founded: 1989,
          hq: 'Dublín, Irlanda',
          marketCap: '$210B',
          employees: '721,000+',
          revenue: '$61.8B (2022)',
          keyProducts: 'Consultoría tecnológica, servicios digitales, ciberseguridad',
          innovationIndex: 83
        },
        {
          name: 'IBM',
          description: 'Empresa centenaria de tecnología y consultoría',
          founded: 1911,
          hq: 'Armonk, Nueva York, EE.UU.',
          marketCap: '$135B',
          employees: '288,000+',
          revenue: '$60.5B (2022)',
          keyProducts: 'IBM Cloud, Watson, consultoría tecnológica, infraestructura',
          innovationIndex: 79
        },
        {
          name: 'Salesforce',
          description: 'Empresa de software basado en la nube especializada en CRM',
          founded: 1999,
          hq: 'San Francisco, California, EE.UU.',
          marketCap: '$220B',
          employees: '73,000+',
          revenue: '$31.4B (2022)',
          keyProducts: 'Sales Cloud, Service Cloud, Marketing Cloud, Tableau',
          innovationIndex: 87
        }
      ],
      'Innovación': [
        {
          name: 'Boston Dynamics',
          description: 'Empresa líder en robótica avanzada y sistemas de movimiento dinámico',
          founded: 1992,
          hq: 'Waltham, Massachusetts, EE.UU.',
          marketCap: 'Adquirida (valorada en $1.1B)',
          employees: '300+',
          revenue: '$150M (est. 2022)',
          keyProducts: 'Spot, Atlas, Stretch',
          innovationIndex: 95
        },
        {
          name: 'SpaceX',
          description: 'Fabricante aeroespacial y empresa de transporte espacial',
          founded: 2002,
          hq: 'Hawthorne, California, EE.UU.',
          marketCap: 'Privada (valorada en $127B)',
          employees: '12,000+',
          revenue: '$5.5B (est. 2022)',
          keyProducts: 'Falcon 9, Starship, Starlink',
          innovationIndex: 96
        },
        {
          name: 'Tesla',
          description: 'Fabricante de vehículos eléctricos y tecnología de energía limpia',
          founded: 2003,
          hq: 'Austin, Texas, EE.UU.',
          marketCap: '$780B',
          employees: '127,000+',
          revenue: '$81.5B (2022)',
          keyProducts: 'Model S, Model 3, Powerwall',
          innovationIndex: 92
        }
      ],
      'Sostenibilidad': [
        {
          name: 'Vestas',
          description: 'Fabricante, instalador y proveedor de servicios de aerogeneradores',
          founded: 1945,
          hq: 'Aarhus, Dinamarca',
          marketCap: '$30B',
          employees: '29,000+',
          revenue: '$16.9B (2022)',
          keyProducts: 'Aerogeneradores, sistemas de energía eólica',
          innovationIndex: 88
        },
        {
          name: 'Beyond Meat',
          description: 'Productor de sustitutos de carne a base de plantas',
          founded: 2009,
          hq: 'El Segundo, California, EE.UU.',
          marketCap: '$1.3B',
          employees: '700+',
          revenue: '$418M (2022)',
          keyProducts: 'Beyond Burger, Beyond Sausage',
          innovationIndex: 84
        },
        {
          name: 'Climeworks',
          description: 'Empresa especializada en captura directa de aire y almacenamiento de carbono',
          founded: 2009,
          hq: 'Zúrich, Suiza',
          marketCap: 'Privada (valorada en $1B+)',
          employees: '300+',
          revenue: '$50M (est. 2022)',
          keyProducts: 'Tecnología DAC, soluciones de captura de carbono',
          innovationIndex: 91
        }
      ],
      'Educación y Formación': [
        {
          name: 'Pearson',
          description: 'Compañía multinacional de servicios educativos y publicaciones',
          founded: 1844,
          hq: 'Londres, Reino Unido',
          marketCap: '$7.2B',
          employees: '21,000+',
          revenue: '$4.2B (2022)',
          keyProducts: 'Materiales educativos, evaluaciones estandarizadas, plataformas de aprendizaje',
          innovationIndex: 68
        },
        {
          name: 'Coursera',
          description: 'Plataforma de aprendizaje en línea que ofrece cursos, especializaciones y títulos',
          founded: 2012,
          hq: 'Mountain View, California, EE.UU.',
          marketCap: '$1.9B',
          employees: '1,400+',
          revenue: '$523M (2022)',
          keyProducts: 'Cursos online, certificaciones profesionales, títulos universitarios en línea',
          innovationIndex: 88
        },
        {
          name: 'Blackboard',
          description: 'Empresa de tecnología educativa conocida por su sistema de gestión de aprendizaje',
          founded: 1997,
          hq: 'Washington D.C., EE.UU.',
          marketCap: 'Privada (adquirida por $2.3B)',
          employees: '3,000+',
          revenue: '$750M (est. 2022)',
          keyProducts: 'Blackboard Learn, Blackboard Collaborate, Blackboard Mobile',
          innovationIndex: 72
        }
      ],
      'Industria y Manufactura': [
        {
          name: 'Johnson & Johnson',
          description: 'Conglomerado multinacional de dispositivos médicos, farmacéuticos y bienes de consumo',
          founded: 1886,
          hq: 'New Brunswick, New Jersey, EE.UU.',
          marketCap: '$380B',
          employees: '142,000+',
          revenue: '$94.9B (2022)',
          keyProducts: 'Medicamentos, vacunas, dispositivos médicos',
          innovationIndex: 76
        },
        {
          name: 'Pfizer',
          description: 'Empresa farmacéutica global especializada en medicamentos y vacunas',
          founded: 1849,
          hq: 'Nueva York, EE.UU.',
          marketCap: '$240B',
          employees: '96,000+',
          revenue: '$100.3B (2022)',
          keyProducts: 'Vacunas, tratamientos oncológicos, medicamentos para enfermedades crónicas',
          innovationIndex: 82
        },
        {
          name: 'Siemens Healthineers',
          description: 'Proveedor de tecnología médica e innovaciones para diagnóstico y terapia',
          founded: 2018,
          hq: 'Erlangen, Alemania',
          marketCap: '$65B',
          employees: '69,500+',
          revenue: '$21.7B (2022)',
          keyProducts: 'Equipos de imagen médica, diagnóstico in vitro, sistemas de información clínica',
          innovationIndex: 85
        }
      ],
      'Transporte y Logística': [
        {
          name: 'Maersk',
          description: 'Empresa global de transporte marítimo y logística integrada',
          founded: 1904,
          hq: 'Copenhague, Dinamarca',
          marketCap: '$32B',
          employees: '95,000+',
          revenue: '$81.5B (2022)',
          keyProducts: 'Transporte marítimo, servicios portuarios, logística integrada',
          innovationIndex: 78
        },
        {
          name: 'DHL',
          description: 'Proveedor líder mundial de servicios de correo y logística',
          founded: 1969,
          hq: 'Bonn, Alemania',
          marketCap: 'División de Deutsche Post ($49B)',
          employees: '380,000+',
          revenue: '$94.4B (2022)',
          keyProducts: 'Envío express, carga, e-commerce, soluciones de cadena de suministro',
          innovationIndex: 83
        },
        {
          name: 'Uber',
          description: 'Plataforma de movilidad y entrega bajo demanda',
          founded: 2009,
          hq: 'San Francisco, California, EE.UU.',
          marketCap: '$86B',
          employees: '32,000+',
          revenue: '$31.9B (2022)',
          keyProducts: 'Ride-sharing, entrega de comida, transporte de mercancías',
          innovationIndex: 88
        }
      ],
      'Consumo y Comercio Digital': [
        {
          name: 'Amazon',
          description: 'Corporación multinacional de comercio electrónico y servicios en la nube',
          founded: 1994,
          hq: 'Seattle, Washington, EE.UU.',
          marketCap: '$1.3T',
          employees: '1,540,000+',
          revenue: '$514B (2022)',
          keyProducts: 'Amazon.com, Prime, AWS, Whole Foods',
          innovationIndex: 91
        },
        {
          name: 'Alibaba Group',
          description: 'Multinacional especializada en comercio electrónico, retail y tecnología',
          founded: 1999,
          hq: 'Hangzhou, China',
          marketCap: '$230B',
          employees: '254,000+',
          revenue: '$126.5B (2022)',
          keyProducts: 'Taobao, Tmall, AliExpress, Alipay',
          innovationIndex: 86
        },
        {
          name: 'Shopify',
          description: 'Plataforma de comercio electrónico para tiendas online y retail',
          founded: 2006,
          hq: 'Ottawa, Canadá',
          marketCap: '$67B',
          employees: '10,000+',
          revenue: '$5.6B (2022)',
          keyProducts: 'Plataforma e-commerce, Shopify Payments, Shopify Fulfillment',
          innovationIndex: 88
        }
      ],
      'Seguridad y Privacidad': [
        {
          name: 'Crowdstrike',
          description: 'Empresa líder en ciberseguridad y protección de endpoints',
          founded: 2011,
          hq: 'Austin, Texas, EE.UU.',
          marketCap: '$52B',
          employees: '7,000+',
          revenue: '$2.2B (2022)',
          keyProducts: 'Falcon Platform, servicios de inteligencia de amenazas',
          innovationIndex: 93
        },
        {
          name: 'Palo Alto Networks',
          description: 'Empresa multinacional de ciberseguridad',
          founded: 2005,
          hq: 'Santa Clara, California, EE.UU.',
          marketCap: '$61B',
          employees: '13,900+',
          revenue: '$6.9B (2022)',
          keyProducts: 'Firewalls de próxima generación, plataformas de seguridad en la nube',
          innovationIndex: 88
        },
        {
          name: 'Darktrace',
          description: 'Empresa especializada en IA para ciberseguridad y defensa de redes',
          founded: 2013,
          hq: 'Cambridge, Reino Unido',
          marketCap: '$2.3B',
          employees: '2,000+',
          revenue: '$415M (2022)',
          keyProducts: 'Enterprise Immune System, Antigena, Darktrace Industrial',
          innovationIndex: 90
        }
      ],
      'Turismo y Experiencias Digitales': [
        {
          name: 'Airbnb',
          description: 'Mercado en línea para alojamientos y experiencias turísticas',
          founded: 2008,
          hq: 'San Francisco, California, EE.UU.',
          marketCap: '$78B',
          employees: '6,600+',
          revenue: '$8.4B (2022)',
          keyProducts: 'Plataforma de alojamiento, experiencias, aventuras',
          innovationIndex: 89
        },
        {
          name: 'Booking Holdings',
          description: 'Proveedor líder mundial de viajes en línea y servicios relacionados',
          founded: 1996,
          hq: 'Norwalk, Connecticut, EE.UU.',
          marketCap: '$98B',
          employees: '21,000+',
          revenue: '$17.1B (2022)',
          keyProducts: 'Booking.com, Priceline, Agoda, Kayak',
          innovationIndex: 81
        },
        {
          name: 'Expedia Group',
          description: 'Compañía de viajes en línea con una cartera de marcas de viaje',
          founded: 1996,
          hq: 'Seattle, Washington, EE.UU.',
          marketCap: '$16B',
          employees: '16,500+',
          revenue: '$11.2B (2022)',
          keyProducts: 'Expedia, Hotels.com, Vrbo, Trivago',
          innovationIndex: 76
        }
      ],
      'Alimentación': [
        {
          name: 'Nestlé',
          description: 'Mayor empresa de alimentos y bebidas del mundo',
          founded: 1866,
          hq: 'Vevey, Suiza',
          marketCap: '$265B',
          employees: '273,000+',
          revenue: '$94.4B (2022)',
          keyProducts: 'Alimentos infantiles, café, agua embotellada, confitería',
          innovationIndex: 75
        },
        {
          name: 'PepsiCo',
          description: 'Multinacional de alimentos, snacks y bebidas',
          founded: 1965,
          hq: 'Purchase, Nueva York, EE.UU.',
          marketCap: '$234B',
          employees: '309,000+',
          revenue: '$86.4B (2022)',
          keyProducts: "Pepsi, Lay's, Quaker, Gatorade",
          innovationIndex: 79
        },
        {
          name: 'Impossible Foods',
          description: 'Desarrollador de sustitutos de carne a base de plantas',
          founded: 2011,
          hq: 'Redwood City, California, EE.UU.',
          marketCap: 'Privada (valorada en $7B)',
          employees: '800+',
          revenue: '$280M (est. 2022)',
          keyProducts: 'Impossible Burger, Impossible Sausage',
          innovationIndex: 92
        }
      ],
      'Sector Legal y Regulación': [
        {
          name: 'LegalZoom',
          description: 'Proveedor de servicios legales en línea para consumidores y pequeñas empresas',
          founded: 2001,
          hq: 'Glendale, California, EE.UU.',
          marketCap: '$2.1B',
          employees: '1,100+',
          revenue: '$619M (2022)',
          keyProducts: 'Formación empresarial, propiedad intelectual, documentos legales',
          innovationIndex: 81
        },
        {
          name: 'Thomson Reuters',
          description: 'Proveedor multinacional de información empresarial y soluciones legales',
          founded: 2008,
          hq: 'Toronto, Canadá',
          marketCap: '$58B',
          employees: '24,000+',
          revenue: '$6.6B (2022)',
          keyProducts: 'Westlaw, Practical Law, CLEAR',
          innovationIndex: 76
        },
        {
          name: 'DocuSign',
          description: 'Empresa de acuerdos electrónicos y gestión de contratos',
          founded: 2003,
          hq: 'San Francisco, California, EE.UU.',
          marketCap: '$9.5B',
          employees: '7,400+',
          revenue: '$2.5B (2022)',
          keyProducts: 'eSignature, Contract Lifecycle Management, Analyzer',
          innovationIndex: 85
        }
      ]
    };
    
    // Lista predeterminada de empresas
    const defaultCompanies = [
      {
        name: 'Accenture',
        description: 'Consultoría global en soluciones tecnológicas',
        founded: 1989,
        hq: 'Dublín, Irlanda',
        marketCap: '$210B',
        employees: '721,000+',
        revenue: '$61.8B (2022)',
        keyProducts: 'Consultoría tecnológica, servicios digitales',
        innovationIndex: 83
      },
      {
        name: 'IBM',
        description: 'Servicios y soluciones de tecnología empresarial',
        founded: 1911,
        hq: 'Armonk, Nueva York, EE.UU.',
        marketCap: '$135B',
        employees: '288,000+',
        revenue: '$60.5B (2022)',
        keyProducts: 'IBM Cloud, Watson, consultoría tecnológica',
        innovationIndex: 79
      },
      {
        name: 'Salesforce',
        description: 'Plataforma de gestión de relaciones con clientes',
        founded: 1999,
        hq: 'San Francisco, California, EE.UU.',
        marketCap: '$220B',
        employees: '73,000+',
        revenue: '$31.4B (2022)',
        keyProducts: 'Sales Cloud, Service Cloud, Marketing Cloud',
        innovationIndex: 87
      }
    ];
    
    return companiesDatabase[sector] || defaultCompanies;
  };
  
  // Función para mostrar análisis de un problema
  const showProblemAnalysis = (problem) => {
    setAnalysisLoading(true);
    setAnalysisDialogVisible(true);

    // Simular un análisis más profundo con IA
    setTimeout(() => {
      // Obtener datos de mercado específicos del sector
      const marketData = calculateMarketPotential(problem.sector, problem.analysis.potentialScore);
      
      // Evaluar la urgencia y tendencias
      const urgencyData = evaluateUrgency(problem.sector, problem.impact, problem.urgency);
      
      // Obtener información detallada de empresas líderes
      const companies = getDetailedCompanies(problem.sector);

      // Análisis de impacto social y económico
      const socialImpact = {
        directBeneficiaries: Math.floor(Math.random() * 1000000) + 100000,
        indirectBeneficiaries: Math.floor(Math.random() * 5000000) + 500000,
        jobsCreated: Math.floor(Math.random() * 50000) + 5000,
        economicGrowth: (Math.random() * 5 + 1).toFixed(1),
        sustainabilityScore: Math.floor(Math.random() * 30 + 70),
        socialReturnOnInvestment: (Math.random() * 4 + 2).toFixed(1)
      };

      // Análisis de viabilidad técnica
      const technicalFeasibility = {
        implementationTime: `${Math.floor(Math.random() * 18 + 6)} meses`,
        technicalComplexity: Math.floor(Math.random() * 30 + 70),
        resourceRequirements: {
          human: Math.floor(Math.random() * 50 + 20),
          financial: `$${Math.floor(Math.random() * 90 + 10)}M`,
          technological: Math.floor(Math.random() * 20 + 80)
        },
        scalabilityPotential: Math.floor(Math.random() * 20 + 80)
      };

      // Análisis de riesgos
      const riskAnalysis = {
        marketRisks: [
          { risk: 'Competencia emergente', probability: Math.floor(Math.random() * 40 + 30), impact: Math.floor(Math.random() * 40 + 30) },
          { risk: 'Cambios regulatorios', probability: Math.floor(Math.random() * 40 + 20), impact: Math.floor(Math.random() * 40 + 40) },
          { risk: 'Adopción del mercado', probability: Math.floor(Math.random() * 30 + 20), impact: Math.floor(Math.random() * 30 + 50) }
        ],
        technicalRisks: [
          { risk: 'Complejidad técnica', probability: Math.floor(Math.random() * 30 + 20), impact: Math.floor(Math.random() * 30 + 40) },
          { risk: 'Escalabilidad', probability: Math.floor(Math.random() * 20 + 10), impact: Math.floor(Math.random() * 40 + 30) }
        ],
        operationalRisks: [
          { risk: 'Gestión de recursos', probability: Math.floor(Math.random() * 30 + 20), impact: Math.floor(Math.random() * 30 + 30) },
          { risk: 'Cadena de suministro', probability: Math.floor(Math.random() * 40 + 20), impact: Math.floor(Math.random() * 30 + 40) }
        ]
      };

      // Oportunidades de innovación
      const innovationOpportunities = [
        {
          area: 'Tecnológica',
          description: 'Implementación de IA y automatización',
          potentialImpact: Math.floor(Math.random() * 20 + 80),
          timeToMarket: `${Math.floor(Math.random() * 12 + 6)} meses`
        },
        {
          area: 'Modelo de Negocio',
          description: 'Plataforma como servicio (PaaS)',
          potentialImpact: Math.floor(Math.random() * 20 + 70),
          timeToMarket: `${Math.floor(Math.random() * 8 + 4)} meses`
        },
        {
          area: 'Experiencia de Usuario',
          description: 'Personalización mediante ML',
          potentialImpact: Math.floor(Math.random() * 20 + 75),
          timeToMarket: `${Math.floor(Math.random() * 6 + 3)} meses`
        }
      ];

      // Tendencias del mercado
      const marketTrends = [
        {
          trend: 'Digitalización acelerada',
          impact: Math.floor(Math.random() * 20 + 80),
          timeframe: '12-18 meses'
        },
        {
          trend: 'Sostenibilidad',
          impact: Math.floor(Math.random() * 20 + 75),
          timeframe: '24-36 meses'
        },
        {
          trend: 'Automatización',
          impact: Math.floor(Math.random() * 20 + 85),
          timeframe: '6-12 meses'
        }
      ];

      setProblemMarketData({
        ...marketData,
        socialImpact,
        technicalFeasibility,
        riskAnalysis,
        innovationOpportunities,
        marketTrends
      });
      setProblemUrgencyData(urgencyData);
      setProblemCompanies(companies);
      setAnalysisLoading(false);
    }, 3000); // Aumentamos el tiempo de "análisis" para dar más realismo
  };

  // Renderiza un problema
  const renderProblemItem = ({ item }) => (
    <Card style={styles.problemCard} elevation={2}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.problemTitle}>{item.title}</Text>
            <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.sectorContainer}>
            <Chip style={styles.sectorChip}>{item.sector}</Chip>
          </View>
        </View>

        <Text style={styles.problemDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <Chip key={index} style={styles.tagChip} textStyle={styles.tagText}>
              {tag}
            </Chip>
          ))}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Impacto</Text>
            <View style={[styles.metricChip, { backgroundColor: getImpactColor(item.impact) }]}>
              <Text style={styles.metricText}>{item.impact}</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Urgencia</Text>
            <View style={[styles.metricChip, { backgroundColor: getUrgencyColor(item.urgency) }]}>
              <Text style={styles.metricText}>{item.urgency}</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Potencial</Text>
            <View style={[styles.metricChip, getPotentialChipStyle(item.analysis?.potentialScore)]}>
              <Text style={styles.metricText}>{item.analysis?.potentialScore}%</Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.cardActions}>
          <Button 
            mode="outlined" 
            onPress={() => showProblemDetails(item)}
            style={styles.actionButton}
          >
            Ver Detalles
          </Button>
          <Button 
            mode="contained" 
            onPress={() => showProblemAnalysis(item)}
            style={styles.actionButton}
            icon="brain"
          >
            Análisis IA
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
  
  // Función para determinar el estilo del chip de potencial según el valor
  const getPotentialChipStyle = (score) => {
    if (score >= 85) return styles.potentialVeryHigh;
    if (score >= 76) return styles.potentialHigh;
    if (score >= 50) return styles.potentialMedium;
    if (score >= 26) return styles.potentialLow;
    return styles.potentialVeryLow;
  };

  // Simula cerrar sesión
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  // Constantes para las opciones de filtro
  const IMPACT_OPTIONS = ['Todos', 'Medio', 'Alto', 'Muy alto'];
  const URGENCY_OPTIONS = ['Todas', 'Baja', 'Media', 'Alta'];
  const POTENTIAL_RANGES = ['Todos', '0-25%', '26-49%', '50-75%', '76-84%', '85-100%'];
  const COUNTRIES = [
    'Todos', 'Estados Unidos', 'China', 'Alemania', 'Japón', 'Reino Unido', 
    'Francia', 'India', 'Brasil', 'Canadá', 'Rusia', 'Australia', 'Italia', 
    'España', 'Corea del Sur', 'México', 'Arabia Saudita', 'Sudáfrica', 
    'Turquía', 'Indonesia', 'Argentina'
  ];
  const CONTINENTS = ['Todos', 'América', 'Europa', 'Asia', 'África', 'Oceanía'];
  
  // Función para aplicar todos los filtros
  const applyAllFilters = () => {
    setFiltersApplied(true);
    setFilteredProblems(
      filterBySector(problems, activeSector, activeSubcategory, searchQuery)
    );
    setFiltersVisible(false);
  };
  
  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setActiveImpact('Todos');
    setActiveUrgency('Todos');
    setActivePotentialRange('Todos');
    setActiveCountry('Todos');
    setActiveContinent('Todos');
    setFiltersApplied(false);
    setFilteredProblems(filterBySector(problems, activeSector, activeSubcategory, searchQuery));
    setFiltersVisible(false);
  };

  // Comprobar si viene de creación de perfil
  useEffect(() => {
    if (route.params?.profileCreated) {
      setSnackbarMessage('¡Perfil creado con éxito! Ahora puedes aprovechar todas las funcionalidades de Nexwise.');
      setSnackbarVisible(true);
      // Limpiamos los parámetros para que no se muestre el mensaje en futuras navegaciones
      navigation.setParams({ profileCreated: undefined, profileData: undefined });
    }
  }, [route.params]);

  // Función para manejar la navegación al perfil
  const handleProfileNavigation = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        // Si ya existe un perfil, navegamos a la pantalla de perfil
        navigation.navigate(ROUTES.PROFILE);
      } else {
        // Si no existe un perfil, navegamos a la pantalla de creación de perfil
        navigation.navigate(ROUTES.CREATE_PROFILE);
      }
    } catch (error) {
      console.error('Error al verificar el perfil:', error);
      // En caso de error, navegamos a la pantalla de creación de perfil por defecto
      navigation.navigate(ROUTES.CREATE_PROFILE);
    }
  };

  // Función para navegar a la pantalla de notificaciones
  const navigateToNotifications = () => {
    navigation.navigate(ROUTES.NOTIFICATIONS);
  };

  // Función para navegar a las suscripciones
  const navigateToSubscriptions = () => {
    navigation.navigate(ROUTES.SUBSCRIPTIONS);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.navigate('Onboarding')} />
        <Appbar.Content title="Observaciones" />
        <Appbar.Action icon="eye" onPress={() => navigation.navigate('Dashboard')} />
        <Appbar.Action icon="bell" onPress={navigateToNotifications} />
        <Appbar.Action icon="lightbulb" onPress={() => navigation.navigate('BusinessIdeas')} />
        <Appbar.Action icon="crown" color="#FFD700" onPress={navigateToSubscriptions} />
        <Appbar.Action icon="account" onPress={handleProfileNavigation} />
      </Appbar.Header>

      <View style={styles.content}>
        <Button 
          mode="contained" 
          icon="plus" 
          onPress={() => navigation.navigate('CreateProblem')}
          style={styles.createButton}
        >
          Nueva Observación
        </Button>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar problemas..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={[styles.searchBar, { flex: 1 }]}
          />
          <Button 
            icon="filter-variant" 
            mode="outlined" 
            onPress={() => setFiltersVisible(!filtersVisible)} 
            style={styles.filterButton}
          >
            Filtros
          </Button>
        </View>
        
        {/* Panel de filtros avanzados */}
        {filtersVisible && (
          <View style={styles.filtersOverlay}>
            <Surface style={styles.filtersPanel}>
              <View style={styles.filtersPanelHeader}>
                <Text style={styles.filtersPanelTitle}>Filtros Avanzados</Text>
              </View>
              
              <ScrollView style={styles.filtersPanelScrollView}>
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Impacto:</Text>
                  <ScrollView horizontal style={styles.filterOptionsScroll} showsHorizontalScrollIndicator={false}>
                    {IMPACT_OPTIONS.map((impact) => (
                      <Chip
                        key={impact}
                        selected={activeImpact === impact}
                        onPress={() => setActiveImpact(impact)}
                        style={styles.filterChip}
                        textStyle={activeImpact === impact 
                          ? {color: 'white', ...styles.chipText}
                          : styles.chipText}
                        selectedColor={activeImpact === impact ? 'white' : undefined}
                        mode={activeImpact === impact ? 'flat' : 'outlined'}
                      >
                        {impact}
                      </Chip>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Urgencia:</Text>
                  <ScrollView horizontal style={styles.filterOptionsScroll} showsHorizontalScrollIndicator={false}>
                    {URGENCY_OPTIONS.map((urgency) => (
                      <Chip
                        key={urgency}
                        selected={activeUrgency === urgency}
                        onPress={() => setActiveUrgency(urgency)}
                        style={styles.filterChip}
                        textStyle={activeUrgency === urgency 
                          ? {color: 'white', ...styles.chipText}
                          : styles.chipText}
                        selectedColor={activeUrgency === urgency ? 'white' : undefined}
                        mode={activeUrgency === urgency ? 'flat' : 'outlined'}
                      >
                        {urgency}
                      </Chip>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Potencial:</Text>
                  <ScrollView horizontal style={styles.filterOptionsScroll} showsHorizontalScrollIndicator={false}>
                    {POTENTIAL_RANGES.map((range) => (
                      <Chip
                        key={range}
                        selected={activePotentialRange === range}
                        onPress={() => setActivePotentialRange(range)}
                        style={styles.filterChip}
                        textStyle={activePotentialRange === range 
                          ? {color: 'white', ...styles.chipText}
                          : styles.chipText}
                        selectedColor={activePotentialRange === range ? 'white' : undefined}
                        mode={activePotentialRange === range ? 'flat' : 'outlined'}
                      >
                        {range}
                      </Chip>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Continente:</Text>
                  <ScrollView horizontal style={styles.filterOptionsScroll} showsHorizontalScrollIndicator={false}>
                    {CONTINENTS.map((continent) => (
                      <Chip
                        key={continent}
                        selected={activeContinent === continent}
                        onPress={() => setActiveContinent(continent)}
                        style={styles.filterChip}
                        textStyle={activeContinent === continent 
                          ? {color: 'white', ...styles.chipText}
                          : styles.chipText}
                        selectedColor={activeContinent === continent ? 'white' : undefined}
                        mode={activeContinent === continent ? 'flat' : 'outlined'}
                      >
                        {continent}
                      </Chip>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>País:</Text>
                  <ScrollView horizontal style={styles.filterOptionsScroll} showsHorizontalScrollIndicator={false}>
                    {COUNTRIES.map((country) => (
                      <Chip
                        key={country}
                        selected={activeCountry === country}
                        onPress={() => setActiveCountry(country)}
                        style={styles.filterChip}
                        textStyle={activeCountry === country 
                          ? {color: 'white', ...styles.chipText}
                          : styles.chipText}
                        selectedColor={activeCountry === country ? 'white' : undefined}
                        mode={activeCountry === country ? 'flat' : 'outlined'}
                      >
                        {country}
                      </Chip>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
              
              <View style={styles.filterActionsContainer}>
                <Button mode="outlined" onPress={clearAllFilters} style={styles.filterActionButton}>
                  Limpiar Filtros
                </Button>
                <Button mode="contained" onPress={applyAllFilters} style={styles.filterActionButton}>
                  Aplicar Filtros
                </Button>
              </View>
            </Surface>
          </View>
        )}
        
        {/* Chips para sectores populares (visible solo cuando el menú no está desplegado) */}
        {!sectorMenuVisible && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularSectorsScroll}>
            <View style={styles.filterChips}>
              <Chip 
                key="todos"
                style={[styles.filterChip, activeSector === 'Todos' && styles.activeChip]} 
                textStyle={activeSector === 'Todos' 
                  ? {color: 'white', ...styles.chipText}
                  : styles.chipText}
                onPress={() => {
                  setActiveSector('Todos');
                  setActiveSubcategory('Todas');
                  setSubcategoriesVisible(false);
                  setActiveImpact('Todos');
                  setActiveUrgency('Todos');
                  setActivePotentialRange('Todos');
                  setActiveCountry('Todos');
                  setActiveContinent('Todos');
                  setFiltersApplied(false);
                  setFilteredProblems(filterBySector(problems, 'Todos', 'Todas', searchQuery));
                }}
              >
                Todos
              </Chip>
              {['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Innovación', 'Sostenibilidad'].map(sector => (
                <Chip 
                  key={sector}
                  style={[styles.filterChip, activeSector === sector && styles.activeChip]} 
                  textStyle={activeSector === sector 
                    ? {color: 'white', ...styles.chipText}
                    : styles.chipText}
                  onPress={() => {
                    setActiveSector(sector);
                    setActiveSubcategory('Todas');
                    setSubcategoriesVisible(true);
                    setActiveImpact('Todos');
                    setActiveUrgency('Todos');
                    setActivePotentialRange('Todos');
                    setActiveCountry('Todos');
                    setActiveContinent('Todos');
                    setFiltersApplied(false);
                    setFilteredProblems(filterBySector(problems, sector, 'Todas', searchQuery));
                  }}
                >
                  {sector}
                </Chip>
              ))}
            </View>
          </ScrollView>
        )}
        
        {/* Selector de subcategorías - visible solo cuando un sector específico está seleccionado */}
        {subcategoriesVisible && activeSector !== 'Todos' && (
          <View style={styles.subcategoriesContainer}>
            <Text style={styles.subcategoriesTitle}>Subcategorías de {activeSector}:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subcategoriesScroll}>
              <View style={styles.filterChips}>
                {sectorSubcategories[activeSector]?.map((subcategory) => (
                  <Chip 
                    key={subcategory}
                    style={[styles.filterChip, activeSubcategory === subcategory && styles.activeChip]}
                    textStyle={activeSubcategory === subcategory 
                      ? {color: 'white', ...styles.chipText}
                      : styles.chipText}
                    onPress={() => {
                      setActiveSubcategory(subcategory);
                      // Resetear los filtros adicionales
                      setActiveImpact('Todos');
                      setActiveUrgency('Todos');
                      setActivePotentialRange('Todos');
                      setActiveCountry('Todos');
                      setActiveContinent('Todos');
                      setFiltersApplied(false);
                      setFilteredProblems(filterBySector(problems, activeSector, subcategory, searchQuery));
                    }}
                  >
                    {subcategory}
                  </Chip>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {filteredProblems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No se encontraron observaciones con los filtros actuales</Text>
            <Button onPress={() => {
              setSearchQuery('');
              setActiveSector('Todos');
              setFilteredProblems(MOCK_PROBLEMS);
            }}>
              Limpiar filtros
            </Button>
          </View>
        ) : (
          <FlatList
            data={filteredProblems}
            renderItem={renderProblemItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.problemsList}
          />
        )}

        {/* Portal para el diálogo de análisis */}
        <Portal>
          <Dialog visible={analysisDialogVisible} onDismiss={() => setAnalysisDialogVisible(false)} style={styles.analysisDialog}>
            <Dialog.Title>Análisis Avanzado de IA</Dialog.Title>
            <Dialog.ScrollArea style={styles.dialogScrollArea}>
              <ScrollView>
                {analysisLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Realizando análisis profundo...</Text>
                    <Text style={styles.loadingSubtext}>La IA está procesando múltiples fuentes de datos y generando un análisis detallado de la observación.</Text>
                  </View>
                ) : selectedProblem && (
                  <View style={styles.analysisContainer}>
                    {/* Resumen ejecutivo */}
                    <Surface style={styles.analysisSurface}>
                      <Text style={styles.surfaceTitle}>Resumen Ejecutivo</Text>
                      <Text style={styles.analysisText}>
                        La observación "{selectedProblem.title}" representa una oportunidad 
                        {problemMarketData?.adjustedScore > 80 ? ' excepcional ' : 
                         problemMarketData?.adjustedScore > 60 ? ' significativa ' : ' moderada '}
                        en el sector {selectedProblem.sector}.
                      </Text>
                    </Surface>

                    {/* Métricas clave */}
                    <Surface style={styles.analysisSurface}>
                      <Text style={styles.surfaceTitle}>Métricas Clave</Text>
                      <View style={styles.metricsGrid}>
                        <View style={styles.metricBox}>
                          <Text style={styles.metricTitle}>Potencial Ajustado</Text>
                          <Text style={styles.metricValue}>{problemMarketData?.adjustedScore}%</Text>
                        </View>
                        <View style={styles.metricBox}>
                          <Text style={styles.metricTitle}>Crecimiento Anual</Text>
                          <Text style={styles.metricValue}>{problemMarketData?.marketData?.marketGrowth}%</Text>
                        </View>
                        <View style={styles.metricBox}>
                          <Text style={styles.metricTitle}>Volumen de Mercado</Text>
                          <Text style={styles.metricValue}>{problemMarketData?.marketData?.investmentVolume}</Text>
                        </View>
                      </View>
                    </Surface>

                    {/* Impacto Social y Económico */}
                    <Surface style={styles.analysisSurface}>
                      <Text style={styles.surfaceTitle}>Impacto Social y Económico</Text>
                      <View style={styles.impactGrid}>
                        <View style={styles.impactItem}>
                          <Text style={styles.impactLabel}>Beneficiarios Directos</Text>
                          <Text style={styles.impactValue}>
                            {problemMarketData?.socialImpact?.directBeneficiaries?.toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.impactItem}>
                          <Text style={styles.impactLabel}>Empleos Generados</Text>
                          <Text style={styles.impactValue}>
                            {problemMarketData?.socialImpact?.jobsCreated?.toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.impactItem}>
                          <Text style={styles.impactLabel}>Crecimiento Económico</Text>
                          <Text style={styles.impactValue}>
                            {problemMarketData?.socialImpact?.economicGrowth}%
                          </Text>
                        </View>
                        <View style={styles.impactItem}>
                          <Text style={styles.impactLabel}>ROI Social</Text>
                          <Text style={styles.impactValue}>
                            {problemMarketData?.socialImpact?.socialReturnOnInvestment}x
                          </Text>
                        </View>
                      </View>
                    </Surface>

                    {/* Viabilidad Técnica */}
                    <Surface style={styles.analysisSurface}>
                      <Text style={styles.surfaceTitle}>Viabilidad Técnica</Text>
                      <View style={styles.feasibilityContainer}>
                        <View style={styles.feasibilityMetric}>
                          <Text style={styles.feasibilityLabel}>Tiempo de Implementación</Text>
                          <Text style={styles.feasibilityValue}>
                            {problemMarketData?.technicalFeasibility?.implementationTime}
                          </Text>
                        </View>
                        <View style={styles.feasibilityMetric}>
                          <Text style={styles.feasibilityLabel}>Complejidad Técnica</Text>
                          <View style={styles.progressBar}>
                            <View 
                              style={[
                                styles.progressFill, 
                                { 
                                  width: `${problemMarketData?.technicalFeasibility?.technicalComplexity}%`,
                                  backgroundColor: problemMarketData?.technicalFeasibility?.technicalComplexity > 70 ? '#FF5252' : '#4CAF50'
                                }
                              ]} 
                            />
                            <Text style={styles.progressText}>
                              {problemMarketData?.technicalFeasibility?.technicalComplexity}%
                            </Text>
                          </View>
                        </View>
                        <View style={styles.feasibilityMetric}>
                          <Text style={styles.feasibilityLabel}>Potencial de Escalabilidad</Text>
                          <View style={styles.progressBar}>
                            <View 
                              style={[
                                styles.progressFill, 
                                { 
                                  width: `${problemMarketData?.technicalFeasibility?.scalabilityPotential}%`,
                                  backgroundColor: '#2196F3'
                                }
                              ]} 
                            />
                            <Text style={styles.progressText}>
                              {problemMarketData?.technicalFeasibility?.scalabilityPotential}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Surface>

                    {/* Análisis de Riesgos */}
                    <Surface style={styles.analysisSurface}>
                      <Text style={styles.surfaceTitle}>Análisis de Riesgos</Text>
                      {problemMarketData?.riskAnalysis?.marketRisks.map((risk, index) => (
                        <View key={index} style={styles.riskItem}>
                          <Text style={styles.riskName}>{risk.risk}</Text>
                          <View style={styles.riskMetrics}>
                            <View style={styles.riskMetric}>
                              <Text style={styles.riskLabel}>Probabilidad</Text>
                              <View style={styles.riskBar}>
                                <View 
                                  style={[
                                    styles.riskFill, 
                                    { 
                                      width: `${risk.probability}%`,
                                      backgroundColor: risk.probability > 60 ? '#FF5252' : '#FFC107'
                                    }
                                  ]} 
                                />
                                <Text style={styles.riskPercentage}>{risk.probability}%</Text>
                              </View>
                            </View>
                            <View style={styles.riskMetric}>
                              <Text style={styles.riskLabel}>Impacto</Text>
                              <View style={styles.riskBar}>
                                <View 
                                  style={[
                                    styles.riskFill, 
                                    { 
                                      width: `${risk.impact}%`,
                                      backgroundColor: risk.impact > 60 ? '#FF5252' : '#FFC107'
                                    }
                                  ]} 
                                />
                                <Text style={styles.riskPercentage}>{risk.impact}%</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </Surface>

                    {/* Oportunidades de Innovación */}
                    <Surface style={styles.analysisSurface}>
                      <Text style={styles.surfaceTitle}>Oportunidades de Innovación</Text>
                      {problemMarketData?.innovationOpportunities.map((opportunity, index) => (
                        <View key={index} style={styles.opportunityItem}>
                          <View style={styles.opportunityHeader}>
                            <Text style={styles.opportunityArea}>{opportunity.area}</Text>
                            <Text style={styles.opportunityTimeToMarket}>
                              {opportunity.timeToMarket}
                            </Text>
                          </View>
                          <Text style={styles.opportunityDescription}>
                            {opportunity.description}
                          </Text>
                          <View style={styles.opportunityImpact}>
                            <Text style={styles.opportunityImpactLabel}>Impacto Potencial</Text>
                            <View style={styles.progressBar}>
                              <View 
                                style={[
                                  styles.progressFill, 
                                  { 
                                    width: `${opportunity.potentialImpact}%`,
                                    backgroundColor: '#4CAF50'
                                  }
                                ]} 
                              />
                              <Text style={styles.progressText}>
                                {opportunity.potentialImpact}%
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </Surface>

                    {/* Tendencias del Mercado */}
                    <Surface style={styles.analysisSurface}>
                      <Text style={styles.surfaceTitle}>Tendencias del Mercado</Text>
                      {problemMarketData?.marketTrends.map((trend, index) => (
                        <View key={index} style={styles.trendItem}>
                          <View style={styles.trendHeader}>
                            <Text style={styles.trendName}>{trend.trend}</Text>
                            <Text style={styles.trendTimeframe}>{trend.timeframe}</Text>
                          </View>
                          <View style={styles.trendImpact}>
                            <Text style={styles.trendImpactLabel}>Impacto en el Sector</Text>
                            <View style={styles.progressBar}>
                              <View 
                                style={[
                                  styles.progressFill, 
                                  { 
                                    width: `${trend.impact}%`,
                                    backgroundColor: '#2196F3'
                                  }
                                ]} 
                              />
                              <Text style={styles.progressText}>
                                {trend.impact}%
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </Surface>
                  </View>
                )}
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setAnalysisDialogVisible(false)}>Cerrar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  logoMini: {
    width: 30,
    height: 30,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 5,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  sectorSelectorContainer: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 100,
  },
  sectorSelectorButton: {
    width: '100%',
    borderColor: '#2196F3',
  },
  sectorMenuContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 4,
    maxHeight: 300,
    zIndex: 101,
  },
  sectorMenu: {
    paddingVertical: 8,
  },
  sectorMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeSectorMenuItem: {
    backgroundColor: '#E3F2FD',
  },
  sectorMenuItemText: {
    fontSize: 16,
  },
  activeSectorMenuItemText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  popularSectorsScroll: {
    marginBottom: 16,
  },
  filterChips: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 4,
    paddingHorizontal: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 10,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 44,            // Aumentado de 40 a 44
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChip: {
    backgroundColor: '#673AB7',
    borderWidth: 0,
  },
  moreChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    lineHeight: 20,
    fontSize: 14,
    textAlignVertical: 'center',
  },
  sectorChip: {
    backgroundColor: '#E3F2FD',
  },
  tag: {
    backgroundColor: '#F0F0F0',
    marginBottom: 4,
    height: 24,
    width: 'auto',
    alignSelf: 'flex-end',
    maxWidth: 120,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dialogSector: {
    fontStyle: 'italic',
    marginBottom: 12,
    color: '#666',
  },
  dialogDescription: {
    marginBottom: 16,
  },
  dialogMetrics: {
    marginBottom: 16,
  },
  dialogTags: {
    fontStyle: 'italic',
  },
  dialogDate: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  analysisDialog: {
    width: '95%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  dialogScrollArea: {
    maxHeight: '80%',
  },
  analysisContainer: {
    padding: 16,
  },
  analysisSurface: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  surfaceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricBox: {
    width: '30%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  impactItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  feasibilityContainer: {
    marginTop: 8,
  },
  feasibilityMetric: {
    marginBottom: 16,
  },
  feasibilityLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  feasibilityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressBar: {
    height: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  riskItem: {
    marginBottom: 16,
  },
  riskName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  riskMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskMetric: {
    flex: 1,
    marginHorizontal: 4,
  },
  riskLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  riskBar: {
    height: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  riskFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    borderRadius: 10,
  },
  riskPercentage: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  opportunityItem: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  opportunityArea: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  opportunityTimeToMarket: {
    fontSize: 12,
    color: '#666',
  },
  opportunityDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  opportunityImpact: {
    marginTop: 8,
  },
  opportunityImpactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  trendItem: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendTimeframe: {
    fontSize: 12,
    color: '#666',
  },
  trendImpact: {
    marginTop: 8,
  },
  trendImpactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  companiesContainer: {
    marginTop: 16,
  },
  companyCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
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
    color: '#1E293B',
  },
  companyBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  companyInnovation: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '500',
  },
  companyDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  companyFinancials: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  financialLabel: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  financialValue: {
    fontWeight: '500',
    color: '#334155',
  },
  urgencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  urgencyTrend: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  urgencyTimeToMarket: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
  },
  urgencyDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  urgencyDetail: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  recommendationsList: {
    marginTop: 8,
  },
  recommendationItem: {
    marginBottom: 16,
    lineHeight: 20,
  },
  subcategoriesContainer: {
    marginBottom: 16,
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subcategoriesScroll: {
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    marginLeft: 16,
  },
  filtersPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    elevation: 4,
    zIndex: 10,
    maxHeight: '80%', // Limitar la altura máxima para permitir scroll
  },
  filtersPanelScrollView: {
    flex: 1,
    marginBottom: 16,
  },
  filtersPanelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterOptionsScroll: {
    marginBottom: 8,
  },
  filterActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  filterActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  descriptionText: {
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  problemCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  sectorContainer: {
    flexShrink: 0,
  },
  sectorChip: {
    backgroundColor: '#E3F2FD',
  },
  problemDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  tagText: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  impactChip: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactHigh: {
    backgroundColor: '#FF5252',
  },
  impactMedium: {
    backgroundColor: '#FFC107',
  },
  impactVeryHigh: {
    backgroundColor: '#2196F3',
  },
  urgencyChip: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyLow: {
    backgroundColor: '#4CAF50',
  },
  urgencyMedium: {
    backgroundColor: '#FFC107',
  },
  urgencyHigh: {
    backgroundColor: '#F44336',
  },
  potentialChip: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  potentialLow: {
    backgroundColor: '#FF5252',
  },
  potentialMedium: {
    backgroundColor: '#FFC107',
  },
  potentialHigh: {
    backgroundColor: '#4CAF50',
  },
  potentialVeryLow: {
    backgroundColor: '#FF5252',
  },
  potentialVeryHigh: {
    backgroundColor: '#2196F3',
  },
  moreTagsChip: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-end',
  },
  problemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statsAndTagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  resetFab: {
    position: 'absolute',
    margin: 16,
    left: 0,  // Colocarlo en la parte izquierda
    bottom: 0,
    backgroundColor: '#FF9800', // Color diferente para distinguirlo
  },
  filtersPanelContent: {
    paddingBottom: 8, // Reducir el padding para no duplicarlo con el del contenedor
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  classificationSurface: {
    backgroundColor: '#FF5252',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  classificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  classificationJustification: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  classificationFactibilidad: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  filtersOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 16,
  },
  filtersPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    maxHeight: '90%',
    elevation: 5,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  filtersPanelHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  filtersPanelScrollView: {
    flexGrow: 1,
    padding: 16,
  },
  filterActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 5,
    right: 85,
    zIndex: 10,
  },
  badge: {
    backgroundColor: '#F44336',
  },
  appBar: {
    backgroundColor: '#fff',
    elevation: 4,
  },
  searchbar: {
    marginBottom: 16,
    elevation: 2,
  },
  createButton: {
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
}); 