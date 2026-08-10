import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kquqmdrkvjwsrgojqwyz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_uWuHg7Yk8ixHeww3O5bDOw_e7Wqkt0g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("Checking admissions table columns...");
  const { data, error } = await supabase.from('admissions').select('*').limit(1);
  if (error) {
    console.error("Admissions Fetch Error:", error);
  } else {
    console.log("Admissions Fetch Success:", data);
    if (data && data.length > 0) {
      console.log("Columns of admissions:", Object.keys(data[0]));
    }
  }
}

run();
