/**
 * Servicio para análisis de ideas de negocio
 * Este módulo puede expandirse para conectarse a APIs externas de IA en el futuro
 */

import { analyzeWithAI, hasApiKey, analyzeObservationWithAI } from './ai-service';

// Base de conocimiento para ponderación de sectores
const SECTOR_WEIGHTS = {
  'Tecnología': { score: 12, competition: 'Alta', notes: 'Alta demanda, rápida evolución' },
  'Salud': { score: 10, competition: 'Media', notes: 'Crecimiento sostenido, alta barrera de entrada' },
  'Sostenibilidad': { score: 8, competition: 'Media-baja', notes: 'Sector emergente con potencial' },
  'Educación': { score: 6, competition: 'Media', notes: 'Transformación digital acelerada' },
  'Finanzas': { score: 5, competition: 'Alta', notes: 'Regulado, alta competencia' },
  'Agricultura': { score: 4, competition: 'Baja', notes: 'Innovación tecnológica emergente' },
  'Energía': { score: 7, competition: 'Media-alta', notes: 'Transición energética en curso' },
  'Transporte': { score: 3, competition: 'Media', notes: 'Evolución hacia movilidad sostenible' },
  'Turismo': { score: 2, competition: 'Alta', notes: 'Recuperación post-pandemia' },
  'Otros': { score: 0, competition: 'Variable', notes: 'Depende del nicho específico' }
};

// Palabras clave que indican innovación o disrupción
const INNOVATION_KEYWORDS = [
  'innovador', 'revolucionario', 'disruptivo', 'único', 'patentado', 
  'ia', 'inteligencia artificial', 'automatizado', 'sostenible', 
  'blockchain', 'machine learning', 'verde', 'circular'
];

// Palabras clave que indican definición de problema
const PROBLEM_KEYWORDS = [
  'problema', 'solución', 'necesidad', 'mejora', 'optimiza', 'reduce',
  'elimina', 'incrementa', 'facilita', 'transforma', 'eficiencia'
];

/**
 * Calcula el potencial de mercado basado en datos actualizados del sector
 * 
 * @param {string} sector - Sector de la idea de negocio
 * @param {number} score - Puntuación base de la idea
 * @returns {Object} Análisis de mercado con puntuación ajustada
 */
