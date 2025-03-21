import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acvxauqfqvaownerpwpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdnhhdXFmcXZhb3duZXJwd3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzI1MTgsImV4cCI6MjA1NzkwODUxOH0.vTrIgSADmcAA2IT6VSPMcmBpE9oiuWOqacwrPDZK4Cg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 