
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Use local default if missing
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role to inspect schema properly if restricted

// Fallback for local dev if envs are missing (which they were in previous turn)
const url = supabaseUrl;
const key = supabaseServiceKey || supabaseKey;

const supabase = createClient(url, key);

async function checkSchema() {
  // Query information_schema
  // Note: This requires direct SQL access usually, but maybe we can just try to select * limit 1 and see keys
  
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching contracts:", error);
  } else if (data && data.length > 0) {
    console.log("Columns found:", Object.keys(data[0]));
  } else {
    console.log("No data found in contracts table to inspect columns.");
    // Try to insert a dummy row to see errors? No.
  }
}

checkSchema();
