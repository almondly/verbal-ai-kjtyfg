import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://dhbhuqfokoutkuxtoefr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoYmh1cWZva291dGt1eHRvZWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDgyOTMsImV4cCI6MjA3Mzc4NDI5M30.OuyApK8Q1t3fbzVZ96gjGEoaoPC5PIU7TgHhHw1EagA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
