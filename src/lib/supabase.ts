import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
// Replace these with your actual Supabase URL and anon key when deploying
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database interfaces based on our schema
export interface Startup {
  id: number;
  name: string;
  description: string;
  industry: string;
  location: string;
  logo: string;
  created_at?: string;
  updated_at?: string;
}

export interface FundingRound {
  id: number;
  startup_id: number;
  round_type: string;
  amount: number;
  date: string;
  lead_investors: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Investor {
  id: number;
  name: string;
  profile: string;
  total_investments: number;
  notable_investments: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Trend {
  id: number;
  category: string;
  data: any;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  saved_filters?: any;
  created_at?: string;
  updated_at?: string;
} 