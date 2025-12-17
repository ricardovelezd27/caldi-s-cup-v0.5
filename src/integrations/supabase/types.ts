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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brew_logs: {
        Row: {
          brew_method: string
          brewed_at: string | null
          coffee_name: string
          created_at: string | null
          id: string
          notes: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          brew_method: string
          brewed_at?: string | null
          coffee_name: string
          created_at?: string | null
          id?: string
          notes?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          brew_method?: string
          brewed_at?: string | null
          coffee_name?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          brewing_level: Database["public"]["Enums"]["brewing_level"] | null
          coffee_tribe: Database["public"]["Enums"]["coffee_tribe"] | null
          created_at: string
          display_name: string | null
          id: string
          is_onboarded: boolean | null
          onboarded_at: string | null
          updated_at: string
          weekly_goal_target: number | null
        }
        Insert: {
          avatar_url?: string | null
          brewing_level?: Database["public"]["Enums"]["brewing_level"] | null
          coffee_tribe?: Database["public"]["Enums"]["coffee_tribe"] | null
          created_at?: string
          display_name?: string | null
          id: string
          is_onboarded?: boolean | null
          onboarded_at?: string | null
          updated_at?: string
          weekly_goal_target?: number | null
        }
        Update: {
          avatar_url?: string | null
          brewing_level?: Database["public"]["Enums"]["brewing_level"] | null
          coffee_tribe?: Database["public"]["Enums"]["coffee_tribe"] | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_onboarded?: boolean | null
          onboarded_at?: string | null
          updated_at?: string
          weekly_goal_target?: number | null
        }
        Relationships: []
      }
      scanned_coffees: {
        Row: {
          acidity_score: number | null
          ai_confidence: number | null
          altitude: string | null
          awards: string[] | null
          body_score: number | null
          brand: string | null
          brand_story: string | null
          coffee_name: string | null
          created_at: string | null
          cupping_score: number | null
          flavor_notes: string[] | null
          id: string
          image_url: string
          jargon_explanations: Json | null
          match_reasons: string[] | null
          origin: string | null
          processing_method: string | null
          raw_ai_response: Json | null
          roast_level: string | null
          scanned_at: string | null
          sweetness_score: number | null
          tribe_match_score: number | null
          user_id: string
          variety: string | null
        }
        Insert: {
          acidity_score?: number | null
          ai_confidence?: number | null
          altitude?: string | null
          awards?: string[] | null
          body_score?: number | null
          brand?: string | null
          brand_story?: string | null
          coffee_name?: string | null
          created_at?: string | null
          cupping_score?: number | null
          flavor_notes?: string[] | null
          id?: string
          image_url: string
          jargon_explanations?: Json | null
          match_reasons?: string[] | null
          origin?: string | null
          processing_method?: string | null
          raw_ai_response?: Json | null
          roast_level?: string | null
          scanned_at?: string | null
          sweetness_score?: number | null
          tribe_match_score?: number | null
          user_id: string
          variety?: string | null
        }
        Update: {
          acidity_score?: number | null
          ai_confidence?: number | null
          altitude?: string | null
          awards?: string[] | null
          body_score?: number | null
          brand?: string | null
          brand_story?: string | null
          coffee_name?: string | null
          created_at?: string | null
          cupping_score?: number | null
          flavor_notes?: string[] | null
          id?: string
          image_url?: string
          jargon_explanations?: Json | null
          match_reasons?: string[] | null
          origin?: string | null
          processing_method?: string | null
          raw_ai_response?: Json | null
          roast_level?: string | null
          scanned_at?: string | null
          sweetness_score?: number | null
          tribe_match_score?: number | null
          user_id?: string
          variety?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          added_at: string | null
          brew_method: string | null
          coffee_name: string
          id: string
          image_url: string | null
          rating: number | null
          roaster_name: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          brew_method?: string | null
          coffee_name: string
          id?: string
          image_url?: string | null
          rating?: number | null
          roaster_name?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          brew_method?: string | null
          coffee_name?: string
          id?: string
          image_url?: string | null
          rating?: number | null
          roaster_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "roaster" | "admin"
      brewing_level: "beginner" | "intermediate" | "expert"
      coffee_tribe: "fox" | "owl" | "hummingbird" | "bee"
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
      app_role: ["user", "roaster", "admin"],
      brewing_level: ["beginner", "intermediate", "expert"],
      coffee_tribe: ["fox", "owl", "hummingbird", "bee"],
    },
  },
} as const
