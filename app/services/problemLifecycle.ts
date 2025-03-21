import { supabase } from './supabase';

export interface ProblemLifecycle {
  id: string;
  problemId: string;
  currentStage: string;
  validationStatus: string;
  processingStatus: string;
  publicationStatus: string;
  monitoringStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProblemLifecycleHistory {
  id: string;
  problemId: string;
  stage: string;
  status: string;
  details: Record<string, any>;
  createdAt: Date;
}

export interface ProblemMetrics {
  id: string;
  problemId: string;
  viewsCount: number;
  interactionsCount: number;
  engagementScore: number;
  relevanceScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export const problemLifecycleService = {
  // Obtener el estado actual del ciclo de vida
  async getProblemLifecycle(problemId: string): Promise<ProblemLifecycle | null> {
    const { data, error } = await supabase
      .from('problem_lifecycle')
      .select('*')
      .eq('problem_id', problemId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      problemId: data.problem_id,
      currentStage: data.current_stage,
      validationStatus: data.validation_status,
      processingStatus: data.processing_status,
      publicationStatus: data.publication_status,
      monitoringStatus: data.monitoring_status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  // Obtener el historial del ciclo de vida
  async getProblemLifecycleHistory(problemId: string): Promise<ProblemLifecycleHistory[]> {
    const { data, error } = await supabase
      .from('problem_lifecycle_history')
      .select('*')
      .eq('problem_id', problemId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      problemId: item.problem_id,
      stage: item.stage,
      status: item.status,
      details: item.details,
      createdAt: new Date(item.created_at)
    }));
  },

  // Obtener métricas del problema
  async getProblemMetrics(problemId: string): Promise<ProblemMetrics | null> {
    const { data, error } = await supabase
      .from('problem_metrics')
      .select('*')
      .eq('problem_id', problemId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      problemId: data.problem_id,
      viewsCount: data.views_count,
      interactionsCount: data.interactions_count,
      engagementScore: data.engagement_score,
      relevanceScore: data.relevance_score,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  // Actualizar el estado del ciclo de vida
  async updateProblemLifecycle(
    problemId: string,
    stage: string,
    status: string,
    details?: Record<string, any>
  ): Promise<string> {
    const { data, error } = await supabase
      .rpc('update_problem_lifecycle', {
        p_problem_id: problemId,
        p_stage: stage,
        p_status: status,
        p_details: details
      });

    if (error) throw error;
    return data;
  },

  // Validar un problema
  async validateProblem(problemId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('validate_problem', {
        p_problem_id: problemId
      });

    if (error) throw error;
    return data;
  },

  // Procesar un problema
  async processProblem(problemId: string): Promise<Record<string, any>> {
    const { data, error } = await supabase
      .rpc('process_problem', {
        p_problem_id: problemId
      });

    if (error) throw error;
    return data;
  },

  // Actualizar métricas del problema
  async updateProblemMetrics(
    problemId: string,
    metrics: Partial<ProblemMetrics>
  ): Promise<ProblemMetrics> {
    const { data, error } = await supabase
      .from('problem_metrics')
      .upsert({
        problem_id: problemId,
        views_count: metrics.viewsCount,
        interactions_count: metrics.interactionsCount,
        engagement_score: metrics.engagementScore,
        relevance_score: metrics.relevanceScore,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      problemId: data.problem_id,
      viewsCount: data.views_count,
      interactionsCount: data.interactions_count,
      engagementScore: data.engagement_score,
      relevanceScore: data.relevance_score,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}; 