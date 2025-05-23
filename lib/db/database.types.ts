export interface Database {
  public: {
    Tables: {
      bazaar_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          condition: string;
          location: string | null;
          image_url: string | null;
          seller_id: string;
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
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          username: string | null;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          username?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          username?: string | null;
          created_at?: string;
          last_login?: string | null;
        };
      };
      resource_categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
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
      };
      communities: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string;
          created_at: string;
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
      };
      space_members: {
        Row: {
          id: string;
          space_id: string;
          user_id: string;
          role: string;
          created_at: string;
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
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string | null;
          location: string | null;
          community_id: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time?: string | null;
          location?: string | null;
          community_id: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string | null;
          location?: string | null;
          community_id?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          url: string | null;
          file_type: string | null;
          size_in_bytes: number | null;
          category_id: string | null;
          author_id: string | null;
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
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
