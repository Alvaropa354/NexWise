/**
 * Servicio para integración con la API de Google AI Studio (Gemini)
 * 
 * Este módulo maneja todas las interacciones con Gemini 2.0 Flash, un modelo de IA más rápido y eficiente.
 * La API funciona mediante peticiones HTTP POST al endpoint de generateContent.
 * 
 * Estructura básica de la petición:
 * - URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
 * - Headers: Content-Type: application/json
 * - Body: {
 *     contents: [{
 *       parts: [{ text: "prompt" }]
 *     }]
 *   }
 * 
 * La respuesta incluye:
 * - candidates[0].content.parts[0].text: Contiene la respuesta generada
 * - candidates[0].finishReason: Indica por qué se detuvo la generación
 * - candidates[0].safetyRatings: Evaluaciones de seguridad del contenido
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Configuración para Google AI
const GOOGLE_AI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GOOGLE_AI_MODEL = 'gemini-2.0-flash';
const GOOGLE_AI_API_KEY = 'AIzaSyDl00qiwvrLuRKMNmwuTU6BWuNry5cplwI';

/**
 * Verifica si la API key está disponible
 * @returns {Promise<boolean>} - True siempre ya que usamos una API key predeterminada
 */
export const hasApiKey = async () => {
  return true;
};

/**
 * Analiza una idea de negocio utilizando Gemini 2.0 Flash
 * 
 * El modelo Gemini 2.0 Flash está optimizado para:
 * - Respuestas rápidas (latencia reducida)
 * - Análisis estructurado en formato JSON
 * - Procesamiento eficiente de prompts largos
 * 
 * @param {Object} ideaData - Datos de la idea a analizar
 * @returns {Promise<Object>} - Análisis completo de la idea
 */
