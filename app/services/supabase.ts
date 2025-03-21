import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Obtener variables de entorno
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

// Modo de prueba para desarrollo
const TEST_MODE = true; // Cambiar a false en producción

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Configuración incompleta de Supabase. Usando modo de prueba.');
  console.warn('⚠️ En producción, asegúrate de configurar SUPABASE_URL y SUPABASE_ANON_KEY.');
}

// Cliente principal de Supabase
export const supabase = createClient(
  supabaseUrl || 'https://fakesupabaseurl.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNTY5NDQwMCwiZXhwIjoxNzE1Njk0NDAwfQ.fake_key_for_testing',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Mock de datos para modo de prueba
const mockData = {
  problems: [
    {
      id: '1',
      title: 'Problema de ejemplo 1',
      description: 'Este es un problema de ejemplo para pruebas',
      sector: 'Tecnología',
      impact_level: 8,
      urgency_level: 4,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Problema de ejemplo 2',
      description: 'Otro problema de ejemplo para pruebas',
      sector: 'Salud',
      impact_level: 7,
      urgency_level: 3,
      status: 'active',
      created_at: new Date().toISOString()
    }
  ]
};

// Funciones auxiliares para trabajar con Supabase
export const supabaseHelpers = {
  // Función para subir un archivo
  async uploadFile(bucket: string, path: string, file: Blob): Promise<string | null> {
    if (TEST_MODE) {
      console.log('Simulando subida de archivo en modo de prueba');
      return `https://example.com/${path}`;
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) {
      console.error('Error al subir archivo:', error);
      return null;
    }
    
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },
  
  // Función para obtener una URL pública
  getPublicUrl(bucket: string, path: string): string {
    if (TEST_MODE) {
      return `https://example.com/${path}`;
    }
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
};

// API para modo de prueba (reemplaza las llamadas a Supabase)
export const testAPI = {
  async getProblems() {
    return { data: mockData.problems, error: null };
  },
  
  async getProblemById(id: string) {
    const problem = mockData.problems.find(p => p.id === id);
    return { data: problem || null, error: problem ? null : new Error('Problema no encontrado') };
  },
  
  async createProblem(problemData: any) {
    const newProblem = {
      id: `${Date.now()}`,
      ...problemData,
      created_at: new Date().toISOString()
    };
    return { data: newProblem, error: null };
  },
  
  async updateProblem(id: string, updates: any) {
    const problemIndex = mockData.problems.findIndex(p => p.id === id);
    if (problemIndex === -1) {
      return { data: null, error: new Error('Problema no encontrado') };
    }
    
    const updatedProblem = {
      ...mockData.problems[problemIndex],
      ...updates
    };
    
    return { data: updatedProblem, error: null };
  },
  
  // Auth mock
  auth: {
    async signInWithPassword({ email, password }: { email: string, password: string }) {
      if (email === 'test@example.com' && password === 'password') {
        return {
          data: {
            session: {
              user: {
                id: 'test-user-id',
                email: 'test@example.com',
                user_metadata: {
                  name: 'Usuario de Prueba'
                }
              }
            }
          },
          error: null
        };
      }
      return { data: { session: null }, error: new Error('Credenciales incorrectas') };
    },
    
    async signUp({ email, password, options }: { email: string, password: string, options?: any }) {
      return {
        data: {
          user: {
            id: 'new-user-id',
            email,
            user_metadata: options?.data || {}
          }
        },
        error: null
      };
    },
    
    async signOut() {
      return { error: null };
    },
    
    async getSession() {
      return { data: { session: null }, error: null };
    },
    
    onAuthStateChange(callback: Function) {
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  }
}; 