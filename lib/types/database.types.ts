// Handgeschreven Supabase-types die overeenkomen met supabase/migrations/*.sql.
//
// Zodra er een live Supabase-project is gekoppeld, kunnen deze types
// vervangen worden door het resultaat van:
//   supabase gen types typescript --project-id <id> > lib/types/database.types.ts
// (of de gelijkwaardige MCP-tool `generate_typescript_types`). Tot die tijd
// is dit bestand de bron van waarheid en moet het handmatig in sync
// gehouden worden met nieuwe migraties.

export type BirdSex = "male" | "female" | "unknown";
export type BirdStatus = "active" | "deceased" | "sold" | "given_away";
export type PairStatus = "active" | "ended";

export interface Database {
  public: {
    Tables: {
      species: {
        Row: {
          id: string;
          code: string;
          name_nl: string;
          name_en: string | null;
          ring_color_cycle_enabled: boolean;
          ring_color_cycle_length: number;
          ring_color_cycle_start_year: number | null;
          default_incubation_days: number | null;
          default_fledge_days: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["species"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["species"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          federation_code: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      birds: {
        Row: {
          id: string;
          owner_id: string;
          species_id: string;
          name: string | null;
          sex: BirdSex;
          birth_date: string | null;
          ring_number: string | null;
          ring_year: number | null;
          ring_color: string | null;
          ring_federation_code: string | null;
          ring_color_overridden: boolean;
          father_id: string | null;
          mother_id: string | null;
          brood_id: string | null;
          status: BirdStatus;
          photo_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["birds"]["Row"]> & {
          species_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["birds"]["Row"]>;
        Relationships: [];
      };
      pairs: {
        Row: {
          id: string;
          owner_id: string;
          male_bird_id: string;
          female_bird_id: string;
          started_at: string;
          ended_at: string | null;
          status: PairStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pairs"]["Row"]> & {
          male_bird_id: string;
          female_bird_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["pairs"]["Row"]>;
        Relationships: [];
      };
      broods: {
        Row: {
          id: string;
          owner_id: string;
          pair_id: string;
          species_id: string;
          clutch_started_at: string | null;
          eggs_laid: number;
          eggs_fertilized: number | null;
          eggs_hatched: number;
          chicks_fledged: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["broods"]["Row"]> & {
          pair_id: string;
          species_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["broods"]["Row"]>;
        Relationships: [];
      };
      competition_results: {
        Row: {
          id: string;
          owner_id: string;
          bird_id: string;
          show_name: string;
          show_date: string;
          location: string | null;
          category: string | null;
          points: number | null;
          ranking: string | null;
          photo_url: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["competition_results"]["Row"]
        > & {
          bird_id: string;
          show_name: string;
          show_date: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["competition_results"]["Row"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_ancestors: {
        Args: { bird_id: string; max_depth?: number };
        Returns: {
          id: string;
          ring_number: string | null;
          ring_year: number | null;
          ring_color: string | null;
          name: string | null;
          sex: BirdSex;
          birth_date: string | null;
          species_id: string;
          generation: number;
          relation: string;
        }[];
      };
      get_descendants: {
        Args: { bird_id: string; max_depth?: number };
        Returns: {
          id: string;
          ring_number: string | null;
          ring_year: number | null;
          ring_color: string | null;
          name: string | null;
          sex: BirdSex;
          birth_date: string | null;
          species_id: string;
          generation: number;
        }[];
      };
    };
  };
}
