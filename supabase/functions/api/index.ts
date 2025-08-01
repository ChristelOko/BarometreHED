import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

// Configuration CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, X-Client-Info",
  "Access-Control-Max-Age": "86400" // 24 heures
};

// Fonction pour créer un client Supabase
function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Les variables d'environnement SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Fonction pour gérer les erreurs
function handleError(error: any) {
  console.error("Erreur API:", error);
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: error.message || "Une erreur s'est produite" 
    }),
    { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
}

// Routeur pour gérer les différentes routes
async function router(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.split("/api/")[1];
  
  // Extraire les paramètres de la requête
  const params = Object.fromEntries(url.searchParams);
  
  // Extraire le corps de la requête si ce n'est pas une requête GET
  let body = null;
  if (req.method !== "GET" && req.headers.get("content-type")?.includes("application/json")) {
    body = await req.json();
  }
  
  // Créer le client Supabase
  const supabase = createSupabaseClient();
  
  // Router vers le bon endpoint
  try {
    switch (path) {
      case "feelings":
        return await handleFeelings(req.method, params, body, supabase);
      
      case "scans":
        return await handleScans(req.method, params, body, supabase);
      
      case "results":
        return await handleResults(req.method, params, body, supabase);
      
      case "users":
        return await handleUsers(req.method, params, body, supabase);
      
      case "reminders":
        return await handleReminders(req.method, params, body, supabase);
      
      case "energetic-readings":
        return await handleEnergeticReadings(req.method, params, body, supabase);
      
      case "health":
        return new Response(
          JSON.stringify({ status: "ok", message: "API is running" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      
      default:
        return new Response(
          JSON.stringify({ error: "Endpoint not found" }),
          { 
            status: 404, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
    }
  } catch (error) {
    return handleError(error);
  }
}

// Gestionnaire pour les feelings
async function handleFeelings(method: string, params: Record<string, string>, body: any, supabase: any) {
  switch (method) {
    case "GET":
      // Récupérer tous les feelings ou filtrer par catégorie et type HD
      let query = supabase.from("feelings").select("*");
      
      if (params.category) {
        query = query.eq("category", params.category);
      }
      
      if (params.type_hd) {
        query = query.eq("type_hd", params.type_hd);
      }
      
      if (params.is_positive) {
        query = query.eq("is_positive", params.is_positive === "true");
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    case "POST":
      // Ajouter un nouveau feeling
      if (!body) throw new Error("Body is required");
      
      const { data: newFeeling, error: insertError } = await supabase
        .from("feelings")
        .insert([body])
        .select();
      
      if (insertError) throw insertError;
      
      return new Response(
        JSON.stringify({ success: true, data: newFeeling }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
  }
}

// Gestionnaire pour les scans
async function handleScans(method: string, params: Record<string, string>, body: any, supabase: any) {
  switch (method) {
    case "GET":
      // Récupérer tous les scans d'un utilisateur ou un scan spécifique
      let query = supabase.from("scans").select("*");
      
      if (params.user_id) {
        query = query.eq("user_id", params.user_id);
      }
      
      if (params.id) {
        query = query.eq("id", params.id);
      }
      
      if (params.limit) {
        query = query.limit(parseInt(params.limit));
      }
      
      if (params.order_by) {
        const direction = params.order_direction === "asc" ? true : false;
        query = query.order(params.order_by, { ascending: direction });
      } else {
        // Par défaut, trier par date décroissante
        query = query.order("date", { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    case "POST":
      // Ajouter un nouveau scan
      if (!body) throw new Error("Body is required");
      
      const { data: newScan, error: insertError } = await supabase
        .from("scans")
        .insert([body])
        .select();
      
      if (insertError) throw insertError;
      
      return new Response(
        JSON.stringify({ success: true, data: newScan }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
  }
}

// Gestionnaire pour les résultats
async function handleResults(method: string, params: Record<string, string>, body: any, supabase: any) {
  switch (method) {
    case "GET":
      // Récupérer les résultats d'un scan spécifique
      let query = supabase.from("results").select("*");
      
      if (params.scan_id) {
        query = query.eq("scan_id", params.scan_id);
      }
      
      if (params.id) {
        query = query.eq("id", params.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    case "POST":
      // Ajouter un nouveau résultat
      if (!body) throw new Error("Body is required");
      
      const { data: newResult, error: insertError } = await supabase
        .from("results")
        .insert([body])
        .select();
      
      if (insertError) throw insertError;
      
      return new Response(
        JSON.stringify({ success: true, data: newResult }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
  }
}

// Gestionnaire pour les utilisateurs
async function handleUsers(method: string, params: Record<string, string>, body: any, supabase: any) {
  switch (method) {
    case "GET":
      // Récupérer un utilisateur spécifique ou tous les utilisateurs
      let query = supabase.from("users").select("*");
      
      if (params.id) {
        query = query.eq("id", params.id);
      }
      
      if (params.email) {
        query = query.eq("email", params.email);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    case "PUT":
      // Mettre à jour un utilisateur
      if (!params.id) throw new Error("User ID is required");
      if (!body) throw new Error("Body is required");
      
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update(body)
        .eq("id", params.id)
        .select();
      
      if (updateError) throw updateError;
      
      return new Response(
        JSON.stringify({ success: true, data: updatedUser }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
  }
}

// Gestionnaire pour les rappels
async function handleReminders(method: string, params: Record<string, string>, body: any, supabase: any) {
  switch (method) {
    case "GET":
      // Récupérer les rappels d'un utilisateur
      let query = supabase.from("reminders").select("*");
      
      if (params.user_id) {
        query = query.eq("user_id", params.user_id);
      }
      
      if (params.id) {
        query = query.eq("id", params.id);
      }
      
      if (params.completed) {
        query = query.eq("completed", params.completed === "true");
      }
      
      if (params.type) {
        query = query.eq("type", params.type);
      }
      
      if (params.date_from && params.date_to) {
        query = query.gte("date", params.date_from).lte("date", params.date_to);
      } else if (params.date_from) {
        query = query.gte("date", params.date_from);
      } else if (params.date_to) {
        query = query.lte("date", params.date_to);
      }
      
      if (params.order_by) {
        const direction = params.order_direction === "asc" ? true : false;
        query = query.order(params.order_by, { ascending: direction });
      } else {
        // Par défaut, trier par date croissante
        query = query.order("date", { ascending: true });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    case "POST":
      // Ajouter un nouveau rappel
      if (!body) throw new Error("Body is required");
      
      const { data: newReminder, error: insertError } = await supabase
        .from("reminders")
        .insert([body])
        .select();
      
      if (insertError) throw insertError;
      
      return new Response(
        JSON.stringify({ success: true, data: newReminder }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    case "PUT":
      // Mettre à jour un rappel
      if (!params.id) throw new Error("Reminder ID is required");
      if (!body) throw new Error("Body is required");
      
      const { data: updatedReminder, error: updateError } = await supabase
        .from("reminders")
        .update(body)
        .eq("id", params.id)
        .select();
      
      if (updateError) throw updateError;
      
      return new Response(
        JSON.stringify({ success: true, data: updatedReminder }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    case "DELETE":
      // Supprimer un rappel
      if (!params.id) throw new Error("Reminder ID is required");
      
      const { error: deleteError } = await supabase
        .from("reminders")
        .delete()
        .eq("id", params.id);
      
      if (deleteError) throw deleteError;
      
      return new Response(
        JSON.stringify({ success: true, message: "Reminder deleted successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
  }
}

// Gestionnaire pour les lectures énergétiques
async function handleEnergeticReadings(method: string, params: Record<string, string>, body: any, supabase: any) {
  switch (method) {
    case "GET":
      // Récupérer une lecture énergétique spécifique ou toutes les lectures
      let query = supabase.from("energetic_readings").select("*");
      
      if (params.id) {
        query = query.eq("id", params.id);
      }
      
      if (params.date) {
        query = query.eq("date", params.date);
      }
      
      if (params.limit) {
        query = query.limit(parseInt(params.limit));
      }
      
      if (params.order_by) {
        const direction = params.order_direction === "asc" ? true : false;
        query = query.order(params.order_by, { ascending: direction });
      } else {
        // Par défaut, trier par date décroissante
        query = query.order("date", { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    case "POST":
      // Ajouter une nouvelle lecture énergétique
      if (!body) throw new Error("Body is required");
      
      const { data: newReading, error: insertError } = await supabase
        .from("energetic_readings")
        .insert([body])
        .select();
      
      if (insertError) throw insertError;
      
      return new Response(
        JSON.stringify({ success: true, data: newReading }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
  }
}

// Fonction principale qui gère les requêtes
serve(async (req) => {
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204, // No content
      headers: corsHeaders
    });
  }
  
  try {
    return await router(req);
  } catch (error) {
    return handleError(error);
  }
});