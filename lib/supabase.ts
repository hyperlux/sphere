<<<<<<< Updated upstream
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db/database.types';

// Enhanced environment variable validation with more robust checks
const validateEnvVars = () => {
  const requiredVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    const errorMessage = `Critical configuration error: Missing environment variables: ${missingVars.join(', ')}`;
    console.error(errorMessage);
    console.error('Detailed environment context:', JSON.stringify(
      Object.fromEntries(
        Object.entries(requiredVars).map(([key, value]) => [key, value ? '[REDACTED]' : 'MISSING'])
      ), 
      null, 2
    ));
    throw new Error(errorMessage);
  }

  // Enhanced logging with obfuscated sensitive information
  console.log('Supabase configuration validated successfully');
  console.log('Supabase URL configured:', !!requiredVars.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Anon Key configured:', !!requiredVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // Optional service role key logging
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('Supabase Service Role Key configured: true');
  } else {
    console.log('Supabase Service Role Key: Not configured (optional)');
  }
};

// Validate environment variables immediately
validateEnvVars();

// Destructure and validate environment variables with type safety
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Ensure both URL and keys are valid
if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
  throw new Error('Supabase configuration requires non-empty URL and Anon Key');
}

// Create a function to create the Supabase client with enhanced error handling
export function createSupabaseClient(): SupabaseClient<Database> {
  try {
    const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
      global: {
        headers: {
          'x-client-info': `auronet-client/1.0.0`,
        },
      },
    });

    // Additional runtime validation
    if (!client) {
      throw new Error('Supabase client initialization failed: Returned null/undefined client');
    }

    console.log('Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('Supabase client creation failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    throw error;
  }
}

export const supabase = createSupabaseClient();

// Server-side Supabase client with service role key, with additional runtime checks
export const supabaseAdmin = (() => {
  // Only create admin client if service role key is available
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase Service Role Key not found. Admin client will not be created.');
    return null;
  }

  try {
    const adminClient = createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false, // Typically, admin clients don't need persistent sessions
      },
      global: {
        headers: {
          'x-client-info': `auronet-admin-client/1.0.0`,
        },
      },
    });

    if (!adminClient) {
      throw new Error('Supabase admin client initialization failed');
    }

    console.log('Supabase admin client created successfully');
    return adminClient;
  } catch (error) {
    console.error('Supabase admin client creation failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    return null;
  }
})();
=======
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
>>>>>>> Stashed changes
