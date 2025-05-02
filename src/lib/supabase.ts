import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://grpibxqzmodagrdtscnq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycGlieHF6bW9kYWdyZHRzY25xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTk5MDAwMCwiZXhwIjoyMDYxNTY2MDAwfQ.CIIrf33NzJwf5yckxEnhrOwgXTCfsDCogaVSZLatqrQ";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
  },
});

export default supabase;
