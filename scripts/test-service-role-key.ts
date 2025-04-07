const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testServiceRoleKey() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Service role key test failed:', error.message);
      process.exit(1);
    }
    console.log('Service role key is valid. Total users:', data?.users.length);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error during service role key test:', err);
    process.exit(1);
  }
}

testServiceRoleKey();
