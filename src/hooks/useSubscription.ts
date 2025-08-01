import { useState, useEffect } from 'react';
import { StripeService, UserSubscription } from '../services/stripeService';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabaseClient';

export const useSubscription = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlanName, setCurrentPlanName] = useState<string>('Plan Gratuit');
  const [hasFreeAccess, setHasFreeAccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadSubscription();
      checkFreeAccess();
    } else {
      setIsLoading(false);
      setCurrentPlanName('Plan Gratuit');
      setHasFreeAccess(false);
    }
  }, [isAuthenticated, user]);

  const checkFreeAccess = async () => {
    if (!user?.id) return;

    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured, using default access');
        setHasFreeAccess(false);
        setCurrentPlanName('Plan Gratuit');
        return;
      }

      // Try to check for free access, with fallback
      try {
        const { data, error } = await supabase
          .rpc('has_free_access', { user_uuid: user.id });

        if (!error && data) {
          setHasFreeAccess(true);
          setCurrentPlanName('Accès Gratuit (Bétatesteuse)');
        }
      } catch (rpcError) {
        console.warn('RPC function not available, checking free_access_grants table');
        
        // Fallback: check free_access_grants table directly
        const { data: grants, error: grantsError } = await supabase
          .from('free_access_grants')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (!grantsError && grants) {
          setHasFreeAccess(true);
          setCurrentPlanName('Accès Gratuit (Bétatesteuse)');
        }
      }
    } catch (error) {
      console.warn('Error checking free access, using default:', error);
      setHasFreeAccess(false);
      setCurrentPlanName('Plan Gratuit');
    }
  };

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have valid Supabase configuration
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase configuration missing, using default subscription state');
        setCurrentPlanName('Plan Gratuit');
        setIsLoading(false);
        return;
      }
      
      // Additional check for demo/placeholder URLs
      if (import.meta.env.VITE_SUPABASE_URL.includes('your_supabase_url') || 
          import.meta.env.VITE_SUPABASE_URL.includes('demo.supabase.co')) {
        console.warn('Using demo Supabase URL, subscription features disabled');
        setCurrentPlanName('Plan Gratuit');
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await StripeService.getUserSubscription();
      
      if (error) {
        console.error('Error loading subscription:', error);
        // Set default state on error instead of failing
        setSubscription(data);
        
        // Set current plan name
        if (hasFreeAccess) {
          setCurrentPlanName('Accès Gratuit (Bétatesteuse)');
        } else if (user?.email === 'christel.aplogan@gmail.com') {
          setCurrentPlanName('Plan à Vie - Fondatrice');
        } else if (data?.plan) {
          setCurrentPlanName(data.plan.name);
        } else if (data?.subscription_status === 'active' || data?.subscription_status === 'trialing') {
          setCurrentPlanName('Plan Premium');
        } else {
          setCurrentPlanName('Plan Gratuit');
        }
      } else {
        setCurrentPlanName('Plan Gratuit');
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setCurrentPlanName('Plan Gratuit');
    } finally {
      setIsLoading(false);
    }
  };

  const isPremium = (): boolean => {
    // Christel a toujours accès premium en tant que fondatrice
    if (user?.email === 'christel.aplogan@gmail.com') {
      return true;
    }
    return hasFreeAccess || subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing';
  };

  const canAccessCategory = (category: string): boolean => {
    if (category === 'general') return true; // General category is always free
    
    // Christel a accès à toutes les catégories
    if (user?.email === 'christel.aplogan@gmail.com') {
      return true;
    }
    
    // Check for free access (beta testers)
    if (hasFreeAccess) return true;
    
    // Check for active subscription
    if (isPremium()) return true;
    
    // TODO: Check for temporary access from one-time purchases
    // This would require checking purchase history and expiration dates
    return false;
  };

  const hasFeature = (feature: string): boolean => {
    // Christel a accès à toutes les fonctionnalités
    if (user?.email === 'christel.aplogan@gmail.com') {
      return true;
    }
    
    if (!subscription?.plan) return false;
    return subscription.plan.features.includes(feature);
  };

  const getRemainingScans = (): number => {
    // Christel a des scans illimités
    if (user?.email === 'christel.aplogan@gmail.com') {
      return -1;
    }
    
    if (isPremium()) return -1; // Unlimited
    
    // For free users, only general category is available
    return -1; // No limit on general category scans
  };

  const getSubscriptionEndDate = (): Date | null => {
    if (!subscription?.current_period_end) return null;
    return new Date(subscription.current_period_end * 1000);
  };

  const isSubscriptionCanceled = (): boolean => {
    return subscription?.cancel_at_period_end === true;
  };

  return {
    subscription,
    isLoading,
    currentPlanName,
    hasFreeAccess,
    isPremium,
    canAccessCategory,
    hasFeature,
    getRemainingScans,
    getSubscriptionEndDate,
    isSubscriptionCanceled,
    refreshSubscription: loadSubscription
  };
};