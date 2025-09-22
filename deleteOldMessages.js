import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://YOUR-PROJECT.supabase.co";
const supabaseKey = "YOUR-SERVICE-ROLE-KEY"; // service_role key only!
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(req, res) {
  const { error } = await supabase.rpc('delete_old_messages');
  if(error) return res.status(500).send(error.message);
  res.status(200).send('Old messages deleted');
}