export const analyzeWithAI = async (ideaData) => {
  try {
    // Prompt para el análisis de ideas
    const prompt = `Analiza esta idea de negocio y proporciona un análisis de mercado actualizado:

    Título: ${ideaData.title}
    Descripción: ${ideaData.description}
    Sector: ${ideaData.sector}
    Etiquetas: ${ideaData.tags.join(', ')}

Proporciona un análisis conciso pero detallado que incluya:

1. Puntuación de potencial (0-100) con breve justificación
2. Análisis del mercado actual con:
   - Número de empresas activas
   - Crecimiento anual (%)
   - Inversión reciente
   - Valor promedio empresas
   - Índice saturación (0-1)
3. Análisis de urgencia:
   - Tendencia (Acelerada/Creciente/Estable)
   - Crecimiento (%)
   - Riesgo disrupción
   - Tiempo entrada
4. Top 3 competidores con:
   - Nombre
   - Innovación (0-100)
   - Descripción
   - Datos clave

IMPORTANTE: Usa datos reales y actuales. Devuelve SOLO un objeto JSON con esta estructura:

{
  "potentialScore": número,
  "marketSize": "texto",
  "competition": "texto",
  "recommendation": "texto",
  "factores": ["factor1", "factor2"],
  "marketAnalysis": {
    "marketData": {
      "companiesCount": número,
      "marketGrowth": número,
      "investmentVolume": "texto",
      "avgCompanyValue": "texto",
      "saturationIndex": número
    }
  },
  "urgencyAnalysis": {
    "trend": "texto",
    "growthRate": "texto",
    "disruptionRisk": "texto",
    "timeToMarket": "texto"
  },
  "competitorsData": [
    {
      "name": "texto",
      "innovationIndex": número,
      "description": "texto",
      "founded": "texto",
      "hq": "texto",
      "marketCap": "texto",
      "employees": "texto",
      "revenue": "texto",
      "keyProducts": "texto"
    }
  ]
}`;
    
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
        }]
      },
      timeout: 30000 // Aumentado a 30 segundos
    });

    console.log('Respuesta recibida de Gemini. Verificando estructura...');
    
    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      console.error('Respuesta inválida de Gemini:', response.data);
      throw new Error('Respuesta inválida de la API');
    }

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
        
        // 3. Verificar si es un JSON válido intentando parsearlo
        JSON.parse(cleanContent);
        
        return cleanContent;
      } catch (error) {
        console.error('Error en la sanitización del JSON:', error);
        // Si falla el parseo, intentar una limpieza más agresiva
        try {
          // Buscar el primer { y el último }
          const jsonStart = rawContent.indexOf('{');
          const jsonEnd = rawContent.lastIndexOf('}');
          
          if (jsonStart >= 0 && jsonEnd >= 0 && jsonEnd > jsonStart) {
            const extractedJson = rawContent.substring(jsonStart, jsonEnd + 1);
            // Verificar si es válido
            JSON.parse(extractedJson);
            return extractedJson;
          }
        } catch (innerError) {
          console.error('Error en la limpieza agresiva del JSON:', innerError);
        }
        
        return null;
      }
    };
    
    const rawContent = response.data.candidates[0].content?.parts?.[0]?.text;
    console.log('Contenido recibido:', rawContent);

    if (!rawContent) {
      console.error('No se recibió contenido en la respuesta');
      throw new Error('Respuesta vacía de la API');
    }

    // Intentar limpiar el contenido antes de parsearlo usando la nueva función
    const cleanContent = sanitizeJsonResponse(rawContent);
    console.log('Contenido limpio:', cleanContent);
    
    if (!cleanContent) {
      console.error('No se pudo extraer un JSON válido de la respuesta');
      throw new Error('Formato de respuesta inválido');
    }

    // Procesar la respuesta
    const processResponse = (content, originalIdea) => {
      try {
        console.log('Procesando respuesta de IA...');
        
        // Parsear la respuesta JSON
        const analysisData = JSON.parse(content);
        console.log('JSON parseado correctamente');
        console.log('Campos disponibles:', Object.keys(analysisData));
        
        if (analysisData.marketAnalysis) {
          console.log('marketAnalysis presente:', Object.keys(analysisData.marketAnalysis));
          if (analysisData.marketAnalysis.marketData) {
            console.log('marketData presente:', Object.keys(analysisData.marketAnalysis.marketData));
          } else {
            console.log('marketData NO está presente en la respuesta');
          }
        } else {
          console.log('marketAnalysis NO está presente en la respuesta, se usará el valor por defecto');
        }
        
        // Validar la estructura del JSON
        if (!analysisData.potentialScore || !analysisData.recommendation) {
          throw new Error('Estructura JSON inválida en la respuesta');
        }

        // Estructuras por defecto para campos importantes
        const defaultMarketAnalysis = {
          marketData: {
            companiesCount: 10000,
            marketGrowth: 5.0,
            investmentVolume: "No disponible",
            avgCompanyValue: "No disponible",
            saturationIndex: 0.5
          }
        };
        
        const defaultUrgencyAnalysis = {
          trend: "Estable",
          growthRate: "Moderado",
          disruptionRisk: "Medio",
          timeToMarket: "6-12 meses"
        };
        
        const defaultCompetitorsData = [{
          name: "Competidor genérico",
          innovationIndex: 50,
          description: "No hay información detallada disponible",
          founded: "N/A",
          hq: "N/A",
          marketCap: "N/A",
          employees: "N/A",
          revenue: "N/A",
          keyProducts: "N/A"
        }];

        // Devolvemos todos los campos del análisis, manteniendo la estructura original
        return {
          ...analysisData,  // Incluimos todos los campos del análisis original
          // Aplicamos valores por defecto para campos críticos si no existen
          marketAnalysis: analysisData.marketAnalysis || defaultMarketAnalysis,
          urgencyAnalysis: analysisData.urgencyAnalysis || defaultUrgencyAnalysis,
          competitorsData: analysisData.competitorsData || defaultCompetitorsData,
          source: 'gemini-2.0-flash',
          timestamp: new Date().toISOString(),
          ideaId: originalIdea.id,
          sector: originalIdea.sector
        };
      } catch (error) {
        console.error('Error al procesar JSON:', error);
        console.error('Contenido que causó el error:', content);
        throw new Error(`Error al procesar JSON: ${error.message}`);
      }
    };

    return processResponse(cleanContent, ideaData);
  } catch (error) {
    console.error('Error completo:', error);
    if (error.response?.data) {
      console.error('Respuesta de error de la API:', error.response.data);
    }
    throw new Error(error.message || 'Error al conectar con el servicio de IA');
  }
};

/**
 * Analiza un comentario utilizando Gemini 2.0 Flash
 * @param {Object} commentData - Datos del comentario a analizar
 * @param {Object} ideaData - Datos de la idea comentada
 * @returns {Promise<Object>} - Análisis detallado del comentario
 */
