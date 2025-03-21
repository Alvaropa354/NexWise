import { initStripe, useStripe } from '@stripe/stripe-react-native';
import { supabase } from './supabase';
import { Alert } from 'react-native';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Verificar que la clave pública de Stripe esté configurada
if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('⚠️ Configuración incompleta de Stripe. Por favor, revisa tus variables de entorno.');
  console.error('⚠️ Asegúrate de que la variable EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY esté configurada en el archivo .env');
  // No lanzamos error para permitir que la app se inicie, aunque las funciones de pago no funcionarán
}

export const stripeService = {
  async initialize() {
    try {
      if (!STRIPE_PUBLISHABLE_KEY) {
        console.warn('Stripe no se inicializará: falta la clave pública.');
        return false;
      }
      
      await initStripe({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
      });
      
      return true;
    } catch (error) {
      console.error('Error al inicializar Stripe:', error);
      return false;
    }
  },

  async createPaymentMethod(cardDetails: any) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      Alert.alert('Error', 'El sistema de pagos no está configurado correctamente. Por favor, contacta al soporte.');
      return null;
    }
    
    try {
      // Esta es una implementación simulada, deberías usar la biblioteca real de Stripe
      // const { createPaymentMethod } = useStripe();
      // const { paymentMethod, error } = await createPaymentMethod({ 
      //   paymentMethodType: 'Card',
      //   card: cardDetails 
      // });
      // if (error) throw error;
      // return paymentMethod;
      
      // Simulación para desarrollo
      return { id: `pm_${Math.random().toString(36).substring(2, 10)}` };
    } catch (error) {
      console.error('Error al crear método de pago:', error);
      return null;
    }
  },

  async createSubscription(userId: string, priceId: string, paymentMethodId: string) {
    try {
      const { data, error } = await supabase.rpc('create_subscription', {
        user_id: userId,
        price_id: priceId,
        payment_method_id: paymentMethodId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear suscripción:', error);
      return null;
    }
  },

  async cancelSubscription(subscriptionId: string) {
    try {
      const { data, error } = await supabase.rpc('cancel_subscription', {
        subscription_id: subscriptionId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      throw error;
    }
  },

  async updatePaymentMethod(subscriptionId: string, paymentMethodId: string) {
    try {
      const { data, error } = await supabase.rpc('update_payment_method', {
        subscription_id: subscriptionId,
        payment_method_id: paymentMethodId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar método de pago:', error);
      throw error;
    }
  },

  async getPaymentMethods(userId: string) {
    try {
      const { data, error } = await supabase.rpc('get_payment_methods', {
        user_id: userId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      throw error;
    }
  },

  async deletePaymentMethod(paymentMethodId: string) {
    try {
      const { data, error } = await supabase.rpc('delete_payment_method', {
        payment_method_id: paymentMethodId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al eliminar método de pago:', error);
      throw error;
    }
  },
}; 