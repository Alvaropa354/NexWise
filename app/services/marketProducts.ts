import { supabase } from './supabase';

interface MarketProduct {
  id: string;
  problem_id: string;
  name: string;
  description: string;
  company: string;
  market_share: number;
  price_range: {
    min: number;
    max: number;
    currency: string;
  };
  features: {
    [key: string]: string;
  };
  limitations: string[];
  created_at: string;
  updated_at: string;
}

interface ProductComparison {
  id: string;
  market_product_id: string;
  feature_name: string;
  feature_value: string;
  comparison_score: number;
  created_at: string;
}

interface InnovationProposal {
  id: string;
  market_product_id: string;
  title: string;
  description: string;
  potential_impact: number;
  implementation_complexity: number;
  market_potential: number;
  created_at: string;
  updated_at: string;
}

export const marketProductsService = {
  async generateMarketProductsAnalysis(problemId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.rpc('generate_market_products_analysis', {
        problem_id: problemId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al generar análisis de productos:', error);
      throw error;
    }
  },

  async getMarketProducts(problemId: string): Promise<MarketProduct[]> {
    try {
      const { data, error } = await supabase
        .from('market_products')
        .select('*')
        .eq('problem_id', problemId)
        .order('market_share', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener productos de mercado:', error);
      throw error;
    }
  },

  async getProductComparisons(productId: string): Promise<ProductComparison[]> {
    try {
      const { data, error } = await supabase
        .from('product_comparisons')
        .select('*')
        .eq('market_product_id', productId)
        .order('comparison_score', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener comparaciones de producto:', error);
      throw error;
    }
  },

  async getInnovationProposals(productId: string): Promise<InnovationProposal[]> {
    try {
      const { data, error } = await supabase
        .from('innovation_proposals')
        .select('*')
        .eq('market_product_id', productId)
        .order('market_potential', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener propuestas de innovación:', error);
      throw error;
    }
  },

  async getMarketProduct(productId: string): Promise<MarketProduct | null> {
    try {
      const { data, error } = await supabase
        .from('market_products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener producto de mercado:', error);
      throw error;
    }
  }
}; 