export const analyzeCommentWithAI = async (commentData, ideaData) => {
  try {
    const prompt = `
    Analiza este comentario sobre una idea de negocio y proporciona un análisis estructurado en formato JSON.
    
    Comentario: "${commentData.text}"
    
    Idea relacionada:
    Título: ${ideaData.title}
    Descripción: ${ideaData.description}
    Sector: ${ideaData.sector}
    
    Por favor, proporciona un objeto JSON con exactamente esta estructura:
    {
      "relevance": "Alta" | "Media" | "Baja",
      "sentiment": "Positivo" | "Neutro" | "Negativo",
      "insightScore": número entre 0 y 100,
      "detailedAnalysis": {
        "key_insights": [array de strings con ideas clave extraídas, máximo 3],
        "market_signals": {
          "validation_level": "Alto" | "Medio-alto" | "Medio" | "Bajo",
          "confidence": número entre 0 y 100,
          "supporting_evidence": string con evidencia
        },
        "intent_analysis": {
          "primary_intent": string,
          "secondary_intent": string,
          "hidden_concerns": string
        },
        "actionable_feedback": {
          "priority": "Alta" | "Media-alta" | "Media" | "Baja",
          "suggested_actions": [array de acciones sugeridas, máximo 2],
          "potential_pivot_points": [array de posibles pivotes]
        },
        "semantic_categories": [array de categorías semánticas, máximo 3],
        "competitive_intelligence": {
          "indicator_type": string,
          "market_readiness": string,
          "saturation_risk": string
        }
      }
    }
    
    Asegúrate de que la respuesta sea SOLO el objeto JSON, sin texto adicional.`;

    console.log('Enviando análisis de comentario a Gemini 2.0 Flash...');
    
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
        }]
      },
      timeout: 10000
    });

    console.log('Respuesta de análisis de comentario recibida de Gemini');

    // Procesar la respuesta del comentario
    const processCommentResponse = (responseData, originalComment) => {
      try {
        const content = responseData.candidates[0].content.parts[0].text;
        const analysisData = typeof content === 'string' ? JSON.parse(content) : content;
        
        return {
          relevance: analysisData.relevance || 'Media',
          sentiment: analysisData.sentiment || 'Neutro',
          insightScore: analysisData.insightScore || 50,
          detailedAnalysis: analysisData.detailedAnalysis || {
            key_insights: ['No se pudo procesar el análisis completo'],
            market_signals: {
              validation_level: 'Medio',
              confidence: 50,
              supporting_evidence: 'No disponible'
            },
            intent_analysis: {
              primary_intent: 'No determinado',
              secondary_intent: 'No determinado',
              hidden_concerns: 'No determinado'
            },
            actionable_feedback: {
              priority: 'Media',
              suggested_actions: ['Revisar manualmente'],
              potential_pivot_points: []
            },
            semantic_categories: ['Procesamiento incompleto'],
            competitive_intelligence: {
              indicator_type: 'No determinado',
              market_readiness: 'No determinado',
              saturation_risk: 'No determinado'
            }
          },
          source: 'gemini-2.0-flash',
          timestamp: new Date().toISOString(),
          commentId: originalComment.id,
          safetyRatings: responseData.candidates[0].safetyRatings || []
        };
      } catch (error) {
        console.error('Error al procesar respuesta de análisis de comentario:', error);
        throw new Error('Error al procesar la respuesta de la IA para el comentario');
      }
    };

    return processCommentResponse(response.data, commentData);
  } catch (error) {
    console.error('Error al analizar comentario con Gemini:', error);
    throw new Error(error.response?.data?.error?.message || 'Error al analizar el comentario con IA');
  }
};

/**
 * Analiza una observación/problema utilizando Gemini 2.0 Flash
 * @param {Object} observationData - Datos de la observación a analizar
 * @returns {Promise<Object>} - Análisis detallado de la observación
 */
