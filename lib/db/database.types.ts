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
      users: {
        Row: {
          auth_user_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          username: string
        }
        Insert: {
          auth_user_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          username: string
        }
        Update: {
          auth_user_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          username?: string
        }
        Relationships: []
      },
      // Manually add basic type definition for communities
      communities: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string; // Assuming FK to users
          created_at: string; // Assuming timestampz
          image_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          image_url?: string | null;
        };
        Relationships: [
           // { foreignKeyName: "communities_created_by_fkey", columns: ["created_by"], referencedRelation: "users", referencedColumns: ["id"] }
        ];
      },
       // Manually add basic type definition for space_members
      space_members: {
        Row: {
          id: string;
          space_id: string; // Assuming FK to communities
          user_id: string; // Assuming FK to users
          role: string; // e.g., 'admin', 'member'
          created_at: string; // Assuming timestampz
        };
        Insert: {
          id?: string;
          space_id: string;
          user_id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          space_id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [
           // { foreignKeyName: "space_members_space_id_fkey", columns: ["space_id"], referencedRelation: "communities", referencedColumns: ["id"] },
           // { foreignKeyName: "space_members_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }
        ];
      },
      // Manually add basic type definition for event_categories
      event_categories: {
        Row: {
          id: string;
          name: string;
          // Add other columns if they exist
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      },
      // Manually add basic type definition for event_attendees
      event_attendees: {
        Row: {
          event_id: string; // FK to events
          user_id: string; // FK to users
          status: string; // e.g., 'attending', 'maybe', 'not_attending'
          created_at: string; // Assuming timestampz
        };
        Insert: {
          event_id: string;
          user_id: string;
          status: string;
          created_at?: string;
        };
        Update: {
          event_id?: string;
          user_id?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          // { foreignKeyName: "event_attendees_event_id_fkey", columns: ["event_id"], referencedRelation: "events", referencedColumns: ["id"] },
          // { foreignKeyName: "event_attendees_user_id_fkey", columns: ["user_id"], referencedRelation: "users", referencedColumns: ["id"] }
        ];
      },
      // Manually add basic type definition for events
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_time: string; // Assuming timestampz
          end_time: string | null; // Assuming timestampz
          location: string | null;
          community_id: string; // Assuming FK to a communities table
          category_id: string | null; // Add missing category FK
          created_by: string; // Assuming FK to users table
          created_at: string; // Assuming timestampz
          // Add other columns like 'date', 'type', 'isRead' if they exist
          date?: string; // Example if 'date' exists
          type?: string; // Example if 'type' exists
          isRead?: boolean; // Example if 'isRead' exists
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time?: string | null;
          location?: string | null;
          community_id: string;
          category_id?: string | null; // Add missing category FK
          created_by: string;
          created_at?: string;
          date?: string;
          type?: string;
          isRead?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string | null;
          location?: string | null;
          community_id?: string;
          category_id?: string | null; // Add missing category FK
          created_by?: string;
          created_at?: string;
          date?: string;
          type?: string;
          isRead?: boolean;
        };
        Relationships: [
          // Define relationships if needed
          // { foreignKeyName: "events_community_id_fkey", columns: ["community_id"], referencedRelation: "communities", referencedColumns: ["id"] },
          // { foreignKeyName: "events_created_by_fkey", columns: ["created_by"], referencedRelation: "users", referencedColumns: ["id"] }
        ];
      },
      // Manually add basic type definition for resource_categories
      resource_categories: {
        Row: {
          id: string;
          name: string;
          created_at: string; // Assuming timestampz
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      },
      // Manually add basic type definition for resources
      resources: {
         Row: {
          id: string;
          title: string;
          description: string | null;
          url: string | null;
          file_type: string | null;
          size_in_bytes: number | null;
          category_id: string | null; // Assuming FK to resource_categories
          author_id: string | null; // Assuming FK to users
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          url?: string | null;
          file_type?: string | null;
          size_in_bytes?: number | null;
          category_id?: string | null;
          author_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          url?: string | null;
          file_type?: string | null;
          size_in_bytes?: number | null;
          category_id?: string | null;
          author_id?: string | null;
          created_at?: string;
        };
        Relationships: [
           // Define relationships if needed
           // { foreignKeyName: "resources_category_id_fkey", columns: ["category_id"], referencedRelation: "resource_categories", referencedColumns: ["id"] },
           // { foreignKeyName: "resources_author_id_fkey", columns: ["author_id"], referencedRelation: "users", referencedColumns: ["id"] }
        ];
      },
      // Manually add basic type definition for bazaar_items
      bazaar_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          condition: string;
          location: string | null;
          image_url: string | null;
          seller_id: string; // Foreign key to users table
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          condition: string;
          location?: string | null;
          image_url?: string | null;
          seller_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          condition?: string;
          location?: string | null;
          image_url?: string | null;
          seller_id?: string;
          created_at?: string;
        };
        // Define relationship if needed for type safety, though the query uses explicit join syntax
        Relationships: [
           {
            foreignKeyName: "bazaar_items_seller_id_fkey", // Assuming this is the FK constraint name
            columns: ["seller_id"],
            isOneToOne: false,
            referencedRelation: "users",
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
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
