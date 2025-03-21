import { supabase } from './supabase';
import { apiService } from './api';
import {
  Recommendation,
  RecommendationRequest,
  PaginationParams
} from '../types/api';

export interface UserProfile {
  id: string;
  userId: string;
  interests: string[];
  skills: string[];
  experienceLevel: string;
  preferredSectors: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInteraction {
  id: string;
  userId: string;
  problemId: string;
  interactionType: string;
  duration: number;
  engagementScore: number;
  createdAt: Date;
}

export interface SearchPattern {
  id: string;
  userId: string;
  searchQuery: string;
  filters: Record<string, any>;
  resultCount: number;
  createdAt: Date;
}

export const recommendationsService = {
  // Obtener perfil de usuario
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      interests: data.interests,
      skills: data.skills,
      experienceLevel: data.experience_level,
      preferredSectors: data.preferred_sectors,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  // Actualizar perfil de usuario
  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        interests: profile.interests,
        skills: profile.skills,
        experience_level: profile.experienceLevel,
        preferred_sectors: profile.preferredSectors,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      interests: data.interests,
      skills: data.skills,
      experienceLevel: data.experience_level,
      preferredSectors: data.preferred_sectors,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  // Registrar interacción de usuario
  async recordUserInteraction(
    userId: string,
    problemId: string,
    interactionType: string,
    duration: number,
    engagementScore: number
  ): Promise<UserInteraction> {
    const { data, error } = await supabase
      .from('user_interactions')
      .insert({
        user_id: userId,
        problem_id: problemId,
        interaction_type: interactionType,
        duration: duration,
        engagement_score: engagementScore
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      problemId: data.problem_id,
      interactionType: data.interaction_type,
      duration: data.duration,
      engagementScore: data.engagement_score,
      createdAt: new Date(data.created_at)
    };
  },

  // Obtener recomendaciones para un usuario
  async getUserRecommendations(userId: string): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('total_score', { ascending: false })
      .limit(10);

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      problemId: item.problem_id,
      matchScore: item.match_score,
      relevance: item.relevance_score,
      capacity: item.capacity_score,
      potential: item.potential_score,
      recommendationType: item.recommendation_type,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  },

  // Registrar patrón de búsqueda
  async recordSearchPattern(
    userId: string,
    searchQuery: string,
    filters: Record<string, any>,
    resultCount: number
  ): Promise<SearchPattern> {
    const { data, error } = await supabase
      .from('search_patterns')
      .insert({
        user_id: userId,
        search_query: searchQuery,
        filters: filters,
        result_count: resultCount
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      searchQuery: data.search_query,
      filters: data.filters,
      resultCount: data.result_count,
      createdAt: new Date(data.created_at)
    };
  },

  // Calcular score de matching
  async calculateMatchingScore(userId: string, problemId: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('calculate_matching_score', {
        user_id: userId,
        problem_id: problemId
      });

    if (error) throw error;
    return data;
  },

  // Generar nuevas recomendaciones
  async generateRecommendations(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .rpc('generate_recommendations', {
        user_id: userId
      });

    if (error) throw error;
    return data;
  },

  async getRecommendations(
    userId: string,
    params?: PaginationParams & {
      sector?: string;
      minPotential?: number;
      maxPrice?: number;
    }
  ): Promise<{
    recommendations: Recommendation[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const response = await apiService.getPaginated<Recommendation>(
      `/recomendaciones/${userId}`,
      params
    );
    return {
      recommendations: Array.isArray(response.data) ? response.data : [],
      pagination: response.pagination
    };
  },

  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<Recommendation[]> {
    const response = await apiService.get<Recommendation[]>(
      `/recomendaciones/${userId}/personalizadas`,
      { limit }
    );
    return response.data || [];
  },

  async getSimilarProblems(
    problemId: string,
    limit: number = 5
  ): Promise<Recommendation[]> {
    const response = await apiService.get<Recommendation[]>(
      `/recomendaciones/similares/${problemId}`,
      { limit }
    );
    return response.data || [];
  },

  async updateRecommendationPreferences(
    userId: string,
    preferences: {
      sectors?: string[];
      minPotential?: number;
      maxPrice?: number;
      preferredTags?: string[];
    }
  ): Promise<void> {
    await apiService.put(`/recomendaciones/${userId}/preferencias`, preferences);
  },

  async getRecommendationMetrics(
    userId: string
  ): Promise<{
    totalRecommendations: number;
    averageMatchScore: number;
    topSectors: string[];
    engagementRate: number;
  }> {
    const response = await apiService.get<{
      totalRecommendations: number;
      averageMatchScore: number;
      topSectors: string[];
      engagementRate: number;
    }>(`/recomendaciones/${userId}/metrics`);
    return response.data!;
  }
}; 