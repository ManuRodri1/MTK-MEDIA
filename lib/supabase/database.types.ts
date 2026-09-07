export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          website_url: string | null
          instagram_url: string | null
          logo_cloudinary_public_id: string | null
          logo_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          website_url?: string | null
          instagram_url?: string | null
          logo_cloudinary_public_id?: string | null
          logo_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          client_id: string | null
          title: string
          slug: string
          short_description: string | null
          description: string | null
          project_type: string
          status: string
          project_date: string | null
          instagram_url: string | null
          external_url: string | null
          is_featured: boolean
          sort_order: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          title: string
          slug: string
          short_description?: string | null
          description?: string | null
          project_type?: string
          status?: string
          project_date?: string | null
          instagram_url?: string | null
          external_url?: string | null
          is_featured?: boolean
          sort_order?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>
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
      project_services: {
        Row: {
          project_id: string
          service_id: string
          created_at: string
        }
        Insert: {
          project_id: string
          service_id: string
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["project_services"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          id: string
          project_id: string
          media_type: string
          media_role: string
          cloudinary_asset_id: string | null
          cloudinary_public_id: string | null
          cloudinary_url: string | null
          thumbnail_url: string | null
          original_filename: string | null
          format: string | null
          width: number | null
          height: number | null
          duration_seconds: number | null
          bytes: number | null
          alt_text: string | null
          caption: string | null
          is_cover: boolean
          is_featured: boolean
          sort_order: number
          processing_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          media_type: string
          media_role?: string
          cloudinary_asset_id?: string | null
          cloudinary_public_id?: string | null
          cloudinary_url?: string | null
          thumbnail_url?: string | null
          original_filename?: string | null
          format?: string | null
          width?: number | null
          height?: number | null
          duration_seconds?: number | null
          bytes?: number | null
          alt_text?: string | null
          caption?: string | null
          is_cover?: boolean
          is_featured?: boolean
          sort_order?: number
          processing_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["project_media"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      reorder_project_media: {
        Args: { p_project_id: string; p_media_ids: string[] }
        Returns: undefined
      }
      set_project_media_cover: {
        Args: { p_project_id: string; p_media_id: string }
        Returns: undefined
      }
      set_project_media_hero: {
        Args: { p_project_id: string; p_media_id: string }
        Returns: undefined
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type ProjectMedia = Database["public"]["Tables"]["project_media"]["Row"]
export type Client = Database["public"]["Tables"]["clients"]["Row"]
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type Service = Database["public"]["Tables"]["services"]["Row"]
