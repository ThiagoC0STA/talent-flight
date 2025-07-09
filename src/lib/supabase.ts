import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o Supabase
export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string;
          type: string;
          category: string;
          experience: string;
          salary_min: number;
          salary_max: number;
          salary_currency: string;
          salary_period: string;
          description: string;
          requirements: string[];
          benefits: string[];
          is_remote: boolean;
          is_featured: boolean;
          is_active: boolean;
          application_url: string;
          company_logo: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          location: string;
          type: string;
          category: string;
          experience: string;
          salary_min: number;
          salary_max: number;
          salary_currency: string;
          salary_period: string;
          description: string;
          requirements: string[];
          benefits: string[];
          is_remote: boolean;
          is_featured: boolean;
          is_active: boolean;
          application_url: string;
          company_logo?: string | null;
          tags: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          location?: string;
          type?: string;
          category?: string;
          experience?: string;
          salary_min?: number;
          salary_max?: number;
          salary_currency?: string;
          salary_period?: string;
          description?: string;
          requirements?: string[];
          benefits?: string[];
          is_remote?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          application_url?: string;
          company_logo?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
