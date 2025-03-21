import { supabase } from './supabase';

const GOOGLE_AI_API_KEY = 'AIzaSyDl00qiwvrLuRKMNmwuTU6BWuNry5cplwI';
const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface Category {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  level: number;
}

interface AITag {
  id: string;
  name: string;
  category: string;
  confidence_score: number;
}

interface UserFilter {
  id: string;
  name: string;
  filter_criteria: {
    categories?: string[];
    tags?: string[];
    impact_level?: number;
    urgency_level?: number;
    scope?: string;
  };
}

/**
 * Servicio de clasificación usando Gemini 2.0 Flash
 * 
 * Este servicio utiliza el modelo Gemini 2.0 Flash para:
 * - Generar etiquetas relevantes para ideas de negocio
 * - Clasificar ideas en categorías predefinidas
 * - Extraer palabras clave del contenido
 * 
 * El modelo está optimizado para respuestas rápidas y estructuradas.
 */

export const classificationService = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('problem_categories')
        .select('*')
        .order('level', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getCategories:', error);
      throw error;
    }
  },

  async generateAITags(problemId: string): Promise<AITag[]> {
    try {
      // Obtener información del problema
      const { data: problem, error: problemError } = await supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .single();

      if (problemError) throw problemError;

      // Generar etiquetas con Google AI
      const response = await fetch(`${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Genera etiquetas relevantes para esta idea de negocio:\n${problem.description}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Error al generar etiquetas');
      }

      const tags = await response.json();

      // Guardar etiquetas en la base de datos
      const { error: insertError } = await supabase
        .from('ai_tags')
        .insert(
          tags.map((tag: AITag) => ({
            name: tag.name,
            category: tag.category,
            confidence_score: tag.confidence_score,
          }))
        );

      if (insertError) throw insertError;

      // Relacionar etiquetas con el problema
      const { error: relationError } = await supabase
        .from('problem_ai_tags')
        .insert(
          tags.map((tag: AITag) => ({
            problem_id: problemId,
            tag_id: tag.id,
            confidence_score: tag.confidence_score,
          }))
        );

      if (relationError) throw relationError;

      return tags;
    } catch (error) {
      console.error('Error en generateAITags:', error);
      throw error;
    }
  },

  async createUserFilter(userId: string, filter: Omit<UserFilter, 'id'>): Promise<UserFilter> {
    try {
      const { data, error } = await supabase
        .from('user_filters')
        .insert({
          user_id: userId,
          ...filter,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en createUserFilter:', error);
      throw error;
    }
  },

  async getUserFilters(userId: string): Promise<UserFilter[]> {
    try {
      const { data, error } = await supabase
        .from('user_filters')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getUserFilters:', error);
      throw error;
    }
  },

  async updateUserFilter(filterId: string, updates: Partial<UserFilter>): Promise<UserFilter> {
    try {
      const { data, error } = await supabase
        .from('user_filters')
        .update(updates)
        .eq('id', filterId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en updateUserFilter:', error);
      throw error;
    }
  },

  async deleteUserFilter(filterId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_filters')
        .delete()
        .eq('id', filterId);

      if (error) throw error;
    } catch (error) {
      console.error('Error en deleteUserFilter:', error);
      throw error;
    }
  },

  async classifyProblem(problemId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('classify_problem', {
        problem_id: problemId,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error en classifyProblem:', error);
      throw error;
    }
  },
}; 