export const calculateMarketPotential = (sector, score) => {
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
    'Sostenibilidad': {
      companiesCount: 7200,
      marketGrowth: 12.8,
      investmentVolume: '520B',
      avgCompanyValue: '1.8B',
      saturationIndex: 0.45
    },
    'Agricultura': {
      companiesCount: 6300,
      marketGrowth: 6.2,
      investmentVolume: '280B',
      avgCompanyValue: '1.2B',
      saturationIndex: 0.42
    },
    'Energía': {
      companiesCount: 5800,
      marketGrowth: 9.3,
      investmentVolume: '650B',
      avgCompanyValue: '3.1B',
      saturationIndex: 0.58
    },
    'Transporte': {
      companiesCount: 9500,
      marketGrowth: 7.2,
      investmentVolume: '680B',
      avgCompanyValue: '2.4B',
      saturationIndex: 0.65
    },
    'Turismo': {
      companiesCount: 4200,
      marketGrowth: 9.5,
      investmentVolume: '320B',
      avgCompanyValue: '0.9B',
      saturationIndex: 0.52
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

/**
 * Evalúa la urgencia de implementación basada en tendencias actuales
 * 
 * @param {string} sector - Sector de la idea de negocio
 * @param {string} impact - Impacto estimado de la idea
 * @returns {Object} Análisis de urgencia con datos relevantes
 */
export const evaluateUrgency = (sector, impact) => {
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
    'Sostenibilidad': {
      trend: 'Acelerada',
      growthRate: '+14% anual',
      disruptionRisk: 'Medio-Alto',
      timeToMarket: '6-14 meses'
    },
    'Agricultura': {
      trend: 'Moderada',
      growthRate: '+6% anual',
      disruptionRisk: 'Bajo',
      timeToMarket: '12-24 meses'
    },
    'Energía': {
      trend: 'Creciente',
      growthRate: '+10% anual',
      disruptionRisk: 'Medio',
      timeToMarket: '12-20 meses'
    },
    'Transporte': {
      trend: 'Moderada',
      growthRate: '+7% anual',
      disruptionRisk: 'Medio',
      timeToMarket: '10-18 meses'
    },
    'Turismo': {
      trend: 'Fluctuante',
      growthRate: '+8% anual',
      disruptionRisk: 'Medio-Bajo',
      timeToMarket: '8-16 meses'
    }
  };
  
  // Tendencias predeterminadas si el sector no está en la lista
  const defaultTrend = {
    trend: 'Moderada',
    growthRate: '+7% anual',
    disruptionRisk: 'Medio',
    timeToMarket: '9-15 meses'
  };
  
  // Ajustar según impacto
  const baseData = urgencyTrends[sector] || defaultTrend;
  let adjustedData = {...baseData};
  
  // Ajustar disruptionRisk según el impacto
  if (impact === 'Alto') {
    adjustedData.disruptionRisk = adjustedData.disruptionRisk === 'Alto' ? 'Muy Alto' : 'Alto';
    adjustedData.timeToMarket = '4-10 meses'; // Más rápido para impacto alto
  } else if (impact === 'Bajo') {
    adjustedData.disruptionRisk = adjustedData.disruptionRisk === 'Bajo' ? 'Muy Bajo' : 'Bajo';
    adjustedData.timeToMarket = '12-24 meses'; // Más lento para impacto bajo
  }
  
  return adjustedData;
};

/**
 * Obtiene información detallada sobre empresas líderes en el sector
 * 
 * @param {string} sector - Sector de la idea de negocio
 * @returns {Array} Lista de empresas con detalles relevantes
 */
export const getDetailedCompanies = (sector) => {
  // Base de datos simulada de empresas líderes por sector
  const companiesDatabase = {
    'Tecnología': [
      {
        name: 'Microsoft',
        description: 'Líder en software, servicios en la nube y dispositivos',
        founded: 1975,
        hq: 'Redmond, Washington, EE.UU.',
        marketCap: '$2.5T',
        employees: '180,000+',
        revenue: '$198B (2022)',
        keyProducts: 'Windows, Office, Azure, Teams',
        innovationIndex: 91
      },
      {
        name: 'Google (Alphabet)',
        description: 'Especialista en búsquedas, publicidad, software y hardware',
        founded: 1998,
        hq: 'Mountain View, California, EE.UU.',
        marketCap: '$1.7T',
        employees: '156,000+',
        revenue: '$282B (2022)',
        keyProducts: 'Google Search, Android, Chrome, YouTube',
        innovationIndex: 94
      },
      {
        name: 'Amazon',
        description: 'Líder en comercio electrónico y servicios en la nube',
        founded: 1994,
        hq: 'Seattle, Washington, EE.UU.',
        marketCap: '$1.3T',
        employees: '1,500,000+',
        revenue: '$513B (2022)',
        keyProducts: 'Amazon.com, AWS, Alexa, Prime',
        innovationIndex: 89
      }
    ],
    // Más sectores pueden ser añadidos según sea necesario
    'defaultCompanies': [
      {
        name: 'Líder del Sector',
        description: 'Empresa líder en el sector con amplia experiencia',
        founded: 2000,
        hq: 'Ciudad Global',
        marketCap: '$50B+',
        employees: '10,000+',
        revenue: '$15B (2022)',
        keyProducts: 'Productos y servicios innovadores',
        innovationIndex: 85
      },
      {
        name: 'Innovador Emergente',
        description: 'Empresa disruptiva con enfoque en tecnologías nuevas',
        founded: 2012,
        hq: 'Hub Tecnológico',
        marketCap: '$15B',
        employees: '3,000+',
        revenue: '$5B (2022)',
        keyProducts: 'Soluciones digitales de vanguardia',
        innovationIndex: 90
      },
      {
        name: 'Competidor Establecido',
        description: 'Empresa con trayectoria y presencia consolidada',
        founded: 1990,
        hq: 'Centro Corporativo',
        marketCap: '$30B',
        employees: '25,000+',
        revenue: '$12B (2022)',
        keyProducts: 'Portafolio diversificado de soluciones',
        innovationIndex: 78
      }
    ]
  };
  
  return companiesDatabase[sector] || companiesDatabase.defaultCompanies;
};

/**
 * Analiza una idea de negocio utilizando Google AI.
 * 
 * @param {Object} ideaData - Datos de la idea de negocio
 * @param {string} ideaData.title - Título de la idea
 * @param {string} ideaData.description - Descripción de la idea
 * @param {string} ideaData.sector - Sector principal
 * @param {Array<string>} ideaData.tags - Etiquetas asociadas
 * @returns {Object} Análisis completo de la idea
 */
export const analyzeBusinessIdea = async (ideaData) => {
  try {
    console.log('Analizando idea con Google AI...');
    const aiAnalysis = await analyzeWithAI(ideaData);
    console.log('Análisis con Google AI completado exitosamente');
    return {
      ...aiAnalysis,
      analyzedBy: 'Google AI'
    };
  } catch (error) {
    console.error('Error en analyzeBusinessIdea:', error);
    throw error;
  }
};

/**
 * Función para realizar análisis local (implementación actual)
 * Extraída de la función original para permitir fallback
 */
const performLocalAnalysis = (ideaData) => {
  const { title, description, sector, tags } = ideaData;
  
  // Base score
  let potentialScore = 75;
  let marketSize = 'Mediano';
  let competition = 'Media';
  let recommendation = '';
  const factores = [];
  
  // 1. Analizar según el sector
  if (SECTOR_WEIGHTS[sector]) {
    potentialScore += SECTOR_WEIGHTS[sector].score;
    competition = SECTOR_WEIGHTS[sector].competition;
    
    if (SECTOR_WEIGHTS[sector].score > 5) {
      factores.push(`El sector "${sector}" tiene alta demanda actualmente`);
    }
  }
  
  // 2. Analizar el título y la descripción
  const contentText = (title + ' ' + description).toLowerCase();
  
  // 2.1 Buscar términos de innovación
  let innovationTermsCount = 0;
  INNOVATION_KEYWORDS.forEach(keyword => {
    if (contentText.includes(keyword)) {
      innovationTermsCount++;
    }
  });
  
  if (innovationTermsCount > 0) {
    // Bonificación escalada según cantidad de términos de innovación (max +10)
    const innovationBonus = Math.min(innovationTermsCount * 2, 10);
    potentialScore += innovationBonus;
    
    if (innovationBonus >= 6) {
      factores.push('Utiliza múltiples conceptos innovadores o disruptivos');
    } else if (innovationBonus > 0) {
      factores.push('Incorpora elementos de innovación');
    }
  }
  
  // 2.2 Analizar si hay una definición clara del problema
  let problemStatementScore = 0;
  PROBLEM_KEYWORDS.forEach(keyword => {
    if (contentText.includes(keyword)) {
      problemStatementScore++;
    }
  });
  
  if (problemStatementScore > 2) {
    potentialScore += 5;
    factores.push('Define claramente el problema que resuelve');
  } else if (problemStatementScore > 0) {
    potentialScore += 2;
    factores.push('Menciona el problema, pero podría definirse mejor');
  }
  
  // 3. Analizar la especificidad a través del título
  if (title.length > 50) {
    potentialScore += 3;
    factores.push('Título detallado que especifica bien el concepto');
  }
  
  // 4. Analizar longitud y detalle de la descripción
  if (description.length > 300) {
    potentialScore += 5;
    factores.push('Descripción muy completa que facilita la evaluación');
  } else if (description.length > 200) {
    potentialScore += 3;
    factores.push('Descripción detallada que facilita la comprensión del concepto');
  } else if (description.length < 100) {
    potentialScore -= 3;
    factores.push('Descripción breve que limita el análisis completo');
  }
  
  // 5. Analizar etiquetas
  if (tags.length >= 4) {
    potentialScore += 4;
    factores.push('Excelente categorización con múltiples etiquetas relevantes');
  } else if (tags.length >= 3) {
    potentialScore += 2;
    factores.push('Buena categorización con etiquetas relevantes');
  }
  
  // Asegurar que el puntaje esté entre 65-98
  potentialScore = Math.min(98, Math.max(65, Math.round(potentialScore)));
  
  // Calcular análisis de mercado y urgencia
  const marketAnalysis = calculateMarketPotential(sector, potentialScore);
  const urgencyAnalysis = evaluateUrgency(sector, 'Medio'); // Asumimos impacto medio por defecto
  const detailedCompanies = getDetailedCompanies(sector);
  
  // Ajustar score final con el análisis de mercado
  potentialScore = marketAnalysis.adjustedScore;
  
  // Determinar tamaño de mercado según puntaje
  if (potentialScore > 90) {
    marketSize = 'Muy grande';
  } else if (potentialScore > 80) {
    marketSize = 'Grande';
  } else if (potentialScore > 70) {
    marketSize = 'Mediano';
  } else {
    marketSize = 'Pequeño';
  }
  
  // Generar recomendación basada en el análisis
  if (potentialScore > 90) {
    recommendation = 'Inversión prioritaria con alto potencial de retorno. Esta idea representa una oportunidad excepcional en el mercado actual.';
  } else if (potentialScore > 85) {
    recommendation = 'Desarrollo recomendado con enfoque diferenciador. El mercado es receptivo a esta propuesta con implementación oportuna.';
  } else if (potentialScore > 80) {
    recommendation = 'Oportunidad emergente con buen potencial. Se recomienda validación adicional del modelo de negocio.';
  } else if (potentialScore > 75) {
    recommendation = 'Explorar nichos específicos dentro del sector para maximizar el impacto y reducir la competencia directa.';
  } else {
    recommendation = 'Potencial moderado que requiere mayor diferenciación o enfoque más específico para destacar en el mercado.';
  }
  
  // Crear objeto de análisis completo
  return {
    potentialScore,
    marketSize,
    competition,
    recommendation,
    factores,
    marketAnalysis,
    urgencyAnalysis,
    competitorsData: detailedCompanies,
    analyzedBy: 'Análisis local',
    timestamp: new Date().toISOString()
  };
};

/**
 * Guarda retroalimentación del usuario sobre un análisis
 * 
 * @param {Object} feedbackData - Datos de retroalimentación
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const saveAnalysisFeedback = async (feedbackData) => {
  try {
    // En una implementación real, enviarías estos datos a un backend
    console.log('Feedback recibido:', feedbackData);
    return true;
  } catch (error) {
    console.error('Error al guardar feedback:', error);
    return false;
  }
};

/**
 * Analiza una observación/problema utilizando Google AI.
 * 
 * @param {Object} observationData - Datos de la observación
 * @param {string} observationData.title - Título de la observación
 * @param {string} observationData.description - Descripción detallada
 * @param {string} [observationData.context] - Contexto en el que se observó
 * @param {string} [observationData.sector] - Sector relacionado
 * @param {Array<string>} [observationData.tags] - Etiquetas asociadas
 * @returns {Object} Análisis completo de la observación
 */
export const analyzeObservation = async (observationData) => {
  try {
    console.log('Analizando observación con Google AI...');
    const aiAnalysis = await analyzeObservationWithAI(observationData);
    console.log('Análisis de observación con Google AI completado exitosamente');
    
    return {
      ...aiAnalysis,
      analyzedBy: 'Google AI'
    };
  } catch (error) {
    console.error('Error en analyzeObservation:', error);
    console.log('Realizando análisis local como fallback...');
    
    // Si falla la API, caemos en un análisis local básico
    return performLocalObservationAnalysis(observationData);
  }
};

/**
 * Realiza un análisis local básico de una observación (para usar como fallback)
 * 
 * @param {Object} observationData - Datos de la observación
 * @returns {Object} Análisis básico de la observación
 */
const performLocalObservationAnalysis = (observationData) => {
  const { title, description, sector, tags = [] } = observationData;
  
  // Puntuaciones base
  const relevanceScore = Math.floor(Math.random() * 30) + 50; // 50-80
  const validityScore = Math.floor(Math.random() * 30) + 50; // 50-80
  const businessOpportunityScore = Math.floor(Math.random() * 40) + 40; // 40-80
  
  // Generar insights basados en palabras clave
  const insights = [];
  const content = (title + ' ' + description).toLowerCase();
  
  if (content.includes('problema') || content.includes('dificultad')) {
    insights.push('Identifica un problema relevante en el mercado');
  }
  
  if (content.includes('solución') || content.includes('mejora')) {
    insights.push('Propone posibles enfoques de solución');
  }
  
  if (content.includes('mercado') || content.includes('cliente') || content.includes('usuario')) {
    insights.push('Considera la perspectiva del cliente/usuario');
  }
  
  if (insights.length === 0) {
    insights.push('Observación que requiere mayor análisis');
  }
  
  // Estructura básica de análisis local
  return {
    relevanceScore,
    validityScore,
    businessOpportunityScore,
    summary: 'Análisis automatizado de la observación (basado en patrones)',
    keyInsights: insights,
    potentialSolutions: [
      {
        title: 'Análisis de viabilidad recomendado',
        description: 'Realizar un análisis detallado con datos del sector para validar la observación',
        feasibility: 'Media',
        timeToImplement: 'Corto plazo'
      }
    ],
    businessOpportunities: [
      {
        title: 'Potencial oportunidad de innovación',
        description: 'Esta observación podría representar una oportunidad para desarrollar soluciones innovadoras',
        marketPotential: 'Medio',
        investmentRequired: 'Bajo-Medio',
        timeToMarket: 'Depende del alcance y recursos disponibles'
      }
    ],
    marketImpact: {
      disruptionPotential: 'Medio',
      industryAffected: sector || 'No especificado',
      estimatedMarketSize: 'Requiere investigación adicional',
      growthPotential: 'Potencial de crecimiento moderado'
    },
    challengesAndRisks: [
      {
        challenge: 'Validación de mercado',
        severityLevel: 'Medio',
        mitigationStrategy: 'Realizar investigación de mercado y entrevistas con usuarios potenciales'
      }
    ],
    recommendedNextSteps: [
      'Validar la observación con datos de mercado',
      'Identificar segmentos de usuario afectados',
      'Explorar soluciones existentes y sus limitaciones'
    ],
    source: 'análisis local',
    timestamp: new Date().toISOString(),
    observationId: observationData.id || 'unknown',
    analyzedBy: 'Análisis local'
  };
}; 