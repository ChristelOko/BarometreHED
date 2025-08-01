import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

// Configuration CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Ou spécifiez votre domaine: "http://barometre-hed.eu"
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, X-Client-Info",
  "Access-Control-Max-Age": "86400" // 24 heures
};

// Fonction pour créer un client Supabase
function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Les variables d'environnement SUPABASE_URL et SUPABASE_ANON_KEY sont requises");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

serve(async (req) => {
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204, // No content
      headers: corsHeaders
    });
  }
  
  try {
    // Extraire les paramètres de la requête
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop() || "";
    const params = Object.fromEntries(url.searchParams);
    
    // Extraire le corps de la requête si ce n'est pas une requête GET
    let body = null;
    if (req.method !== "GET" && req.headers.get("content-type")?.includes("application/json")) {
      body = await req.json();
    }
    
    // Créer le client Supabase
    const supabase = createSupabaseClient();
    
    // Déterminer quelle table/fonction accéder en fonction du chemin
    let result;
    
    switch (path) {
      case "users":
        result = await supabase.from("users").select(params.select || "*");
        break;
        
      case "profiles":
        result = await supabase.from("profiles").select(params.select || "*");
        break;
        
      case "scans":
        if (req.method === "GET") {
          result = await supabase.from("scans").select(params.select || "*");
        } else if (req.method === "POST" && body) {
          result = await supabase.from("scans").insert(body);
        }
        break;
        
      case "results":
        if (req.method === "GET") {
          result = await supabase.from("results").select(params.select || "*");
        } else if (req.method === "POST" && body) {
          result = await supabase.from("results").insert(body);
        }
        break;
        
      case "content_pages":
        result = await supabase.from("content_pages").select(params.select || "*");
        break;
        
      case "reminders":
        if (req.method === "GET") {
          result = await supabase.from("reminders").select(params.select || "*");
        } else if (req.method === "POST" && body) {
          result = await supabase.from("reminders").insert(body);
        } else if (req.method === "PUT" && body && params.id) {
          result = await supabase.from("reminders").update(body).eq("id", params.id);
        } else if (req.method === "DELETE" && params.id) {
          result = await supabase.from("reminders").delete().eq("id", params.id);
        }
        break;
        
      case "feedbacks":
        if (req.method === "GET") {
          result = await supabase.from("feedbacks").select(params.select || "*");
        } else if (req.method === "POST" && body) {
          result = await supabase.from("feedbacks").insert(body);
        }
        break;
        
      case "user_feedback_status":
        if (req.method === "GET" && params.user_id) {
          result = await supabase
            .from("user_feedback_status")
            .select(params.select || "*")
            .eq("user_id", params.user_id)
            .maybeSingle();
        } else if (req.method === "POST" && body) {
          result = await supabase.from("user_feedback_status").upsert(body, {
            onConflict: 'user_id'
          });
        } else if (req.method === "PUT" && body && params.user_id) {
          result = await supabase
            .from("user_feedback_status")
            .update(body)
            .eq("user_id", params.user_id);
        }
        break;
        
      case "translations":
        // Utiliser la fonction RPC pour récupérer les traductions
        if (params.lang_code) {
          result = await supabase.rpc("get_translations", { lang_code: params.lang_code });
        } else {
          result = { error: "lang_code parameter is required" };
        }
        break;
        
      case "energetic_readings":
        result = await supabase.from("energetic_readings").select(params.select || "*");
        break;
        
      case "knowledge_base":
        result = await supabase.from("knowledge_base").select(params.select || "*");
        break;
        
      default:
        return new Response(JSON.stringify({ error: "Endpoint not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
    
    // Retourner le résultat avec les headers CORS
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    // Gérer les erreurs
    console.error("Error in CORS proxy:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});