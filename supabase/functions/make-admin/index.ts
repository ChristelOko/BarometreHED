// Follow Supabase Edge Function format
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Get request body
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables:", {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      });
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server configuration error: Missing required environment variables",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with service role key (available in Edge Functions)
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Test connection by attempting a simple query
    try {
      const { error: connectionError } = await supabaseAdmin
        .from("users")
        .select("count")
        .limit(1);
      
      if (connectionError) {
        console.error("Database connection test failed:", connectionError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Database connection failed",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unable to connect to database",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email);

    if (userError || !userData?.user) {
      console.error("User lookup error:", userError);
      return new Response(
        JSON.stringify({
          success: false,
          error: userError?.message || "User not found",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = userData.user.id;

    // Check if user exists in public.users table
    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (existingUserError && existingUserError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected if user doesn't exist
      console.error("Error checking existing user:", existingUserError);
      return new Response(
        JSON.stringify({
          success: false,
          error: existingUserError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (existingUser) {
      // Update existing user to admin
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          role: "admin",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user role:", updateError);
        return new Response(
          JSON.stringify({
            success: false,
            error: updateError.message,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Create new user with admin role
      const { error: insertError } = await supabaseAdmin
        .from("users")
        .insert([
          {
            id: userId,
            email: email,
            full_name: email.split("@")[0], // Use part of email as name
            role: "admin",
            is_active: true,
          },
        ]);

      if (insertError) {
        console.error("Error creating user:", insertError);
        return new Response(
          JSON.stringify({
            success: false,
            error: insertError.message,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    console.log(`Successfully set user ${email} as admin`);
    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${email} has been set as admin`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error in make-admin function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});