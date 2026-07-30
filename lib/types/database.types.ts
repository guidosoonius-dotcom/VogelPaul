// Gegenereerd door Supabase (`generate_typescript_types`) tegen het live
// project "PaulVogel". Regenereer na elke schemawijziging in plaats van
// handmatig te bewerken:
//   supabase gen types typescript --project-id gqqkgzrzpfqajfuxbwvy > lib/types/database.types.ts
// (of de gelijkwaardige MCP-tool `generate_typescript_types`), en voeg de
// compatibiliteits-aliassen onderaan dit bestand daarna weer toe.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      birds: {
        Row: {
          birth_date: string | null
          brood_id: string | null
          created_at: string
          father_id: string | null
          id: string
          mother_id: string | null
          name: string | null
          notes: string | null
          owner_id: string
          photo_url: string | null
          ring_color: string | null
          ring_color_overridden: boolean
          ring_federation_code: string | null
          ring_number: string | null
          ring_year: number | null
          sex: Database["public"]["Enums"]["bird_sex"]
          species_id: string
          status: Database["public"]["Enums"]["bird_status"]
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          brood_id?: string | null
          created_at?: string
          father_id?: string | null
          id?: string
          mother_id?: string | null
          name?: string | null
          notes?: string | null
          owner_id?: string
          photo_url?: string | null
          ring_color?: string | null
          ring_color_overridden?: boolean
          ring_federation_code?: string | null
          ring_number?: string | null
          ring_year?: number | null
          sex?: Database["public"]["Enums"]["bird_sex"]
          species_id: string
          status?: Database["public"]["Enums"]["bird_status"]
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          brood_id?: string | null
          created_at?: string
          father_id?: string | null
          id?: string
          mother_id?: string | null
          name?: string | null
          notes?: string | null
          owner_id?: string
          photo_url?: string | null
          ring_color?: string | null
          ring_color_overridden?: boolean
          ring_federation_code?: string | null
          ring_number?: string | null
          ring_year?: number | null
          sex?: Database["public"]["Enums"]["bird_sex"]
          species_id?: string
          status?: Database["public"]["Enums"]["bird_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "birds_brood_id_fkey"
            columns: ["brood_id"]
            isOneToOne: false
            referencedRelation: "broods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "birds_father_id_fkey"
            columns: ["father_id"]
            isOneToOne: false
            referencedRelation: "birds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "birds_mother_id_fkey"
            columns: ["mother_id"]
            isOneToOne: false
            referencedRelation: "birds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "birds_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      broods: {
        Row: {
          chicks_fledged: number
          clutch_started_at: string | null
          created_at: string
          eggs_fertilized: number | null
          eggs_hatched: number
          eggs_laid: number
          id: string
          notes: string | null
          owner_id: string
          pair_id: string
          species_id: string
          updated_at: string
        }
        Insert: {
          chicks_fledged?: number
          clutch_started_at?: string | null
          created_at?: string
          eggs_fertilized?: number | null
          eggs_hatched?: number
          eggs_laid?: number
          id?: string
          notes?: string | null
          owner_id?: string
          pair_id: string
          species_id: string
          updated_at?: string
        }
        Update: {
          chicks_fledged?: number
          clutch_started_at?: string | null
          created_at?: string
          eggs_fertilized?: number | null
          eggs_hatched?: number
          eggs_laid?: number
          id?: string
          notes?: string | null
          owner_id?: string
          pair_id?: string
          species_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "broods_pair_id_fkey"
            columns: ["pair_id"]
            isOneToOne: false
            referencedRelation: "pairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broods_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_results: {
        Row: {
          bird_id: string
          category: string | null
          created_at: string
          id: string
          location: string | null
          notes: string | null
          owner_id: string
          photo_url: string | null
          points: number | null
          ranking: string | null
          show_date: string
          show_name: string
        }
        Insert: {
          bird_id: string
          category?: string | null
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          owner_id?: string
          photo_url?: string | null
          points?: number | null
          ranking?: string | null
          show_date: string
          show_name: string
        }
        Update: {
          bird_id?: string
          category?: string | null
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          owner_id?: string
          photo_url?: string | null
          points?: number | null
          ranking?: string | null
          show_date?: string
          show_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_results_bird_id_fkey"
            columns: ["bird_id"]
            isOneToOne: false
            referencedRelation: "birds"
            referencedColumns: ["id"]
          },
        ]
      }
      pairs: {
        Row: {
          created_at: string
          ended_at: string | null
          female_bird_id: string
          id: string
          male_bird_id: string
          notes: string | null
          owner_id: string
          started_at: string
          status: Database["public"]["Enums"]["pair_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          female_bird_id: string
          id?: string
          male_bird_id: string
          notes?: string | null
          owner_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["pair_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          female_bird_id?: string
          id?: string
          male_bird_id?: string
          notes?: string | null
          owner_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["pair_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pairs_female_bird_id_fkey"
            columns: ["female_bird_id"]
            isOneToOne: false
            referencedRelation: "birds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pairs_male_bird_id_fkey"
            columns: ["male_bird_id"]
            isOneToOne: false
            referencedRelation: "birds"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          federation_code: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          federation_code?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          federation_code?: string | null
          id?: string
        }
        Relationships: []
      }
      species: {
        Row: {
          code: string
          created_at: string
          default_fledge_days: number | null
          default_incubation_days: number | null
          id: string
          name_en: string | null
          name_nl: string
          ring_color_cycle_enabled: boolean
          ring_color_cycle_length: number
          ring_color_cycle_start_year: number | null
        }
        Insert: {
          code: string
          created_at?: string
          default_fledge_days?: number | null
          default_incubation_days?: number | null
          id?: string
          name_en?: string | null
          name_nl: string
          ring_color_cycle_enabled?: boolean
          ring_color_cycle_length?: number
          ring_color_cycle_start_year?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          default_fledge_days?: number | null
          default_incubation_days?: number | null
          id?: string
          name_en?: string | null
          name_nl?: string
          ring_color_cycle_enabled?: boolean
          ring_color_cycle_length?: number
          ring_color_cycle_start_year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ancestors: {
        Args: { bird_id: string; max_depth?: number }
        Returns: {
          birth_date: string
          generation: number
          id: string
          name: string
          relation: string
          ring_color: string
          ring_number: string
          ring_year: number
          sex: Database["public"]["Enums"]["bird_sex"]
          species_id: string
        }[]
      }
      get_descendants: {
        Args: { bird_id: string; max_depth?: number }
        Returns: {
          birth_date: string
          generation: number
          id: string
          name: string
          ring_color: string
          ring_number: string
          ring_year: number
          sex: Database["public"]["Enums"]["bird_sex"]
          species_id: string
        }[]
      }
    }
    Enums: {
      bird_sex: "male" | "female" | "unknown"
      bird_status: "active" | "deceased" | "sold" | "given_away"
      pair_status: "active" | "ended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      bird_sex: ["male", "female", "unknown"],
      bird_status: ["active", "deceased", "sold", "given_away"],
      pair_status: ["active", "ended"],
    },
  },
} as const

// ---------------------------------------------------------------------------
// Compatibiliteits-aliassen: de rest van de codebase (lib/queries, Server
// Actions) importeert deze korte namen rechtstreeks. Na een her-generatie
// van dit bestand moeten deze regels weer toegevoegd worden.
// ---------------------------------------------------------------------------
export type BirdSex = Database["public"]["Enums"]["bird_sex"]
export type BirdStatus = Database["public"]["Enums"]["bird_status"]
export type PairStatus = Database["public"]["Enums"]["pair_status"]
