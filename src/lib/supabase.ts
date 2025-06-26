import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createClientComponentClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client
export const createServerComponentClient = () =>
  createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookies().getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies().set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })

// Admin client for server-side operations
export const createAdminClient = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'manager' | 'user'
          department_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'user'
          department_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'user'
          department_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          name: string
          description: string | null
          category: 'hardware' | 'software'
          type: string
          serial_number: string | null
          model: string | null
          manufacturer: string | null
          purchase_date: string | null
          purchase_cost: number | null
          warranty_expiry: string | null
          status: 'available' | 'assigned' | 'maintenance' | 'retired'
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: 'hardware' | 'software'
          type: string
          serial_number?: string | null
          model?: string | null
          manufacturer?: string | null
          purchase_date?: string | null
          purchase_cost?: number | null
          warranty_expiry?: string | null
          status?: 'available' | 'assigned' | 'maintenance' | 'retired'
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: 'hardware' | 'software'
          type?: string
          serial_number?: string | null
          model?: string | null
          manufacturer?: string | null
          purchase_date?: string | null
          purchase_cost?: number | null
          warranty_expiry?: string | null
          status?: 'available' | 'assigned' | 'maintenance' | 'retired'
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      asset_assignments: {
        Row: {
          id: string
          asset_id: string
          user_id: string
          department_id: string | null
          assigned_date: string
          returned_date: string | null
          notes: string | null
          status: 'active' | 'returned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          user_id: string
          department_id?: string | null
          assigned_date?: string
          returned_date?: string | null
          notes?: string | null
          status?: 'active' | 'returned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          user_id?: string
          department_id?: string | null
          assigned_date?: string
          returned_date?: string | null
          notes?: string | null
          status?: 'active' | 'returned'
          created_at?: string
          updated_at?: string
        }
      }
      asset_movements: {
        Row: {
          id: string
          asset_id: string
          movement_type: 'inward' | 'outward'
          quantity: number
          from_location: string | null
          to_location: string | null
          supplier: string | null
          recipient: string | null
          movement_date: string
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          movement_type: 'inward' | 'outward'
          quantity: number
          from_location?: string | null
          to_location?: string | null
          supplier?: string | null
          recipient?: string | null
          movement_date?: string
          notes?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          movement_type?: 'inward' | 'outward'
          quantity?: number
          from_location?: string | null
          to_location?: string | null
          supplier?: string | null
          recipient?: string | null
          movement_date?: string
          notes?: string | null
          created_by?: string
          created_at?: string
        }
      }
      software_licenses: {
        Row: {
          id: string
          software_name: string
          version: string | null
          license_key: string | null
          license_type: 'perpetual' | 'subscription' | 'volume'
          total_licenses: number
          used_licenses: number
          available_licenses: number
          expiry_date: string | null
          vendor: string | null
          purchase_date: string | null
          cost_per_license: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          software_name: string
          version?: string | null
          license_key?: string | null
          license_type: 'perpetual' | 'subscription' | 'volume'
          total_licenses: number
          used_licenses?: number
          available_licenses?: number
          expiry_date?: string | null
          vendor?: string | null
          purchase_date?: string | null
          cost_per_license?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          software_name?: string
          version?: string | null
          license_key?: string | null
          license_type?: 'perpetual' | 'subscription' | 'volume'
          total_licenses?: number
          used_licenses?: number
          available_licenses?: number
          expiry_date?: string | null
          vendor?: string | null
          purchase_date?: string | null
          cost_per_license?: number | null
          created_at?: string
          updated_at?: string
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
