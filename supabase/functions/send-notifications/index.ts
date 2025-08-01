import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer les notifications à envoyer
    const now = new Date();
    const { data: notifications, error } = await supabase
      .from('scheduled_notifications')
      .select(`
        *,
        notification_settings!inner(*)
      `)
      .eq('sent', false)
      .lte('scheduled_for', now.toISOString());

    if (error) throw error;

    let sentCount = 0;

    for (const notification of notifications || []) {
      try {
        // Récupérer les abonnements push de l'utilisateur
        const { data: subscriptions } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', notification.user_id);

        // Envoyer la notification à chaque abonnement
        for (const subscription of subscriptions || []) {
          await sendPushNotification(subscription, {
            title: notification.title,
            body: notification.message,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            data: {
              url: notification.action_url || '/dashboard'
            }
          });
        }

        // Marquer comme envoyée
        await supabase
          .from('scheduled_notifications')
          .update({ sent: true })
          .eq('id', notification.id);

        // Créer une entrée dans l'historique des notifications
        await supabase
          .from('notifications')
          .insert({
            user_id: notification.user_id,
            type: 'scheduled',
            title: notification.title,
            message: notification.message,
            action_url: notification.action_url,
            is_read: false
          });

        sentCount++;
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${sentCount} notifications sent successfully` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Error in send-notifications function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function sendPushNotification(subscription: any, payload: any) {
  // Cette fonction devrait utiliser une bibliothèque comme web-push
  // Pour l'instant, on simule l'envoi
  console.log('Sending push notification to:', subscription.endpoint);
  console.log('Payload:', payload);
  
  // En production, vous utiliseriez quelque chose comme :
  // await webpush.sendNotification(subscription, JSON.stringify(payload));
}