export const analyzeObservationWithAI = async (observationData) => {
  try {
    const prompt = `
    Analiza esta observación de negocio y proporciona un análisis estructurado detallado en formato JSON.
    
    Observación:
    Título: ${observationData.title || ''}
    Descripción: ${observationData.description || ''}
    Contexto: ${observationData.context || ''}
    Sector: ${observationData.sector || 'General'}
    Etiquetas: ${observationData.tags ? observationData.tags.join(', ') : ''}
    
    Proporciona un análisis detallado que incluya:
    
    1. Una evaluación de la importancia y validez de la observación
    2. Posibles soluciones o enfoques para abordar el problema
    3. Oportunidades de negocio potenciales derivadas de esta observación
    4. Impacto potencial en el mercado o industria
    5. Desafíos y riesgos asociados con esta observación
    
    Devuelve SOLO un objeto JSON con esta estructura exacta:
    
    {
      "relevanceScore": número entre 0 y 100,
      "validityScore": número entre 0 y 100,
      "businessOpportunityScore": número entre 0 y 100,
      "summary": "Resumen conciso de la observación",
      "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
      "potentialSolutions": [
        {
          "title": "Título de la solución 1",
          "description": "Descripción detallada",
          "feasibility": "Alta|Media|Baja",
          "timeToImplement": "Corto|Medio|Largo plazo"
        }
      ],
      "businessOpportunities": [
        {
          "title": "Título de la oportunidad",
          "description": "Descripción detallada",
          "marketPotential": "Alto|Medio|Bajo",
          "investmentRequired": "Alto|Medio|Bajo",
          "timeToMarket": "Texto descriptivo"
        }
      ],
      "marketImpact": {
        "disruptionPotential": "Alto|Medio|Bajo",
        "industryAffected": "Texto descriptivo",
        "estimatedMarketSize": "Texto descriptivo",
        "growthPotential": "Texto descriptivo"
      },
      "challengesAndRisks": [
        {
          "challenge": "Descripción del desafío",
          "severityLevel": "Alto|Medio|Bajo",
          "mitigationStrategy": "Estrategia para mitigar"
        }
      ],
      "recommendedNextSteps": ["Paso 1", "Paso 2", "Paso 3"]
    }`;

    console.log('Enviando análisis de observación a Gemini 2.0 Flash...');
    
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
        }]
      },
      timeout: 30000 // 30 segundos
    });

    console.log('Respuesta de análisis de observación recibida de Gemini');
    
    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      console.error('Respuesta inválida de Gemini para observación:', response.data);
      throw new Error('Respuesta inválida de la API');
    }

    const rawContent = response.data.candidates[0].content?.parts?.[0]?.text;
    console.log('Contenido recibido para observación:', rawContent);

    if (!rawContent) {
      console.error('No se recibió contenido en la respuesta para la observación');
      throw new Error('Respuesta vacía de la API');
    }

    // Usar la misma función de sanitización que hemos definido anteriormente
    const cleanContent = sanitizeJsonResponse(rawContent);
    console.log('Contenido limpio para observación:', cleanContent);
    
    if (!cleanContent) {
      console.error('No se pudo extraer un JSON válido de la respuesta de observación');
      throw new Error('Formato de respuesta inválido');
    }

    // Procesar la respuesta de la observación
    const processObservationResponse = (content, originalObservation) => {
      try {
        console.log('Procesando respuesta de IA para observación...');
        
        // Parsear la respuesta JSON
        const analysisData = JSON.parse(content);
        console.log('JSON de observación parseado correctamente');
        
        // Valores por defecto en caso de que falten campos
        const defaultAnalysis = {
          relevanceScore: 50,
          validityScore: 50,
          businessOpportunityScore: 50,
          summary: "No se pudo generar un resumen completo",
          keyInsights: ["Análisis incompleto"],
          potentialSolutions: [
            {
              title: "Análisis manual requerido",
              description: "Se recomienda un análisis manual de la observación",
              feasibility: "Media",
              timeToImplement: "No determinado"
            }
          ],
          businessOpportunities: [
            {
              title: "Requiere evaluación adicional",
              description: "Se necesita más información para determinar las oportunidades",
              marketPotential: "No determinado",
              investmentRequired: "No determinado",
              timeToMarket: "No determinado"
            }
          ],
          marketImpact: {
            disruptionPotential: "No determinado",
            industryAffected: "No determinado",
            estimatedMarketSize: "No determinado",
            growthPotential: "No determinado"
          },
          challengesAndRisks: [
            {
              challenge: "Evaluación de riesgos incompleta",
              severityLevel: "No determinado",
              mitigationStrategy: "Requiere análisis manual"
            }
          ],
          recommendedNextSteps: ["Realizar una evaluación detallada manual"]
        };

        // Combinamos los valores recibidos con los valores por defecto
        return {
          ...defaultAnalysis,           // Valores por defecto
          ...analysisData,              // Valores del análisis (sobrescriben los por defecto)
          source: 'gemini-2.0-flash',   // Metadatos adicionales
          timestamp: new Date().toISOString(),
          observationId: originalObservation.id || 'unknown'
        };
      } catch (error) {
        console.error('Error al procesar JSON de observación:', error);
        throw new Error(`Error al procesar el análisis de la observación: ${error.message}`);
      }
    };

    return processObservationResponse(cleanContent, observationData);
  } catch (error) {
    console.error('Error completo en análisis de observación:', error);
    if (error.response?.data) {
      console.error('Respuesta de error de la API para observación:', error.response.data);
    }
    throw new Error(error.message || 'Error al conectar con el servicio de IA para analizar la observación');
  }
}; 