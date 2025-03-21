import { supabase } from './supabase';

export async function fetchProblems() {
  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error específico de Supabase:', error.message);
      throw new Error(`Error al obtener problemas: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error en fetchProblems:', error.message);
    throw error;
  }
} 