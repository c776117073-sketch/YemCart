import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database, 'public', Database['public']>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Database types (generated from Supabase)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          role: 'admin' | 'seller' | 'customer'
          phone: string | null
          email: string | null
          full_name: string
          created_at: string
        }
        Insert: {
          id?: string
          role: 'admin' | 'seller' | 'customer'
          phone?: string | null
          email?: string | null
          full_name: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'seller' | 'customer'
          phone?: string | null
          email?: string | null
          full_name?: string
          created_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          logo_url: string | null
          banner_url: string | null
          primary_color: string
          about_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          logo_url?: string | null
          banner_url?: string | null
          primary_color?: string
          about_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          banner_url?: string | null
          primary_color?: string
          about_text?: string | null
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          store_id: string
          title: string
          description: string | null
          price: number
          sku: string | null
          stock: number
          category: string | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          title: string
          description?: string | null
          price: number
          sku?: string | null
          stock?: number
          category?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          title?: string
          description?: string | null
          price?: number
          sku?: string | null
          stock?: number
          category?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          is_primary?: boolean
          created_at?: string
        }
        Relationships: []
      }
      shipping_zones: {
        Row: {
          id: string
          store_id: string
          city_name: string
          delivery_fee: number
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          city_name: string
          delivery_fee?: number
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          city_name?: string
          delivery_fee?: number
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          store_id: string
          customer_id: string
          total_amount: number
          status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
          shipping_fee: number
          city: string
          manual_address: string
          payment_method: 'COD'
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          customer_id: string
          total_amount: number
          status?: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
          shipping_fee?: number
          city: string
          manual_address: string
          payment_method?: 'COD'
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          customer_id?: string
          total_amount?: number
          status?: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
          shipping_fee?: number
          city?: string
          manual_address?: string
          payment_method?: 'COD'
          created_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          store_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          store_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          store_id?: string
          content?: string
          created_at?: string
        }
        Relationships: []
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