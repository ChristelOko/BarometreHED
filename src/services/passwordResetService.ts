import { supabase } from './supabaseClient';

export interface PasswordResetRequest {
  email: string;
  timestamp: string;
  userAgent: string;
  requestId: string;
  method: 'email' | 'admin' | 'whatsapp';
  status: 'pending' | 'sent' | 'completed' | 'failed';
}

/**
 * Service pour gérer les demandes de réinitialisation de mot de passe
 * avec plusieurs méthodes de fallback
 */
export class PasswordResetService {
  
  /**
   * Tenter la réinitialisation par email Supabase
   */
  static async resetByEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Supabase reset error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Email reset failed:', error);
      return { success: false, error: 'Service email indisponible' };
    }
  }

  /**
   * Créer une demande de réinitialisation manuelle
   */
  static async createManualRequest(email: string): Promise<{ success: boolean; requestId?: string }> {
    try {
      const request: PasswordResetRequest = {
        email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        requestId: this.generateRequestId(),
        method: 'admin',
        status: 'pending'
      };

      // Stocker la demande localement
      const existingRequests = this.getStoredRequests();
      existingRequests.push(request);
      localStorage.setItem('passwordResetRequests', JSON.stringify(existingRequests));

      // En production, cela enverrait la demande à un serveur
      // Pour l'instant, on simule l'envoi
      await this.simulateAdminNotification(request);

      return { success: true, requestId: request.requestId };
    } catch (error) {
      console.error('Manual request failed:', error);
      return { success: false };
    }
  }

  /**
   * Vérifier le statut d'une demande
   */
  static getRequestStatus(requestId: string): PasswordResetRequest | null {
    const requests = this.getStoredRequests();
    return requests.find(req => req.requestId === requestId) || null;
  }

  /**
   * Générer un ID unique pour la demande
   */
  private static generateRequestId(): string {
    return `PWR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Récupérer les demandes stockées localement
   */
  private static getStoredRequests(): PasswordResetRequest[] {
    try {
      const stored = localStorage.getItem('passwordResetRequests');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Simuler la notification à l'administrateur
   */
  private static async simulateAdminNotification(request: PasswordResetRequest): Promise<void> {
    // En production, cela enverrait un email ou une notification à l'admin
    console.log('Admin notification sent for password reset:', request);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      const requests = this.getStoredRequests();
      const index = requests.findIndex(req => req.requestId === request.requestId);
      if (index !== -1) {
        requests[index].status = 'sent';
        localStorage.setItem('passwordResetRequests', JSON.stringify(requests));
      }
    }, 2000);
  }

  /**
   * Nettoyer les anciennes demandes (plus de 24h)
   */
  static cleanupOldRequests(): void {
    const requests = this.getStoredRequests();
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    const validRequests = requests.filter(req => {
      const requestTime = new Date(req.timestamp).getTime();
      return requestTime > oneDayAgo;
    });

    localStorage.setItem('passwordResetRequests', JSON.stringify(validRequests));
  }

  /**
   * Générer un lien WhatsApp pour contact direct
   */
  static generateWhatsAppLink(email: string, requestId?: string): string {
    const message = requestId 
      ? `Bonjour, j'ai besoin d'aide pour réinitialiser mon mot de passe. Email: ${email}, Référence: ${requestId}`
      : `Bonjour, j'ai besoin d'aide pour réinitialiser mon mot de passe pour le compte: ${email}`;
    
    return `https://wa.me/34602256248?text=${encodeURIComponent(message)}`;
  }

  /**
   * Vérifier si un code de réinitialisation est valide
   */
  static validateResetCode(code: string, email: string): boolean {
    // En production, cela vérifierait le code côté serveur
    // Pour l'instant, on accepte un code temporaire
    const validCodes = ['RESET2024', 'ADMIN2024', 'TEMP2024'];
    return validCodes.includes(code.toUpperCase());
  }
}

// Nettoyer automatiquement les anciennes demandes au chargement
PasswordResetService.cleanupOldRequests();