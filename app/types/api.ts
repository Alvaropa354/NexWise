// Tipos base
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Interfaces para Problemas
export interface Problem {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  sector: string;
  impactLevel: number;
  urgencyLevel: number;
  status: string;
  potentialScore: number;
  price: number;
  viewsCount: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  analytics?: ProblemAnalytics;
}

export interface ProblemAnalytics {
  marketSize: number;
  competitionLevel: string;
  implementationComplexity: number;
  roiEstimate: number;
  viabilityScore: number;
  aiAnalysis: Record<string, any>;
}

export interface CreateProblemRequest {
  title: string;
  description: string;
  sector: string;
  impactLevel: number;
  urgencyLevel: number;
  tags?: string[];
}

export interface UpdateProblemRequest {
  title?: string;
  description?: string;
  sector?: string;
  impactLevel?: number;
  urgencyLevel?: number;
  status?: string;
  price?: number;
  tags?: string[];
}

// Interfaces para Análisis
export interface Analysis {
  id: string;
  problemId: string;
  marketSize: number;
  competitionLevel: string;
  implementationComplexity: number;
  roiEstimate: number;
  viabilityScore: number;
  aiAnalysis: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisRequest {
  problemId: string;
  marketSize?: number;
  competitionLevel?: string;
  implementationComplexity?: number;
  roiEstimate?: number;
}

// Interfaces para Clasificación
export interface Classification {
  id: string;
  problemId: string;
  category: 'critical' | 'relevant' | 'not_relevant';
  score: number;
  factors: {
    impact: number;
    urgency: number;
    scope: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassificationRequest {
  problemId: string;
  category: 'critical' | 'relevant' | 'not_relevant';
  score: number;
  factors: {
    impact: number;
    urgency: number;
    scope: string;
  };
}

// Interfaces para Recomendaciones
export interface Recommendation {
  id: string;
  userId: string;
  problemId: string;
  matchScore: number;
  relevance: number;
  capacity: number;
  potential: number;
  recommendationType: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface RecommendationRequest {
  userId: string;
  limit?: number;
  filters?: {
    sector?: string;
    minPotential?: number;
    maxPrice?: number;
  };
}

// Interfaces para Autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  company?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    fullName?: string;
    company?: string;
  };
}

export interface AuthResponse {
  user: User | null;
  token?: string;
  error?: {
    message: string;
  };
}

// Interfaces para Suscripciones
export interface Subscription {
  id: string;
  userId: string;
  planType: string;
  price: number;
  startDate: Date;
  endDate?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionRequest {
  planType: string;
  paymentMethod: string;
  autoRenew?: boolean;
}

// Interfaces para Transacciones
export interface Transaction {
  id: string;
  userId: string;
  problemId?: string;
  amount: number;
  transactionType: string;
  status: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface TransactionRequest {
  amount: number;
  transactionType: string;
  problemId?: string;
  paymentMethod: string;
} 