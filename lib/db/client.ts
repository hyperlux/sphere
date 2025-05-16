import { Pool } from 'pg'; // Import the Pool class from pg

// Define a global variable to hold the pool.
// This helps in reusing the pool across multiple requests in serverless environments.
let pool: Pool | undefined;

function getDBPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    console.log('Creating new PostgreSQL connection pool...');
    pool = new Pool({
      connectionString,
      // You can add other pool configurations here if needed, e.g.:
      // max: 20, // max number of clients in the pool
      // idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
      // connectionTimeoutMillis: 2000, // how long to wait for a connection from the pool
    });

    pool.on('connect', () => {
      console.log('PostgreSQL client connected to the pool');
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
      // Optional: you might want to try to re-initialize the pool or exit the process
      // process.exit(-1);
    });
  }
  return pool;
}

// Export a query function that uses the pool
// This is a common pattern for executing queries.
export async function query(text: string, params?: any[]) {
  const dbPool = getDBPool();
  const start = Date.now();
  try {
    const res = await dbPool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

// If you need direct access to the pool (e.g., for transactions), you can export it.
export function getPool() {
  return getDBPool();
}

// --- Supabase related code to be removed or commented out ---
// import { createClient } from '@supabase/supabase-js'
// import type { Database } from './database.types' // This type will also need to be handled

// Client for browser/client-side operations
// export const supabaseClient = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// Function to create a server-side client instance when needed
// export function createServerSupabaseClient() {
//   const supabaseUrl = process.env.SUPABASE_URL;
//   const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// 
//   if (!supabaseUrl) {
//     throw new Error('Missing SUPABASE_URL environment variable for server client');
//   }
//   if (!serviceRoleKey) {
//     throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable for server client');
//   }
// 
//   return createClient<Database>(supabaseUrl, serviceRoleKey);
// }


// Utility function to handle potential missing environment variables (can be kept for reference or other uses)
// function validateSupabaseEnv() {
//   if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
//     throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
//   }
//   if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
//     throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
//   }
//   if (!process.env.SUPABASE_URL) {
//     throw new Error('Missing SUPABASE_URL environment variable')
//   }
//   if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
//     throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
//   }
//   // We might still want validation, but perhaps called explicitly elsewhere
//   // or rely on Supabase client errors.
// }

// Remove the top-level validation call to avoid issues during build
// validateSupabaseEnv()