export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin: {
        Row: {
          created_at: string | null
          first_name: string
          id: number
          last_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id?: number
          last_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: number
          last_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      billing: {
        Row: {
          admin_id: number
          amount: number | null
          approved: boolean | null
          approved_at: string | null
          created_at: string | null
          id: number
          invoice: string | null
          link: string | null
          notes: string | null
          wo_id: string
        }
        Insert: {
          admin_id: number
          amount?: number | null
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          id?: number
          invoice?: string | null
          link?: string | null
          notes?: string | null
          wo_id: string
        }
        Update: {
          admin_id?: number
          amount?: number | null
          approved?: boolean | null
          approved_at?: string | null
          created_at?: string | null
          id?: number
          invoice?: string | null
          link?: string | null
          notes?: string | null
          wo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_wo_id_fkey"
            columns: ["wo_id"]
            referencedRelation: "work_order"
            referencedColumns: ["id"]
          }
        ]
      }
      customer: {
        Row: {
          account_number: number | null
          address: string
          address_2: string | null
          city: string
          company_name: string | null
          country: string
          created_at: string
          first_name: string
          id: number
          last_name: string
          phone: number
          state: string
          user_id: string
          zip: number
        }
        Insert: {
          account_number?: number | null
          address: string
          address_2?: string | null
          city: string
          company_name?: string | null
          country: string
          created_at?: string
          first_name: string
          id?: number
          last_name: string
          phone: number
          state: string
          user_id: string
          zip: number
        }
        Update: {
          account_number?: number | null
          address?: string
          address_2?: string | null
          city?: string
          company_name?: string | null
          country?: string
          created_at?: string
          first_name?: string
          id?: number
          last_name?: string
          phone?: number
          state?: string
          user_id?: string
          zip?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      image: {
        Row: {
          created_at: string
          id: string
          type: string
          url: string
          wo_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          type: string
          url: string
          wo_id: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: string
          url?: string
          wo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_wo_id_fkey"
            columns: ["wo_id"]
            referencedRelation: "work_order"
            referencedColumns: ["id"]
          }
        ]
      }
      note: {
        Row: {
          admin_id: number | null
          created_at: string
          customer_id: number | null
          id: number
          note: string
          wo_id: string
        }
        Insert: {
          admin_id?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          note: string
          wo_id: string
        }
        Update: {
          admin_id?: number | null
          created_at?: string
          customer_id?: number | null
          id?: number
          note?: string
          wo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_wo_id_fkey"
            columns: ["wo_id"]
            referencedRelation: "work_order"
            referencedColumns: ["id"]
          }
        ]
      }
      test_result: {
        Row: {
          admin_id: number
          created_at: string | null
          id: number
          link: string
          note: string | null
          wo_id: string
        }
        Insert: {
          admin_id: number
          created_at?: string | null
          id?: number
          link: string
          note?: string | null
          wo_id: string
        }
        Update: {
          admin_id?: number
          created_at?: string | null
          id?: number
          link?: string
          note?: string | null
          wo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_result_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_result_wo_id_fkey"
            columns: ["wo_id"]
            referencedRelation: "work_order"
            referencedColumns: ["id"]
          }
        ]
      }
      work_order: {
        Row: {
          carrier: string
          completed_at: string | null
          created_at: string
          customer_id: number
          details: string
          id: string
          last_update_at: string
          number: string
          part_issues: string[]
          product_number: string
          quanity: number
          return_shipping: string | null
          shipping: string
          tracking_number: string | null
          type: string
        }
        Insert: {
          carrier: string
          completed_at?: string | null
          created_at?: string
          customer_id: number
          details: string
          id?: string
          last_update_at?: string
          number?: string
          part_issues: string[]
          product_number: string
          quanity: number
          return_shipping?: string | null
          shipping: string
          tracking_number?: string | null
          type: string
        }
        Update: {
          carrier?: string
          completed_at?: string | null
          created_at?: string
          customer_id?: number
          details?: string
          id?: string
          last_update_at?: string
          number?: string
          part_issues?: string[]
          product_number?: string
          quanity?: number
          return_shipping?: string | null
          shipping?: string
          tracking_number?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customer"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
