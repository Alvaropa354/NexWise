import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, testAPI } from '../services/supabase';

// Modo de prueba para desarrollo
const TEST_MODE = true; // Debe coincidir con el valor en supabase.ts

export const AuthContext = createContext({});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para cargar la sesión inicial
    async function loadSession() {
      try {
        let sessionResult;
        
        if (TEST_MODE) {
          // En modo de prueba, usar el mock
          sessionResult = await testAPI.auth.getSession();
        } else {
          // Con Supabase real
          sessionResult = await supabase.auth.getSession();
        }
        
        const { data: { session } } = sessionResult;
        setUser(session?.user || null);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        setLoading(false);
      }
    }
    
    loadSession();

    // Escuchar cambios de autenticación
    let subscription = { unsubscribe: () => {} };
    
    if (TEST_MODE) {
      // En modo de prueba no necesitamos un listener real
      const { data } = testAPI.auth.onAuthStateChange();
      subscription = data.subscription;
    } else {
      // Con Supabase real
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
          setLoading(false);
        }
      );
      subscription = authListener.subscription;
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      if (TEST_MODE) {
        // En modo de prueba
        return await testAPI.auth.signInWithPassword({ email, password });
      } else {
        // Con Supabase real
        return await supabase.auth.signInWithPassword({ email, password });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { error };
    }
  };

  const signUp = async (email, password, metadata) => {
    try {
      if (TEST_MODE) {
        // En modo de prueba
        return await testAPI.auth.signUp({ 
          email, 
          password, 
          options: { data: metadata } 
        });
      } else {
        // Con Supabase real
        return await supabase.auth.signUp({
          email,
          password,
          options: { data: metadata }
        });
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (TEST_MODE) {
        // En modo de prueba
        await testAPI.auth.signOut();
      } else {
        // Con Supabase real
        await supabase.auth.signOut();
      }
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
} 