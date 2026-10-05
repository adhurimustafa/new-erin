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
      brief_asset_refs: {
        Row: {
          asset_id: string
          brief_id: string
          category_snapshot:
            | Database["public"]["Enums"]["asset_category"]
            | null
          created_at: string
          label_snapshot: string | null
          original_name_snapshot: string | null
          owner_id: string
        }
        Insert: {
          asset_id: string
          brief_id: string
          category_snapshot?:
            | Database["public"]["Enums"]["asset_category"]
            | null
          created_at?: string
          label_snapshot?: string | null
          original_name_snapshot?: string | null
          owner_id?: string
        }
        Update: {
          asset_id?: string
          brief_id?: string
          category_snapshot?:
            | Database["public"]["Enums"]["asset_category"]
            | null
          created_at?: string
          label_snapshot?: string | null
          original_name_snapshot?: string | null
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brief_asset_refs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "project_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brief_asset_refs_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "project_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_name: string
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          location: string | null
          notes: string | null
          owner_id: string
          phone: string | null
          socials: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_name: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          owner_id?: string
          phone?: string | null
          socials?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_name?: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          owner_id?: string
          phone?: string | null
          socials?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      project_assets: {
        Row: {
          category: Database["public"]["Enums"]["asset_category"]
          client_id: string
          created_at: string
          declared_mime: string | null
          declared_size: number | null
          id: string
          kind: string | null
          label: string
          mime: string | null
          original_name: string
          owner_id: string
          project_id: string
          removed_at: string | null
          size_bytes: number | null
          status: Database["public"]["Enums"]["asset_status"]
          storage_path: string
          updated_at: string
          validated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["asset_category"]
          client_id: string
          created_at?: string
          declared_mime?: string | null
          declared_size?: number | null
          id?: string
          kind?: string | null
          label: string
          mime?: string | null
          original_name: string
          owner_id?: string
          project_id: string
          removed_at?: string | null
          size_bytes?: number | null
          status?: Database["public"]["Enums"]["asset_status"]
          storage_path: string
          updated_at?: string
          validated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["asset_category"]
          client_id?: string
          created_at?: string
          declared_mime?: string | null
          declared_size?: number | null
          id?: string
          kind?: string | null
          label?: string
          mime?: string | null
          original_name?: string
          owner_id?: string
          project_id?: string
          removed_at?: string | null
          size_bytes?: number | null
          status?: Database["public"]["Enums"]["asset_status"]
          storage_path?: string
          updated_at?: string
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_briefs: {
        Row: {
          created_at: string
          current_step: number
          data: Json
          id: string
          owner_id: string
          project_id: string
          schema_version: number
          sector: string
          status: Database["public"]["Enums"]["brief_status"]
          updated_at: string
          validated_at: string | null
          version: number
        }
        Insert: {
          created_at?: string
          current_step?: number
          data?: Json
          id?: string
          owner_id?: string
          project_id: string
          schema_version?: number
          sector: string
          status?: Database["public"]["Enums"]["brief_status"]
          updated_at?: string
          validated_at?: string | null
          version: number
        }
        Update: {
          created_at?: string
          current_step?: number
          data?: Json
          id?: string
          owner_id?: string
          project_id?: string
          schema_version?: number
          sector?: string
          status?: Database["public"]["Enums"]["brief_status"]
          updated_at?: string
          validated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_briefs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string
          created_at: string
          deleting: boolean
          description: string | null
          id: string
          languages: string[]
          name: string
          owner_id: string
          sector: string
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          deleting?: boolean
          description?: string | null
          id?: string
          languages?: string[]
          name: string
          owner_id?: string
          sector?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          deleting?: boolean
          description?: string | null
          id?: string
          languages?: string[]
          name?: string
          owner_id?: string
          sector?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      studio_admin_allowlist: {
        Row: {
          email: string
        }
        Insert: {
          email: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      asset_object_info: {
        Args: { _path: string }
        Returns: {
          mimetype: string
          size: number
        }[]
      }
      claim_studio_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member" | "client"
      asset_category:
        | "logo"
        | "photos"
        | "videos"
        | "documents"
        | "menu_pricing"
        | "portfolio"
        | "other"
      asset_status: "pending" | "ready" | "deleting" | "removed"
      brief_status: "draft" | "validated"
      project_status: "draft" | "preparing" | "ready" | "published"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "member", "client"],
      asset_category: [
        "logo",
        "photos",
        "videos",
        "documents",
        "menu_pricing",
        "portfolio",
        "other",
      ],
      asset_status: ["pending", "ready", "deleting", "removed"],
      brief_status: ["draft", "validated"],
      project_status: ["draft", "preparing", "ready", "published"],
    },
  },
} as const
