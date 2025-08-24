import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type ChatRoom = {
  id: string;
  name: string;
  created_at: string;
};

export type Message = {
  id: string;
  room_id: string;
  username: string;
  content: string;
  created_at: string;
};