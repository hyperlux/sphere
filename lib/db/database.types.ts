export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bazaar_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          price: number | null
          title: string
          user_id: string | null
          votes: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          price?: number | null
          title: string
          user_id?: string | null
          votes?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          price?: number | null
          title?: string
          user_id?: string | null
          votes?: number | null
        }
        Relationships: []
      }
      communities: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          votes: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
          votes?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
          votes?: number | null
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          event_id: number | null
          id: number
          joined_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          event_id?: number | null
          id?: never
          joined_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          event_id?: number | null
          id?: never
          joined_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_extended"
            referencedColumns: ["id"]
          },
        ]
      }
      event_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          isread: boolean | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          isread?: boolean | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          isread?: boolean | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      events_extended: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          id: number
          title: string
          votes: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: never
          title: string
          votes?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: never
          title?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_extended_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          parent_post_id: string | null
          topic_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          parent_post_id?: string | null
          topic_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          parent_post_id?: string | null
          topic_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string
          category_id: string
          content: string | null
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity_at: string | null
          slug: string
          title: string
        }
        Insert: {
          author_id: string
          category_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          slug: string
          title: string
        }
        Update: {
          author_id?: string
          category_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_votes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          topic_id: string | null
          user_id: string
          vote_type: boolean
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          topic_id?: string | null
          user_id: string
          vote_type: boolean
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          topic_id?: string | null
          user_id?: string
          vote_type?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "forum_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_votes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          author: string | null
          created_at: string | null
          description: string | null
          id: string
          tags: Json | null
          title: string
          type: string | null
          url: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          tags?: Json | null
          title: string
          type?: string | null
          url?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          tags?: Json | null
          title?: string
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      space_members: {
        Row: {
          id: number
          joined_at: string | null
          space_id: number | null
          user_id: string | null
        }
        Insert: {
          id?: never
          joined_at?: string | null
          space_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: never
          joined_at?: string | null
          space_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "space_members_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          votes: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
          votes?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
          votes?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          interests: string[] | null
          project_links: Json | null
          skills: string[] | null
          username: string
        }
        Insert: {
          auth_user_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          project_links?: Json | null
          skills?: string[] | null
          username: string
        }
        Update: {
          auth_user_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          interests?: string[] | null
          project_links?: Json | null
          skills?: string[] | null
          username?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          entity_id: number
          entity_type: string
          id: number
          user_id: string | null
          vote: number
        }
        Insert: {
          created_at?: string | null
          entity_id: number
          entity_type: string
          id?: never
          user_id?: string | null
          vote: number
        }
        Update: {
          created_at?: string | null
          entity_id?: number
          entity_type?: string
          id?: never
          user_id?: string | null
          vote?: number
        }
        Relationships: []
      }
    }
    Views: {
      vote_totals: {
        Row: {
          entity_id: number | null
          entity_type: string | null
          total_votes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_vote_score: {
        Args: {
          target_topic_id: string
          target_post_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
