import { supabase } from './supabase';

const GOOGLE_AI_API_KEY = 'AIzaSyDl00qiwvrLuRKMNmwuTU6BWuNry5cplwI';
const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Servicio de análisis avanzado usando Gemini 2.0 Flash
 * 
 * Este servicio utiliza el modelo Gemini 2.0 Flash para realizar análisis especializados:
 * - Análisis de mercado
 * - Análisis de competencia
 * - Predicción de demanda
 * - Análisis de barreras de entrada
 * - Análisis de tendencias
 * 
 * Características del modelo:
 * - Respuestas rápidas (latencia < 1s)
 * - Formato JSON estructurado
 * - Evaluaciones de seguridad incluidas
 * - Procesamiento eficiente de contexto
 */

interface MarketAnalysis {
  market_size: number;
  market_potential: number;
  urgency_level: number;
  implementation_complexity: number;
  roi_estimate: number;
}

interface CompetitionAnalysis {
  competitor_name: string;
  market_share: number;
  strengths: string[];
  weaknesses: string[];
}

interface DemandPrediction {
  predicted_demand: number;
  confidence_level: number;
  timeframe_months: number;
}

interface EntryBarrier {
  barrier_type: string;
  description: string;
  impact_level: number;
}

interface SectorTrend {
  trend_name: string;
  description: string;
  impact_level: number;
}

export const analyticsService = {
  async analyzeMarket(problemId: string): Promise<MarketAnalysis> {
    try {
      // Obtener información del problema
      const { data: problem, error: problemError } = await supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .single();

      if (problemError) throw problemError;

      // Realizar análisis con Google AI
      const response = await fetch(`${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analiza el mercado para esta idea de negocio:\n${problem.description}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Error en el análisis de mercado');
      }

      const analysis = await response.json();

      // Guardar el análisis en la base de datos
      const { error: insertError } = await supabase
        .from('market_analyses')
        .insert({
          problem_id: problemId,
          ...analysis,
        });

      if (insertError) throw insertError;

      return analysis;
    } catch (error) {
      console.error('Error en analyzeMarket:', error);
      throw error;
    }
  },

  async analyzeCompetition(problemId: string): Promise<CompetitionAnalysis[]> {
    try {
      const { data: problem, error: problemError } = await supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .single();

      if (problemError) throw problemError;

      const response = await fetch(`${GOOGLE_AI_API_URL}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GOOGLE_AI_API_KEY}`,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analiza la competencia para esta idea de negocio:\n${problem.description}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error en el análisis de competencia');
      }

      const competitors = await response.json();

      // Guardar los análisis en la base de datos
      const { error: insertError } = await supabase
        .from('competition_analyses')
        .insert(
          competitors.map((competitor: CompetitionAnalysis) => ({
            problem_id: problemId,
            ...competitor,
          }))
        );

      if (insertError) throw insertError;

      return competitors;
    } catch (error) {
      console.error('Error en analyzeCompetition:', error);
      throw error;
    }
  },

  async predictDemand(problemId: string): Promise<DemandPrediction> {
    try {
      const { data: problem, error: problemError } = await supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .single();

      if (problemError) throw problemError;

      const response = await fetch(`${GOOGLE_AI_API_URL}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GOOGLE_AI_API_KEY}`,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Predice la demanda para esta idea de negocio:\n${problem.description}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error en la predicción de demanda');
      }

      const prediction = await response.json();

      // Guardar la predicción en la base de datos
      const { error: insertError } = await supabase
        .from('demand_predictions')
        .insert({
          problem_id: problemId,
          ...prediction,
        });

      if (insertError) throw insertError;

      return prediction;
    } catch (error) {
      console.error('Error en predictDemand:', error);
      throw error;
    }
  },

  async analyzeEntryBarriers(problemId: string): Promise<EntryBarrier[]> {
    try {
      const { data: problem, error: problemError } = await supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .single();

      if (problemError) throw problemError;

      const response = await fetch(`${GOOGLE_AI_API_URL}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GOOGLE_AI_API_KEY}`,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analiza las barreras de entrada para esta idea de negocio:\n${problem.description}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error en el análisis de barreras de entrada');
      }

      const barriers = await response.json();

      // Guardar las barreras en la base de datos
      const { error: insertError } = await supabase
        .from('entry_barriers')
        .insert(
          barriers.map((barrier: EntryBarrier) => ({
            problem_id: problemId,
            ...barrier,
          }))
        );

      if (insertError) throw insertError;

      return barriers;
    } catch (error) {
      console.error('Error en analyzeEntryBarriers:', error);
      throw error;
    }
  },

  async analyzeSectorTrends(problemId: string): Promise<SectorTrend[]> {
    try {
      const { data: problem, error: problemError } = await supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .single();

      if (problemError) throw problemError;

      const response = await fetch(`${GOOGLE_AI_API_URL}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GOOGLE_AI_API_KEY}`,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analiza las tendencias para esta idea de negocio:\n${problem.description}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error en el análisis de tendencias del sector');
      }

      const trends = await response.json();

      // Guardar las tendencias en la base de datos
      const { error: insertError } = await supabase
        .from('sector_trends')
        .insert(
          trends.map((trend: SectorTrend) => ({
            problem_id: problemId,
            ...trend,
          }))
        );

      if (insertError) throw insertError;

      return trends;
    } catch (error) {
      console.error('Error en analyzeSectorTrends:', error);
      throw error;
    }
  },

  async getProblemPotential(problemId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('calculate_problem_potential', {
        problem_id: problemId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getProblemPotential:', error);
      throw error;
    }
  },
}; 