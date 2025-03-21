import { supabase } from './supabase';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  points: number;
}

interface UserRank {
  id: string;
  name: string;
  description: string;
  required_points: number;
  benefits: any;
}

interface RedeemableCredit {
  id: string;
  amount: number;
  source: string;
  expires_at: string | null;
}

interface PopularityBonus {
  id: string;
  problem_id: string;
  bonus_amount: number;
  reason: string;
}

interface SpecialEvent {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  rewards: any;
}

export const incentivesService = {
  async getBadges(): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('points', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getBadges:', error);
      throw error;
    }
  },

  async getUserBadges(userId: string): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          badge:badges(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data.map(item => item.badge);
    } catch (error) {
      console.error('Error en getUserBadges:', error);
      throw error;
    }
  },

  async getRanks(): Promise<UserRank[]> {
    try {
      const { data, error } = await supabase
        .from('user_ranks')
        .select('*')
        .order('required_points', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getRanks:', error);
      throw error;
    }
  },

  async getUserRank(userId: string): Promise<UserRank | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          rank:user_ranks(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data.rank;
    } catch (error) {
      console.error('Error en getUserRank:', error);
      throw error;
    }
  },

  async getRedeemableCredits(userId: string): Promise<RedeemableCredit[]> {
    try {
      const { data, error } = await supabase
        .from('redeemable_credits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getRedeemableCredits:', error);
      throw error;
    }
  },

  async getPopularityBonuses(userId: string): Promise<PopularityBonus[]> {
    try {
      const { data, error } = await supabase
        .from('popularity_bonuses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getPopularityBonuses:', error);
      throw error;
    }
  },

  async getSpecialEvents(): Promise<SpecialEvent[]> {
    try {
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en getSpecialEvents:', error);
      throw error;
    }
  },

  async joinEvent(eventId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: userId,
          status: 'joined'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error en joinEvent:', error);
      throw error;
    }
  },

  async awardBadge(userId: string, badgeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId
        });

      if (error) throw error;

      // Actualizar rango del usuario
      const { error: rankError } = await supabase.rpc('update_user_rank', {
        user_id: userId
      });

      if (rankError) throw rankError;
    } catch (error) {
      console.error('Error en awardBadge:', error);
      throw error;
    }
  },

  async addRedeemableCredit(userId: string, amount: number, source: string, expiresAt?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('redeemable_credits')
        .insert({
          user_id: userId,
          amount,
          source,
          expires_at: expiresAt
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error en addRedeemableCredit:', error);
      throw error;
    }
  },

  async awardPopularityBonus(userId: string, problemId: string, amount: number, reason: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('popularity_bonuses')
        .insert({
          user_id: userId,
          problem_id: problemId,
          bonus_amount: amount,
          reason
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error en awardPopularityBonus:', error);
      throw error;
    }
  }
}; 