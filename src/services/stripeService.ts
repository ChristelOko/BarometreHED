import { supabase } from './supabaseClient';
import { stripeProducts, getProductByPriceId, type StripeProduct } from '../stripe-config';

export interface UserSubscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  plan?: StripeProduct;
}

export interface UserOrder {
  customer_id: string;
  order_id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  order_date: string;
}

export class StripeService {
  /**
   * Get available products from configuration
   */
  static getAvailableProducts(): StripeProduct[] {
    return stripeProducts;
  }

  /**
   * Get subscription products only
   */
  static getSubscriptionProducts(): StripeProduct[] {
    return stripeProducts.filter(product => product.mode === 'subscription');
  }

  /**
   * Get one-time payment products only
   */
  static getOneTimeProducts(): StripeProduct[] {
    return stripeProducts.filter(product => product.mode === 'payment');
  }

  /**
   * Create a Stripe checkout session
   */
  static async createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      const product = getProductByPriceId(priceId);
      if (!product) {
        throw new Error('Product not found');
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: successUrl,
          cancel_url: cancelUrl,
          mode: product.mode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      return { url, error: null };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { url: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get user's current subscription
   */
  static async getUserSubscription(): Promise<{ data: UserSubscription | null; error: Error | null }> {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return { data: null, error: new Error('Supabase configuration missing') };
      }
      
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data && data.price_id) {
        const plan = getProductByPriceId(data.price_id);
        return { 
          data: { ...data, plan }, 
          error: null 
        };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      
      // Return a more specific error for network issues
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { data: null, error: new Error('Network error: Unable to connect to subscription service') };
      }
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get user's order history
   */
  static async getUserOrders(): Promise<{ data: UserOrder[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(): Promise<boolean> {
    // Vérifier d'abord si c'est Christel (fondatrice)
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'christel.aplogan@gmail.com') {
      return true;
    }
    
    const { data } = await this.getUserSubscription();
    return data?.subscription_status === 'active' || data?.subscription_status === 'trialing';
  }

  /**
   * Check if user can access premium features
   */
  static async canAccessPremiumFeatures(): Promise<boolean> {
    // Christel a toujours accès aux fonctionnalités premium
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'christel.aplogan@gmail.com') {
      return true;
    }
    
    // Check for active subscription
    const hasSubscription = await this.hasActiveSubscription();
    if (hasSubscription) return true;

    // Check for recent one-time purchases (this would need to be implemented based on your business logic)
    // For now, we'll just check subscription status
    return false;
  }

  /**
   * Get user's current plan name
   */
  static async getCurrentPlanName(): Promise<string> {
    // Plan spécial pour Christel
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'christel.aplogan@gmail.com') {
      return 'Plan à Vie - Fondatrice';
    }
    
    const { data } = await this.getUserSubscription();
    
    if (data?.plan) {
      return data.plan.name;
    }
    
    if (data?.subscription_status === 'active' || data?.subscription_status === 'trialing') {
      return 'Premium Actif';
    }
    
    return 'Accès Gratuit';
  }
}