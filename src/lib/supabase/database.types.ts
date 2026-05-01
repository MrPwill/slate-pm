// Generated types from Supabase CLI - would be auto-generated
// This file defines the TypeScript types for our Supabase database

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      board_members: {
        Row: {
          board_id: string
          user_id: string
          role: 'owner' | 'member'
          created_at: string
        }
        Insert: {
          board_id: string
          user_id: string
          role?: 'owner' | 'member'
          created_at?: string
        }
        Update: {
          board_id?: string
          user_id?: string
          role?: 'owner' | 'member'
          created_at?: string
        }
      }
      columns: {
        Row: {
          id: string
          board_id: string
          title: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          board_id: string
          title: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          title?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          column_id: string
          title: string
          details: string | null
          order_index: number
          created_at: string
          updated_at: string
          complexity: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          column_id: string
          title: string
          details?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
          complexity?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          column_id?: string
          title?: string
          details?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
          complexity?: string | null
          tags?: string[] | null
        }
      }
      comments: {
        Row: {
          id: string
          card_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      completed_records: {
        Row: {
          id: string
          card_id: string
          board_id: string
          title: string
          details: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          card_id: string
          board_id: string
          title: string
          details?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          board_id?: string
          title?: string
          details?: string | null
          completed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
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
    : never = never
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
    : never = never
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
