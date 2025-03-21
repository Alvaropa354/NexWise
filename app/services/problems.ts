import { apiService } from './api';
import {
  Problem,
  CreateProblemRequest,
  UpdateProblemRequest,
  Analysis,
  AnalysisRequest,
  Classification,
  ClassificationRequest,
  PaginationParams
} from '../types/api';

export const problemsService = {
  // Operaciones CRUD de Problemas
  async createProblem(data: CreateProblemRequest): Promise<Problem> {
    const response = await apiService.post<Problem>('/problemas', data);
    return response.data!;
  },

  async getProblem(id: string): Promise<Problem> {
    const response = await apiService.get<Problem>(`/problemas/${id}`);
    return response.data!;
  },

  async updateProblem(id: string, data: UpdateProblemRequest): Promise<Problem> {
    const response = await apiService.put<Problem>(`/problemas/${id}`, data);
    return response.data!;
  },

  async deleteProblem(id: string): Promise<void> {
    await apiService.delete(`/problemas/${id}`);
  },

  async getProblems(params?: PaginationParams & {
    sector?: string;
    status?: string;
    minPotential?: number;
    maxPrice?: number;
  }): Promise<{
    problems: Problem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const response = await apiService.getPaginated<Problem>('/problemas', params);
    return {
      problems: response.data || [],
      pagination: response.pagination
    };
  },

  // Operaciones de Análisis
  async getAnalysis(id: string): Promise<Analysis> {
    const response = await apiService.get<Analysis>(`/analisis/${id}`);
    return response.data!;
  },

  async createAnalysis(data: AnalysisRequest): Promise<Analysis> {
    const response = await apiService.post<Analysis>('/analisis', data);
    return response.data!;
  },

  async updateAnalysis(id: string, data: Partial<AnalysisRequest>): Promise<Analysis> {
    const response = await apiService.put<Analysis>(`/analisis/${id}`, data);
    return response.data!;
  },

  // Operaciones de Clasificación
  async getClassification(id: string): Promise<Classification> {
    const response = await apiService.get<Classification>(`/clasificacion/${id}`);
    return response.data!;
  },

  async createClassification(data: ClassificationRequest): Promise<Classification> {
    const response = await apiService.post<Classification>('/clasificacion', data);
    return response.data!;
  },

  async updateClassification(id: string, data: Partial<ClassificationRequest>): Promise<Classification> {
    const response = await apiService.put<Classification>(`/clasificacion/${id}`, data);
    return response.data!;
  },

  // Operaciones de Métricas
  async incrementViews(id: string): Promise<void> {
    await apiService.post(`/problemas/${id}/views`);
  },

  async getProblemMetrics(id: string): Promise<{
    views: number;
    interactions: number;
    engagement: number;
  }> {
    const response = await apiService.get<{
      views: number;
      interactions: number;
      engagement: number;
    }>(`/problemas/${id}/metrics`);
    return response.data!;
  }
}; 